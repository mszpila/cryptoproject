import { UserID } from "../UserID";
import { BlockchainType } from "./BlockchainType";
import { TokenID } from "../nftDraft/NFTDraft";
import { Identifier } from "../../../../shared/src/domain/Identifier";
import { NFTStandard } from "./NFTStandard";
import { Entity } from "../../../../shared/src/domain/Entity";
import { NFTSnapshot } from "./NFTSnapshot";
import { DateValue } from "../../../../shared/src/domain/DateValue";

export class NFTID extends Identifier {
}

export class BlockchainAddress {
  constructor(private readonly id: string) {
  }

  public toString(): string {
    return this.id;
  }
}

export class NFT extends Entity<NFTID, NFTSnapshot> {
  constructor(
    id: NFTID,
    private owner: UserID,
    private processed: boolean,
    private blockchainType: BlockchainType,
    private contract: BlockchainAddress,
    private token: TokenID | null,
    private standard: NFTStandard,
    private deposit: BlockchainAddress | null,
    private metadataURI: URL,
    private createdAt: DateValue,
    private updatedAt: DateValue,
    private deletedAt: DateValue,
  ) {
    super(id);
  }

  public toSnapshot(): NFTSnapshot {
    return new NFTSnapshot(this);
  }

  public isProcessed(): boolean {
    return this.processed;
  }

  public markAsProcessing(): void {
    this.processed = false;
    this.updatedAt = DateValue.now();
  }

  public markAsProcessed(): void {
    this.processed = true;
    this.updatedAt = DateValue.now();
  }

  public getBlockchainType(): BlockchainType {
    return this.blockchainType;
  }

  public getContract(): BlockchainAddress {
    return this.contract;
  }

  public getTokenID(): TokenID | null {
    return this.token;
  }

  public getStandard(): NFTStandard {
    return this.standard;
  }

  public getDeposit(): BlockchainAddress | null {
    return this.deposit;
  }

  public getOwner(): UserID {
    return this.owner;
  }

  public changeOwner(owner: UserID): void {
    this.owner = owner;
    this.updatedAt = DateValue.now();
  }

  public getMetadataURI(): URL {
    return this.metadataURI;
  }

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