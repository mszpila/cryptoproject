import { Handler } from "../../../../shared/src/decorators/Handler";
import { EthereumNFTCreated } from "../../../../events/core-domain/EthereumNFTCreated";
import { CoreDomainHandler } from "./registry/CoreDomainHandler";
import { NFTDraftRepository } from "../nftDraft/NFTDraftRepository";
import { Injectable } from "../../../../shared/src/decorators/Injectable";

@Injectable()
@Handler(EthereumNFTCreated)
export class EthereumNFTCreatedHandler extends CoreDomainHandler<EthereumNFTCreated> {
  constructor(
    private readonly nftRepository: NFTDraftRepository
  ) {
    super();
  }

  public async handle(event: EthereumNFTCreated): Promise<void> {
    console.log('NFT created')
  }
}