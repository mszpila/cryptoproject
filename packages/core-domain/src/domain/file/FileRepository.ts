import { File, FileID } from "./File";
import { NFTDraftID } from "../nftDraft/NFTDraft";

export abstract class FileRepository {
  abstract find(id: FileID): Promise<File>;

  abstract add(file: File): Promise<void>;

  abstract update(file: File): Promise<void>;

  abstract findByNFTDraft(nftId: NFTDraftID): Promise<File>;
}