import { NFTDraftRepository } from "../../../domain/nftDraft/NFTDraftRepository";
import { NFTDraft, NFTDraftID } from "../../../domain/nftDraft/NFTDraft";
import * as mongoose from "mongoose";
import { ConfigService } from "../../../../../ConfigService";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { Inject } from "../../../../../shared/src/decorators/Inject";
import { MongoProxy } from "../../../../../shared/src/infrastructure/MongoProxy";
import { NFTDraftSnapshot } from "../../../domain/nftDraft/NFTDraftSnapshot";
import { ITranslator } from "../../../../../shared/src/domain/ITranslator";
import { EmitEvents } from "../../../../../shared/src/decorators/EmitEvents";

@Injectable()
export class MongoDbNFTDraftRepository implements NFTDraftRepository {
  public static readonly DB = Symbol.for("MongoDbNFTDraftRepository.DB");
  private readonly nftModel: MongoProxy<NFTDraftID, NFTDraftSnapshot, NFTDraft>;

  constructor(
    private readonly configService: ConfigService,
    @Inject(MongoDbNFTDraftRepository.DB)
    private readonly connection: mongoose.Connection,
    private readonly collection: string = "core_domain_nft_drafts"
  ) {
    const optionsSchema = new mongoose.Schema({});

    const nftSchema = new mongoose.Schema({
      _id: { type: mongoose.Schema.Types.ObjectId, alias: "id" },
      creator: mongoose.Schema.Types.ObjectId,
      options: mongoose.Schema.Types.Mixed,
      metadata: mongoose.Schema.Types.Mixed,
      web3URI: mongoose.Schema.Types.String,
      createdAt: mongoose.Schema.Types.Date,
      updatedAt: mongoose.Schema.Types.Date,
      deletedAt: mongoose.Schema.Types.Date,
    }, { versionKey: "version" });

    this.nftModel = new MongoProxy<NFTDraftID, NFTDraftSnapshot, NFTDraft>(
      this.connection.model("NFT", nftSchema, this.collection),
      new MongoDbNFTTranslator()
    );
  }

  @EmitEvents()
  public async add(nft: NFTDraft): Promise<void> {
    await this.nftModel.create(nft);
  }

  public async findById(nftId: NFTDraftID): Promise<NFTDraft | null> {
    return this.nftModel.findById(nftId);
  }

  @EmitEvents()
  public async update(nft: NFTDraft): Promise<void> {
    await this.nftModel.updateOne(nft);
  }

  @EmitEvents()
  delete(nftId: NFTDraftID): Promise<void> {
    return Promise.resolve(undefined);
  }
}

class MongoDbNFTTranslator implements ITranslator<NFTDraft, NFTDraftSnapshot> {
  toEntity(snapshot: NFTDraftSnapshot): NFTDraft {
    return NFTDraftSnapshot.toEntity(snapshot);
  }

  toSnapshot(entity: NFTDraft): NFTDraftSnapshot {
    return entity.toSnapshot();
  }

}