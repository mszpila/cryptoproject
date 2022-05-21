import { Web3StorageService } from "../../../../domain/file/Web3StorageService";
import { NFTDraftID } from "../../../../domain/nftDraft/NFTDraft";
import Arweave from "arweave";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { createTransactionAsync } from "arweave-stream-tx";
import { JWKInterface } from "arweave/node/lib/wallet";
import { File } from "../../../../domain/file/File";
import { ConfigService } from "../../../../../../ConfigService";
import { NFTMetadata } from "../../../../domain/nftDraft/NFTMetadata";

@Injectable()
export class ArweaveStorage implements Web3StorageService {
  private readonly ARWEAVE_URI = 'ARWEAVE_URI';
  private readonly ARWEAVE_PORT = 'ARWEAVE_PORT';
  private readonly ARWEAVE_PROTOCOL = 'ARWEAVE_PROTOCOL';
  private readonly arweave: Arweave;
  private wallet: JWKInterface;

  constructor(
    private readonly configService: ConfigService,
  ) {
    // this.arweave = Arweave.init({
    //   host: this.configService.get<string>(this.ARWEAVE_URI),
    //   port: this.configService.get<number>(this.ARWEAVE_PORT),
    //   protocol: this.configService.get<string>(this.ARWEAVE_PROTOCOL),
    // });

    this.arweave = Arweave.init({
      host: 'arweave.net',
      protocol: 'https',
      port: 443,
      logging: false,
      timeout: 15000,
    });
    // this.wallet = await this.arweave.wallets.generate();
  }

  getMetadata(nftId: NFTDraftID): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async uploadFile(file: Readable): Promise<any> {
    this.wallet = await this.arweave.wallets.generate();

    const tx = await pipeline(file, createTransactionAsync({}, this.arweave, this.wallet));
    // await this.arweave.transactions.sign(tx, this.wallet);
    // await pipeline(file, uploadTransactionAsync(tx, this.arweave));
    return;
  }

  getFilePrice(file: File): Promise<string> {
    throw new Error("Method not implemented.");
  }

  uploadMetadata(nftMetadata: NFTMetadata): Promise<URL> {
    return Promise.resolve(new URL(""));
  }
}