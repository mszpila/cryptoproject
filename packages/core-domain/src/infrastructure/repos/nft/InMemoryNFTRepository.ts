import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { NFTRepository } from "../../../domain/nft/NFTRepository";
import { EmitEvents } from "../../../../../shared/src/decorators/EmitEvents";
import { NFT } from "../../../domain/nft/NFT";
import { NFTDraftID } from "../../../domain/nftDraft/NFTDraft";
import { UserID } from "../../../domain/UserID";

@Injectable()
export class InMemoryNFTRepository implements NFTRepository {
  private readonly db: Map<string, NFT> = new Map();

  @EmitEvents()
  public async add(nft: NFT): Promise<void> {
    this.db.set(nft.id.toString(), nft);
  }

  @EmitEvents()
  public async deleteByNFT(id: NFTDraftID): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async findByID(id: NFTDraftID): Promise<NFT> {
    return this.db.get(id.toString());
  }

  public async findByOwner(userId: UserID): Promise<NFT[]> {
    const result: NFT[] = [];
    for (let snapshot of this.db.values()) {
      if (snapshot.getOwner().equals(userId)) {
        result.push(snapshot);
      }
    }

    return result;
  }
}