import { NFTDraft } from "../../domain/nftDraft/NFTDraft";

export class DraftCreatedDTO {
  public readonly id: string;

  constructor(nft: NFTDraft) {
    this.id = nft.id.toString();
  }
}