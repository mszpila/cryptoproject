import { NFTDraftRepository } from "../nftDraft/NFTDraftRepository";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { Injectable } from "@nestjs/common";
import { NFTService } from "../nft/NFTService";

@Injectable()
export class NFTMetadataSavedOnWeb3StorageHandler {
  constructor(
    private readonly web3Service: NFTService,
    private readonly nftRepository: NFTDraftRepository
  ) {
  }

  public async handle(event: any): Promise<void> {
    const nft = await this.nftRepository.findById(new NFTDraftID(event.payload.nft));
    await this.web3Service.createNFT(nft);
  }
}