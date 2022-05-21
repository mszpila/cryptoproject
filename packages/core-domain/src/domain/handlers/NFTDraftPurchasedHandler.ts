import { Handler } from "../../../../shared/src/decorators/Handler";
import { NFTDraftPurchased } from "../../../../events/core-domain/NFTDraftPurchased";
import { FileService } from "../file/FileService";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { CoreDomainHandler } from "./registry/CoreDomainHandler";
import { Injectable } from "../../../../shared/src/decorators/Injectable";

@Injectable()
@Handler(NFTDraftPurchased)
export class NFTDraftPurchasedHandler extends CoreDomainHandler<NFTDraftPurchased> {
  constructor(
    private readonly fileService: FileService
  ) {
    super();
  }

  public async handle(event: NFTDraftPurchased): Promise<void> {
    await this.fileService.uploadFileToWeb3(new NFTDraftID(event.payload.nftDraft));
  }
}