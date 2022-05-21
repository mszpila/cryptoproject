import { ContainerModule } from "inversify";
import { NFTDraftFactory } from "./nftDraft/NFTDraftFactory";
import { FileService } from "./file/FileService";
import { NFTService } from "./nft/NFTService";
import { CoreDomainHandler } from "./handlers/registry/CoreDomainHandler";
import { CoreDomainHandlersRegistry } from "./handlers/registry/CoreDomainHandlersRegistry";
import { EthereumNFTCreatedHandler } from "./handlers/EthereumNFTCreatedHandler";
import { FileUploadedHandler } from "./handlers/FileUploadedHandler";
import { FileUploadedToWeb3Handler } from "./handlers/FileUploadedToWeb3Handler";
import { MetadataUploadedToWeb3Handler } from "./handlers/MetadataUploadedToWeb3Handler";
import { NFTDraftPurchasedHandler } from "./handlers/NFTDraftPurchasedHandler";
import { ConfigService } from "../../../ConfigService";

export class DomainModule extends ContainerModule {
  constructor() {
    super((bind) => {
      // domain
      bind(NFTDraftFactory).toSelf();
      bind(FileService).toSelf();
      bind(NFTService).toSelf();

      // handlers
      bind(CoreDomainHandler).toSelf().inSingletonScope();
      bind(CoreDomainHandlersRegistry).toSelf();
      bind(EthereumNFTCreatedHandler).toSelf().inSingletonScope();
      bind(FileUploadedHandler).toSelf().inSingletonScope();
      bind(FileUploadedToWeb3Handler).toSelf().inSingletonScope();
      bind(MetadataUploadedToWeb3Handler).toSelf().inSingletonScope();
      bind(NFTDraftPurchasedHandler).toSelf().inSingletonScope();

      // config
      bind(ConfigService).toSelf().inSingletonScope();
    });
  }
}