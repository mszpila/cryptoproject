import { MetadataUploadedToWeb3 } from "../../../../events/core-domain/MetadataUploadedToWeb3";
import { Handler } from "../../../../shared/src/decorators/Handler";
import { NFTDraftRepository } from "../nftDraft/NFTDraftRepository";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { CoreDomainHandler } from "./registry/CoreDomainHandler";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { NFTService } from "../nft/NFTService";

@Injectable()
@Handler(MetadataUploadedToWeb3)
export class MetadataUploadedToWeb3Handler extends CoreDomainHandler<MetadataUploadedToWeb3> {
  constructor(
    private readonly nftDraftRepository: NFTDraftRepository,
    private readonly web3Service: NFTService
  ) {
    super();
  }

  public async handle(event: MetadataUploadedToWeb3): Promise<void> {
    const nft = await this.nftDraftRepository.findById(new NFTDraftID(event.payload.nftDraft));
    await this.web3Service.createNFT(nft);
  }
}