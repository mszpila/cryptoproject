import { EventBus } from "../../../../../shared/src/domain/EventBus";
import { EthereumNFTCreatedHandler } from "../EthereumNFTCreatedHandler";
import { FileUploadedHandler } from "../FileUploadedHandler";
import { FileUploadedToWeb3Handler } from "../FileUploadedToWeb3Handler";
import { MetadataUploadedToWeb3Handler } from "../MetadataUploadedToWeb3Handler";
import { NFTDraftPurchasedHandler } from "../NFTDraftPurchasedHandler";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { NFTOnWeb3CreatedHandler } from "../NFTOnWeb3CreatedHandler";

@Injectable()
export class CoreDomainHandlersRegistry {
  constructor(
    private readonly eventBus: EventBus,
    private readonly ethereumNFTCreatedHandler: EthereumNFTCreatedHandler,
    private readonly fileUploadedHandler: FileUploadedHandler,
    private readonly fileUploadedToWeb3Handler: FileUploadedToWeb3Handler,
    private readonly metadataUploadedToWeb3Handler: MetadataUploadedToWeb3Handler,
    private readonly nftPurchasedHandler: NFTDraftPurchasedHandler,
    private readonly nftOnWeb3Created: NFTOnWeb3CreatedHandler
  ) {
  }

  public async registerHandlers(): Promise<void> {
    await this.eventBus.subscribe(this.ethereumNFTCreatedHandler.$eventConstructor, this.ethereumNFTCreatedHandler);
    await this.eventBus.subscribe(this.fileUploadedHandler.$eventConstructor, this.fileUploadedHandler);
    await this.eventBus.subscribe(this.fileUploadedToWeb3Handler.$eventConstructor, this.fileUploadedToWeb3Handler);
    await this.eventBus.subscribe(this.metadataUploadedToWeb3Handler.$eventConstructor, this.metadataUploadedToWeb3Handler);
    await this.eventBus.subscribe(this.nftPurchasedHandler.$eventConstructor, this.nftPurchasedHandler);
    await this.eventBus.subscribe(this.nftOnWeb3Created.$eventConstructor, this.nftOnWeb3Created);
  }
}