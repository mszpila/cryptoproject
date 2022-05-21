import TestWeave from "testweave-sdk";
import { Web3StorageService } from "../../../../domain/file/Web3StorageService";
import Arweave from "arweave";
import { Injectable } from "@nestjs/common";
import { NFTDraftID } from "../../../../domain/nftDraft/NFTDraft";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { createTransactionAsync, uploadTransactionAsync } from "arweave-stream-tx";
import { CreateTransactionInterface } from "arweave/node/common";
import { File } from "core-domain/src/domain/file/File";
import { ConfigService } from "../../../../../../ConfigService";
import { NFTMetadata } from "../../../../domain/nftDraft/NFTMetadata";

@Injectable()
export class TestWeaveStorage implements Web3StorageService {
  private readonly ARWEAVE_URI = "ARWEAVE_URI";
  private readonly ARWEAVE_PORT = "ARWEAVE_PORT";
  private readonly ARWEAVE_PROTOCOL = "ARWEAVE_PROTOCOL";
  private readonly arweave: Arweave;
  private readonly testweave: TestWeave;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.arweave = Arweave.init({
      host: this.configService.get<string>(this.ARWEAVE_URI),
      port: this.configService.get<number>(this.ARWEAVE_PORT),
      protocol: this.configService.get<string>(this.ARWEAVE_PROTOCOL)
    });

    this.testweave = new Promise((resolve, reject) => {
      TestWeave.init(this.arweave).then(result => resolve(result)).catch(reject);
    }) as any as TestWeave;
  }

  getFilePrice(file: File): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getMetadata(nftId: NFTDraftID): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async uploadFile(file: Readable): Promise<any> {
    const wallet = await this.testweave.rootJWK;
    // const generatedAddr = await this.arweave.wallets.getAddress(wallet);
    // await this.testweave.drop(generatedAddr, '10000');

    file.on("data", async () => {

    });

    const txAttrs = <Partial<CreateTransactionInterface>>{
      reward: "1"
    };
    const tx = await pipeline(file, createTransactionAsync(txAttrs, this.arweave, wallet));
    await this.arweave.transactions.sign(tx, wallet);
    await pipeline(file, uploadTransactionAsync(tx, this.arweave));
    await this.testweave.mine();

    console.log("id: ", tx.id);
    console.log("tx: ", tx);
  }

  uploadMetadata(nftMetadata: NFTMetadata): Promise<URL> {
    return Promise.resolve(new URL(""));
  }
}