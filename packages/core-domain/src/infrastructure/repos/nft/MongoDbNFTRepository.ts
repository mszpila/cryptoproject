import { NFTRepository } from "../../../domain/nft/NFTRepository";
import { NFT, NFTID } from "../../../domain/nft/NFT";
import { NFTSnapshot } from "../../../domain/nft/NFTSnapshot";
import { EmitEvents } from "../../../../../shared/src/decorators/EmitEvents";
import { Inject } from "../../../../../shared/src/decorators/Inject";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { MongoProxy } from "../../../../../shared/src/infrastructure/MongoProxy";
import { ConfigService } from "../../../../../ConfigService";
import mongoose from "mongoose";
import { ITranslator } from "../../../../../shared/src/domain/ITranslator";
import { UserID } from "../../../domain/UserID";

@Injectable()
export class MongoDbNFTRepository implements NFTRepository {
  public static readonly DB = Symbol.for("MongoDbNFTRepository.DB");
  private readonly nftModel: MongoProxy<NFTID, NFTSnapshot, NFT>;

  constructor(
    private readonly configService: ConfigService,
    @Inject(MongoDbNFTRepository.DB)
    private readonly connection: mongoose.Connection,
    private readonly collection: string = "core_domain_nfts"
  ) {
    const web3Schema = new mongoose.Schema({
      _id: { type: mongoose.Schema.Types.ObjectId, alias: "id" },
      owner: mongoose.Schema.Types.ObjectId,
      processed: mongoose.Schema.Types.Boolean,
      blockchainType: mongoose.Schema.Types.String,
      contract: mongoose.Schema.Types.String,
      token: mongoose.Schema.Types.String,
      standard: mongoose.Schema.Types.String,
      deposit: mongoose.Schema.Types.String,
      metadataURI: mongoose.Schema.Types.String,
      createdAt: mongoose.Schema.Types.Date,
      updatedAt: mongoose.Schema.Types.Date,
      deletedAt: mongoose.Schema.Types.Date,
    }, { versionKey: "version" });

    this.nftModel = new MongoProxy<NFTID, NFTSnapshot, NFT>(
      this.connection.model("Web3", web3Schema, this.collection),
      new MongoDbWeb3Translator()
    );
  }

  @EmitEvents()
  public async add(web3: NFT): Promise<void> {
    console.log("to db:", web3.toSnapshot());
    await this.nftModel.create(web3);
  }

  @EmitEvents()
  deleteByNFT(id: NFTID): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async findByID(id: NFTID): Promise<NFT> {
    return this.nftModel.findById(id);
  }

  public async findByOwner(userId: UserID): Promise<NFT[]> {
    return this.nftModel.find({ owner: userId.toString() });
  }
}

class MongoDbWeb3Translator implements ITranslator<NFT, NFTSnapshot> {
  toEntity(snapshot: NFTSnapshot): NFT {
    return NFTSnapshot.toEntity(snapshot);
  }

  toSnapshot(entity: NFT): NFTSnapshot {
    return entity.toSnapshot();
  }
}