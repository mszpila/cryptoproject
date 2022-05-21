import { BlockchainAddress, NFT, NFTID } from "./NFT";
import { UserID } from "../UserID";
import { BlockchainType } from "./BlockchainType";
import { NFTStandard } from "./NFTStandard";
import { DateValue } from "../../../../shared/src/domain/DateValue";

export class NFTSnapshot {
  public readonly id: string;
  public readonly owner: string;
  public readonly processed: boolean;
  public readonly blockchainType: string;
  public readonly contract: string;
  public readonly token: string | null;
  public readonly standard: string;
  public readonly deposit: string | null;
  public readonly version: number;
  public readonly metadataURI: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly deletedAt: string | null;

  constructor(nft: NFT) {
    this.id = nft.id.toString();
    this.owner = nft.getOwner().toString();
    this.processed = nft.isProcessed();
    this.blockchainType = nft.getBlockchainType().toString();
    this.contract = nft.getContract().toString();
    this.token = nft.getTokenID().toString();
    this.standard = nft.getStandard().toString();
    this.deposit = nft.getDeposit() ? nft.getDeposit().toString() : null;
    this.version = nft.version;
    this.metadataURI = nft.getMetadataURI().toString();
    this.createdAt = nft.getCreatedDate().toISOString();
    this.updatedAt = nft.getUpdatedDate().toISOString();
    this.deletedAt = nft.getDeletedDate().toISOStringOrNull();
  }

  public static toEntity(snapshot: NFTSnapshot): NFT {
    return new NFT(
      new NFTID(snapshot.id),
      new UserID(snapshot.owner),
      snapshot.processed,
      new BlockchainType(snapshot.blockchainType),
      new BlockchainAddress(snapshot.contract),
      snapshot.token ? snapshot.token : null,
      new NFTStandard(snapshot.standard),
      snapshot.deposit ? new BlockchainAddress(snapshot.deposit) : null,
      new URL(snapshot.metadataURI),
      new DateValue(snapshot.createdAt),
      new DateValue(snapshot.updatedAt),
      new DateValue(snapshot.deletedAt),
    );
  }
}