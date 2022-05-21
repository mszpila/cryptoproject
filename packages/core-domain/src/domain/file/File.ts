import { Identifier } from "../../../../shared/src/domain/Identifier";
import { Entity } from "../../../../shared/src/domain/Entity";
import { FileSnapshot } from "./FileSnapshot";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { DateValue } from "../../../../shared/src/domain/DateValue";

export class FileID extends Identifier {
}

export class File extends Entity<FileID, FileSnapshot> {
  constructor(
    id: FileID,
    private nft: NFTDraftID,
    private mimeType: string,
    private size: number,
    private web3URI: URL | null,
    private createdAt: DateValue,
    private updatedAt: DateValue,
    private deletedAt: DateValue
  ) {
    super(id);
  }

  public getBelongingNFT(): NFTDraftID {
    return this.nft;
  }

  public getMimeType(): string {
    return this.mimeType;
  }

  public toSnapshot(): FileSnapshot {
    return new FileSnapshot(this);
  }

  public setWeb3URI(uri: URL): void {
    this.web3URI = uri;
    this.updatedAt = DateValue.now();
  }

  public getWeb3URI(): URL | null {
    return this.web3URI;
  }

  public getSize(): number {
    return this.size;
  }

  public setSize(size: number): void {
    this.size = size;
    this.updatedAt = DateValue.now();
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