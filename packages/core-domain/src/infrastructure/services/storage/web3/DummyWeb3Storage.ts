import { Web3StorageService } from "../../../../domain/file/Web3StorageService";
import { NFTDraftID } from "../../../../domain/nftDraft/NFTDraft";
import { Readable } from "stream";
import { File } from "../../../../domain/file/File";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { FileRepository } from "../../../../domain/file/FileRepository";
import { NFTMetadata } from "../../../../domain/nftDraft/NFTMetadata";

@Injectable()
export class DummyWeb3Storage implements Web3StorageService {
  constructor(
    private readonly fileRepository: FileRepository
  ) {
  }

  getMetadata(nftId: NFTDraftID): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async uploadFile(file: Readable): Promise<URL> {
    const randomUUID = new NFTDraftID().toString();

    return new URL(`https://example.com/${randomUUID}:tx-id`);
  }

  getFilePrice(file: File): Promise<string> {
    return Promise.resolve("");
  }

  uploadMetadata(nftMetadata: NFTMetadata): Promise<URL> {
    return Promise.resolve(new URL(`https://example.com`));
  }
}