import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { EventBus } from "../../../../../shared/src/domain/EventBus";
import { NFTCollectionDeployedHandler } from "../NFTCollectionDeployedHandler";
import { NFTTokenMintedHandler } from "../NFTTokenMintedHandler";

@Injectable()
export class CoreDomainInfrastructureHandlersRegistry {
  constructor(
    private readonly eventBus: EventBus,
    private readonly nftCollectionDeployedHandler: NFTCollectionDeployedHandler,
    private readonly nftTokenMintedHandler: NFTTokenMintedHandler,
  ) {
    Promise.resolve(this.registerHandlers());
  }

  private async registerHandlers(): Promise<void> {
    await this.eventBus.subscribe(this.nftCollectionDeployedHandler.$eventConstructor, this.nftCollectionDeployedHandler);
    await this.eventBus.subscribe(this.nftTokenMintedHandler.$eventConstructor, this.nftTokenMintedHandler);
 }
}