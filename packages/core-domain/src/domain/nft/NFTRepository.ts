import { NFT, NFTID } from "./NFT";
import { UserID } from "../UserID";

export abstract class NFTRepository {
  public abstract findByID(id: NFTID): Promise<NFT>;

  public abstract findByOwner(userId: UserID): Promise<NFT[]>;

  public abstract deleteByNFT(id: NFTID): Promise<void>;

  public abstract add(nft: NFT): Promise<void>;

}
