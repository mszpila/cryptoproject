import { DomainEventResolver } from "../../../event-bus/domain/DomainEventResolver";
import { EthereumNFTCreated } from "../EthereumNFTCreated";
import { FileSizeSet } from "../FileSizeSet";
import { FileUploaded } from "../FileUploaded";
import { FileUploadedToWeb3 } from "../FileUploadedToWeb3";
import { MetadataUploadedToWeb3 } from "../MetadataUploadedToWeb3";
import { NFTDraftPurchased } from "../NFTDraftPurchased";
import { Injectable } from "../../../shared/src/decorators/Injectable";
import { NFTOnWeb3Created } from "../NFTOnWeb3Created";
import { NFTCostPrepared } from "../NFTCostPrepared";

@Injectable()
export class CoreDomainRegistry {
  constructor(
    private readonly registry: DomainEventResolver
  ) {
  }

  public registerDomainEventInRegistry() {
    this.registry.registerDomainEvent(EthereumNFTCreated);
    this.registry.registerDomainEvent(FileSizeSet);
    this.registry.registerDomainEvent(FileUploaded);
    this.registry.registerDomainEvent(FileUploadedToWeb3);
    this.registry.registerDomainEvent(MetadataUploadedToWeb3);
    this.registry.registerDomainEvent(NFTDraftPurchased);
    this.registry.registerDomainEvent(NFTOnWeb3Created);
    this.registry.registerDomainEvent(NFTCostPrepared);
  }
}