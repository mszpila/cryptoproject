import { Handler } from "../../../../shared/src/decorators/Handler";
import { CoreDomainHandler } from "./registry/CoreDomainHandler";
import { NFTDraftRepository } from "../nftDraft/NFTDraftRepository";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { NFTOnWeb3Created } from "../../../../events/core-domain/NFTOnWeb3Created";

@Injectable()
@Handler(NFTOnWeb3Created)
export class NFTOnWeb3CreatedHandler extends CoreDomainHandler<NFTOnWeb3Created> {
  constructor(
    private readonly nftRepository: NFTDraftRepository
  ) {
    super();
  }

  public async handle(event: NFTOnWeb3Created): Promise<void> {
    console.log('Notify user about fresh NFT');
  }
}