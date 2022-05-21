import { AsyncContainerModule } from "inversify";
import { FileRepository } from "../domain/file/FileRepository";
import { InMemoryFileRepository } from "./repos/file/InMemoryFileRepository";
import { StorageService } from "../domain/file/StorageService";
import { DummyStorage } from "./services/storage/web2/DummyStorage";
import { Web3StorageService } from "../domain/file/Web3StorageService";
import { DummyWeb3Storage } from "./services/storage/web3/DummyWeb3Storage";
import { NFTDraftRepository } from "../domain/nftDraft/NFTDraftRepository";
import { InMemoryNFTDraftRepository } from "./repos/nft-draft/InMemoryNFTDraftRepository";
import { NFTRepository } from "../domain/nft/NFTRepository";
import { InMemoryNFTRepository } from "./repos/nft/InMemoryNFTRepository";
import { Web3Provider } from "../domain/nft/Web3Provider";
import { DummyNFTWeb3DataProvider } from "./services/web3/DummyNFTWeb3DataProvider";

export class InfrastructureModuleDev extends AsyncContainerModule {
  constructor() {
    super(async (bind) => {
      bind(FileRepository).to(InMemoryFileRepository).inSingletonScope();
      bind(StorageService).to(DummyStorage).inSingletonScope();
      bind(Web3StorageService).to(DummyWeb3Storage).inSingletonScope();

      bind(NFTDraftRepository).to(InMemoryNFTDraftRepository).inSingletonScope();

      bind(NFTRepository).to(InMemoryNFTRepository).inSingletonScope();
      bind(Web3Provider).to(DummyNFTWeb3DataProvider).inSingletonScope();
    });
  }
}