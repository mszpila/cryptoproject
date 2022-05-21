import { FileService } from "../file/FileService";
import { Handler } from "../../../../shared/src/decorators/Handler";
import { FileUploaded } from "../../../../events/core-domain/FileUploaded";
import { FileID } from "../file/File";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { CoreDomainHandler } from "./registry/CoreDomainHandler";
import { NFTDraftRepository } from "../nftDraft/NFTDraftRepository";
import { Web3Provider } from "../nft/Web3Provider";

@Injectable()
@Handler(FileUploaded)
export class FileUploadedHandler extends CoreDomainHandler<FileUploaded> {
  constructor(
    private readonly web3Provider: Web3Provider,
    private readonly nftRepository: NFTDraftRepository,
    private readonly fileService: FileService
  ) {
    super();
  }

  public async handle(event: FileUploaded): Promise<void> {
    await this.fileService.updateFileSize(new FileID(event.payload.file));
  }
}