import NodeBundlr from "@bundlr-network/client";
import BigNumber from "bignumber.js";
import { Readable } from "stream";
import { Web3StorageService } from "../../../../domain/file/Web3StorageService";
import { NFTDraftID } from "../../../../domain/nftDraft/NFTDraft";
import { File } from "../../../../domain/file/File";
import { FileRepository } from "../../../../domain/file/FileRepository";
import { ConfigService } from "../../../../../../ConfigService";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { NFTMetadata } from "../../../../domain/nftDraft/NFTMetadata";
import { NFTDraftRepository } from "../../../../domain/nftDraft/NFTDraftRepository";

@Injectable()
export class BundlrNetworkStorage implements Web3StorageService {
  private readonly RPC = this.configService.get<string>("BUNDLER_NETWORK.RPC");
  private readonly CURRENCY = this.configService.get<string>("BUNDLER_NETWORK.CURRENCY");
  private readonly WALLET = this.configService.get<string>("BUNDLER_NETWORK.WALLET");
  private readonly WALLET_RPC = this.configService.get<string>("BUNDLER_NETWORK.WALLET_RPC");

  private readonly bundlr: NodeBundlr;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository,
    private readonly nftDraftRepository: NFTDraftRepository
  ) {
    this.bundlr = new NodeBundlr(this.RPC, this.CURRENCY, this.WALLET, { providerUrl: this.WALLET_RPC });
  }

  getMetadata(nftId: NFTDraftID): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async uploadFile(file: Readable): Promise<URL> {
    return new Promise((resolve, reject) => {
      const bytes: Uint8Array[] = [];

      file.on("data", async (data) => {
        bytes.push(data);
      });

      file.on("end", async () => {
        const tx = this.bundlr.createTransaction(Buffer.concat(bytes));
        await tx.sign();
        await tx.upload();

        resolve(new URL(`https://arweave.org/${tx}`));
      });
    });
  }

  public async uploadFileAlt(file: Readable, fileEntity: File): Promise<void> {
    const bytes: Uint8Array[] = [];

    file.on("data", async (data) => {
      bytes.push(data);
    });

    file.on("end", async () => {
      const tx = this.bundlr.createTransaction(Buffer.concat(bytes));
      await tx.sign();
      await this.bundlr.uploader.chunkedTransactionUploader(Readable.from(tx.getRaw()), tx.id, tx.getRaw().length);

      fileEntity.setWeb3URI(new URL(`https://arewave.org/${tx.id}`));
      await this.fileRepository.update(fileEntity);
    });
  }

  public async uploadMetadata(nftMetadata: NFTMetadata): Promise<URL> {
    const tx = await this.bundlr.createTransaction(Buffer.from(JSON.stringify(nftMetadata)));
    await tx.sign();
    await tx.upload();

    return new URL(`https://arweave.org/${tx.id}`);
  }

  public async getFilePrice(file: File): Promise<string> {
    const price = await this.bundlr.getPrice(file.getSize());
    return price.toString();
  }

  public async fundAccount(amount: number): Promise<void> {
    await this.bundlr.fund(amount * 1_000_000_000);
  }

  public async getBalance(): Promise<BigNumber> {
    return this.bundlr.getBalance("GAmgZHLtMFS1dPbDoz9nCavCYwVcGJpJS8fzZUcS942B");
  }
}