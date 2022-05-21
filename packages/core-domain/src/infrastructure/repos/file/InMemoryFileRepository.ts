import { FileRepository } from "../../../domain/file/FileRepository";
import { File, FileID } from "../../../domain/file/File";
import { NFTDraftID } from "../../../domain/nftDraft/NFTDraft";
import { FileSnapshot } from "../../../domain/file/FileSnapshot";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { EmitEvents } from "../../../../../shared/src/decorators/EmitEvents";

@Injectable()
export class InMemoryFileRepository implements FileRepository {
  private readonly db: Map<string, FileSnapshot> = new Map();

  @EmitEvents()
  public async add(file: File): Promise<void> {
    this.db.set(file.id.toString(), file.toSnapshot());
    this.db.set(file.getBelongingNFT().toString(), file.toSnapshot());
  }

  public async find(id: FileID): Promise<File> {
    const file = this.db.get(id.toString());
    return file ? FileSnapshot.toEntity(file) : null;
  }

  @EmitEvents()
  public async update(file: File): Promise<void> {
    this.db.set(file.id.toString(), file.toSnapshot());
    this.db.set(file.getBelongingNFT().toString(), file.toSnapshot());
  }

  public async findByNFTDraft(nftId: NFTDraftID): Promise<File> {
    const file = this.db.get(nftId.toString());
    return file ? FileSnapshot.toEntity(file) : null;
  }
}