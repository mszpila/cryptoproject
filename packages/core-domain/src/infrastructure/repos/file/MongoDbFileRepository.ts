import { FileRepository } from "../../../domain/file/FileRepository";
import { File, FileID } from "../../../domain/file/File";
import { NFTDraftID } from "../../../domain/nftDraft/NFTDraft";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { MongoProxy } from "../../../../../shared/src/infrastructure/MongoProxy";
import { FileSnapshot } from "../../../domain/file/FileSnapshot";
import { ConfigService } from "../../../../../ConfigService";
import { Inject } from "../../../../../shared/src/decorators/Inject";
import mongoose from "mongoose";
import { ITranslator } from "../../../../../shared/src/domain/ITranslator";
import { EmitEvents } from "../../../../../shared/src/decorators/EmitEvents";

@Injectable()
export class MongoDbFileRepository implements FileRepository {
  public static readonly DB = Symbol.for("MongoDbFileRepository.DB");
  private readonly fileModel: MongoProxy<FileID, FileSnapshot, File>;

  constructor(
    private readonly configService: ConfigService,
    @Inject(MongoDbFileRepository.DB)
    private readonly connection: mongoose.Connection,
    private readonly collection: string = "core_domain_files"
  ) {
    const fileSchema = new mongoose.Schema({
      _id: { type: mongoose.Schema.Types.ObjectId, alias: "id" },
      nft: mongoose.Schema.Types.ObjectId,
      mimeType: mongoose.Schema.Types.String,
      size: mongoose.Schema.Types.Number,
      web3URI: mongoose.Schema.Types.String,
      createdAt: mongoose.Schema.Types.Date,
      updatedAt: mongoose.Schema.Types.Date,
      deletedAt: mongoose.Schema.Types.Date,
    }, { versionKey: 'version' });

    this.fileModel = new MongoProxy<FileID, FileSnapshot, File>(
      this.connection.model("File", fileSchema, this.collection),
      new MongoDbFileTranslator()
    );
  }

  @EmitEvents()
  public async add(file: File): Promise<void> {
    await this.fileModel.create(file);
  }

  public async find(id: FileID): Promise<File> {
    return this.fileModel.findById(id);
  }

  @EmitEvents()
  public async update(file: File): Promise<void> {
    await this.fileModel.updateOne(file);
  }

  public async findByNFTDraft(nftId: NFTDraftID): Promise<File> {
    return this.fileModel.findOne({ nft: nftId.toObjectID() });
  }
}

class MongoDbFileTranslator implements ITranslator<File, FileSnapshot> {
  toEntity(snapshot: FileSnapshot): File {
    return FileSnapshot.toEntity(snapshot);
  }

  toSnapshot(entity: File): FileSnapshot {
    return entity.toSnapshot();
  }
}