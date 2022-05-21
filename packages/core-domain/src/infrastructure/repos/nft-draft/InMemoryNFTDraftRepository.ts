import { NFTDraftRepository } from "../../../domain/nftDraft/NFTDraftRepository";
import { NFTDraft, NFTDraftID } from "../../../domain/nftDraft/NFTDraft";
import { NFTDraftSnapshot } from "../../../domain/nftDraft/NFTDraftSnapshot";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { EmitEvents } from "../../../../../shared/src/decorators/EmitEvents";

@Injectable()
export class InMemoryNFTDraftRepository implements NFTDraftRepository {
  private readonly db: Map<string, NFTDraftSnapshot> = new Map();

  @EmitEvents()
  public async add(nft: NFTDraft): Promise<void> {
    this.db.set(nft.id.toString(), nft.toSnapshot());
  }

  public async findById(nftId: NFTDraftID): Promise<NFTDraft | null> {
    const nft = this.db.get(nftId.toString()) || null;
    return nft ? NFTDraftSnapshot.toEntity(nft) : null;
  }

  @EmitEvents()
  public async update(nft: NFTDraft): Promise<void> {
    this.db.set(nft.id.toString(), nft.toSnapshot());
  }

  public async delete(nftId: NFTDraftID): Promise<void> {
    this.db.delete(nftId.toString());
  }
}