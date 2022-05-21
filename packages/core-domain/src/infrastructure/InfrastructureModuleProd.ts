import { AsyncContainerModule } from "inversify";
import mongoose from "mongoose";
import { MongoDbFileRepository } from "./repos/file/MongoDbFileRepository";
import { FileRepository } from "../domain/file/FileRepository";
import { StorageService } from "../domain/file/StorageService";
import { DummyStorage } from "./services/storage/web2/DummyStorage";
import { Web3StorageService } from "../domain/file/Web3StorageService";
import { BundlrNetworkStorage } from "./services/storage/web3/BundlrNetworkStorage";
import { MongoDbNFTDraftRepository } from "./repos/nft-draft/MongoDbNFTDraftRepository";
import { NFTDraftRepository } from "../domain/nftDraft/NFTDraftRepository";
import { MongoDbNFTRepository } from "./repos/nft/MongoDbNFTRepository";
import { NFTRepository } from "../domain/nft/NFTRepository";
import { Web3Provider } from "../domain/nft/Web3Provider";
import { AlchemyWeb3Provider } from "./services/web3/AlchemyWeb3Provider";

export class InfrastructureModuleProd extends AsyncContainerModule {
  constructor() {
    super(async (bind) => {
      // config MongoDB Connection
      const InfraProdDB = Symbol.for("InfraProdDB");
      const dbConfig = "mongodb://localhost:27017/?readPreference=primary&appname=EasyBay%20Compass&directConnection=true&ssl=false";
      const connection = await mongoose.createConnection(dbConfig);
      bind(InfraProdDB).toConstantValue(connection);

      // infra
      bind(MongoDbFileRepository.DB).toService(InfraProdDB);
      bind(FileRepository).to(MongoDbFileRepository).inSingletonScope();
      // TODO: prepare S3 bucket
      // bind(StorageService).to(S3Storage).inSingletonScope();
      bind(StorageService).to(DummyStorage).inSingletonScope();
      bind(Web3StorageService).to(BundlrNetworkStorage).inSingletonScope();

      bind(MongoDbNFTDraftRepository.DB).toService(InfraProdDB);
      bind(NFTDraftRepository).to(MongoDbNFTDraftRepository).inSingletonScope();

      bind(MongoDbNFTRepository.DB).toService(InfraProdDB);
      bind(NFTRepository).to(MongoDbNFTRepository).inSingletonScope();
      bind(Web3Provider).to(AlchemyWeb3Provider).inSingletonScope();
    });
  }
}