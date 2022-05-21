import { NFTDraft, NFTDraftID } from "./NFTDraft";
import { Versionable } from "../../../../shared/src/domain/IVersionable";
import { UserID } from "../UserID";
import { BlockchainType } from "../nft/BlockchainType";
import { NFTStandard } from "../nft/NFTStandard";
import { DateValue } from "../../../../shared/src/domain/DateValue";
import { NFTMetadata } from "./NFTMetadata";

export class NFTDraftSnapshot implements Versionable {
  public readonly id: string;
  public readonly creator: string | null;
  public readonly options: { blockchainType: string, nftStandard: string }[];
  public readonly metadata: any | null;
  public readonly version: number;
  public readonly web3URI: string | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly deletedAt: string | null;

  constructor(nft: NFTDraft) {
    this.id = nft.id.toString();
    this.creator = nft.getCreator().toString();
    this.options = nft.getSelectedOptions().map(options => ({
      blockchainType: options.blockchainType.toString(),
      nftStandard: options.nftStandard.toString()
    }));
    this.metadata = nft.getMetadata() ? nft.getMetadata() : null;
    this.version = nft.version;
    this.web3URI = nft.getWeb3URI() ? nft.getWeb3URI().toString() : null;
    this.createdAt = nft.getCreatedDate().toISOString();
    this.updatedAt = nft.getUpdatedDate().toISOString();
    this.deletedAt = nft.getDeletedDate().toISOStringOrNull();
  }

  /**
   * TODO: set metadata
   * @param snapshot
   */
  public static toEntity(snapshot: NFTDraftSnapshot): NFTDraft {
    return new NFTDraft(
      new NFTDraftID(snapshot.id),
      snapshot.creator ? new UserID(snapshot.creator) : null,
      snapshot.options.map(options => ({
        blockchainType: new BlockchainType(options.blockchainType),
        nftStandard: new NFTStandard(options.nftStandard)
      })),
      snapshot.metadata ? new NFTMetadata(snapshot.metadata) : null,
      snapshot.web3URI ? new URL(snapshot.web3URI) : null,
      new DateValue(snapshot.createdAt),
      new DateValue(snapshot.updatedAt),
      new DateValue(snapshot.deletedAt),
    );
  }
}