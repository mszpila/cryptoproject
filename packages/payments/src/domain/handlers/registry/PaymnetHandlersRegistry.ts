import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { EventBus } from "../../../../../shared/src/domain/EventBus";
import { NFTCostPreparedHandler } from "../NFTCostPreparedHandler";

@Injectable()
export class PaymentHandlersRegistry {
  constructor(
    private readonly eventBus: EventBus,
    private readonly nftCostPreparedHandler: NFTCostPreparedHandler
  ) {
  }

  public async registerHandlers(): Promise<void> {
    await this.eventBus.subscribe(this.nftCostPreparedHandler.$eventConstructor, this.nftCostPreparedHandler);
  }
}