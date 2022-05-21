import { File, FileID } from "./File";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { Versionable } from "../../../../shared/src/domain/IVersionable";
import { DateValue } from "../../../../shared/src/domain/DateValue";

export class FileSnapshot implements Versionable {
  public readonly id: string;
  public readonly nft: string;
  public readonly mimeType: string;
  public readonly size: number;
  public readonly web3URI: string | null;
  public readonly version: number;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly deletedAt: string | null;

  constructor(file: File) {
    this.id = file.id.toString();
    this.nft = file.getBelongingNFT().toString();
    this.mimeType = file.getMimeType();
    this.size = file.getSize();
    this.web3URI = file.getWeb3URI() ? file.getWeb3URI().toString() : null;
    this.version = file.version;
    this.createdAt = file.getCreatedDate().toISOString();
    this.updatedAt = file.getUpdatedDate().toISOString();
    this.deletedAt = file.getDeletedDate().toISOStringOrNull();
  }

  public static toEntity(snapshot: FileSnapshot): File {
    return new File(
      new FileID(snapshot.id),
      new NFTDraftID(snapshot.nft),
      snapshot.mimeType,
      snapshot.size,
      snapshot.web3URI ? new URL(snapshot.web3URI) : null,
      new DateValue(snapshot.createdAt),
      new DateValue(snapshot.updatedAt),
      new DateValue(snapshot.deletedAt),
    );
  }
}