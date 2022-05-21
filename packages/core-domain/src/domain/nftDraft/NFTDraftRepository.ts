import { NFTDraft, NFTDraftID } from "./NFTDraft";

export abstract class NFTDraftRepository {
  abstract add(nft: NFTDraft): Promise<void>;

  abstract findById(nftId: NFTDraftID): Promise<NFTDraft | null>;

  abstract update(nft: NFTDraft): Promise<void>;

  abstract delete(nftId: NFTDraftID): Promise<void>;
}