import { UserID } from "../UserID";
import { BlockchainAddress } from "../nft/NFT";

export class OfferService {
  public async transferNFTOwnership(blockchainExternalId: BlockchainAddress, from: UserID, to: UserID): Promise<void> {
  }
}