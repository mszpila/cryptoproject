import { Entity } from "../../../../shared/src/domain/Entity";
import { NFTDraftSnapshot } from "./NFTDraftSnapshot";
import { Identifier } from "../../../../shared/src/domain/Identifier";
import { UserID } from "../UserID";
import { NFTMetadata } from "./NFTMetadata";
import { BlockchainType } from "../nft/BlockchainType";
import { NFTStandard } from "../nft/NFTStandard";
import { DateValue } from "../../../../shared/src/domain/DateValue";

export class NFTDraftID extends Identifier {
}

export type TokenID = string | number;

export class NFTDraft extends Entity<NFTDraftID, NFTDraftSnapshot> {
  constructor(
    id: NFTDraftID,
    private creator: UserID | null,
    private options: { blockchainType: BlockchainType, nftStandard: NFTStandard }[],
    private metadata: NFTMetadata | null,
    private web3URI: URL | null,
    private createdAt: DateValue,
    private updatedAt: DateValue,
    private deletedAt: DateValue,
  ) {
    super(id);
  }

  public toSnapshot(): NFTDraftSnapshot {
    return new NFTDraftSnapshot(this);
  }

  public getCreator(): UserID {
    return this.creator;
  }

  // public markAsReady(): void {
  //   if (!this.state.equals(NFTState.DRAFT)) {
  //     throw new UnprocessableEntityException("NFT is already created");
  //   }
  //
  //   this.state = NFTState.READY;
  // }

  // public markAsSellable(): void {
  //   if (this.state.equals(NFTState.DRAFT)) {
  //     throw new UnprocessableEntityException("NFT is not created yet");
  //   }
  //
  //   this.state = NFTState.PUBLISHED;
  // }

  // public markAsUnsellable(): void {
  //   if (this.state.equals(NFTState.DRAFT)) {
  //     throw new UnprocessableEntityException("NFT is not created yet");
  //   }
  //
  //   this.state = NFTState.READY;
  // }

  public updateMetadata(metadata: NFTMetadata): void {
    // if (!this.state.equals(NFTState.DRAFT)) throw new ConflictException("Forbidden metadata update");
    this.metadata = metadata;
    this.updatedAt = DateValue.now();
  }

  public getMetadata(): NFTMetadata | null {
    return this.metadata;
  }

  public getSelectedOptions(): { blockchainType: BlockchainType, nftStandard: NFTStandard }[] {
    return this.options;
  }

  public setOptions(options: { blockchainType: BlockchainType, nftStandard: NFTStandard }[]): void {
    this.options = options;
    this.updatedAt = DateValue.now();
  }

  public setWeb3URI(uri: URL): void {
    this.web3URI = uri;
    this.updatedAt = DateValue.now();
  }

  public getWeb3URI(): URL {
    return this.web3URI;
  }

  // public setCollection(collectionName: NFTTitle, collectionSymbol: NFTTitle | null): void {
  //   if (!this.state.equals(NFTState.DRAFT)) throw new ConflictException("Forbidden collection name update");
  //
  //   this.collectionName = collectionName;
  //   this.collectionSymbol = collectionSymbol || new NFTTitle(collectionName.toString().substring(0, 3));
  // }
  //
  // public getCollectionName(): NFTTitle | null {
  //   return this.collectionName;
  // }
  //
  // public getSymbol(): NFTTitle | null {
  //   return this.collectionSymbol;
  // }

  public isDeleted(): boolean {
    return !this.deletedAt.isNullable();
  }

  public getCreatedDate(): DateValue {
    return this.createdAt;
  }

  public getUpdatedDate(): DateValue {
    return this.updatedAt;
  }

  public getDeletedDate(): DateValue {
    return this.deletedAt;
  }
}