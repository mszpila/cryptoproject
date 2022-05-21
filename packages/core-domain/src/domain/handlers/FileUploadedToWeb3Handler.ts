import { Handler } from "../../../../shared/src/decorators/Handler";
import { FileUploadedToWeb3 } from "../../../../events/core-domain/FileUploadedToWeb3";
import { FileService } from "../file/FileService";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { CoreDomainHandler } from "./registry/CoreDomainHandler";
import { Injectable } from "../../../../shared/src/decorators/Injectable";

@Injectable()
@Handler(FileUploadedToWeb3)
export class FileUploadedToWeb3Handler extends CoreDomainHandler<FileUploadedToWeb3> {
  constructor(
    private readonly fileService: FileService,
  ) {
    super();
  }

  public async handle(event: FileUploadedToWeb3): Promise<void> {
    await this.fileService.uploadMetadataToWeb3(new NFTDraftID(event.payload.nftDraft));
  }
}