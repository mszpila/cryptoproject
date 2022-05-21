import { File } from "../../domain/file/File";

export class FileDTO {
  public readonly id: string;
  public readonly nft: string;
  public readonly mimeType: string;
  public readonly web3URI: string;
  public readonly size: number;

  constructor(file: File) {
    const fileSnapshot = file.toSnapshot();
    this.id = fileSnapshot.id;
    this.nft = fileSnapshot.nft;
    this.mimeType = fileSnapshot.mimeType;
    this.web3URI = fileSnapshot.web3URI;
    this.size = fileSnapshot.size;
  }
}