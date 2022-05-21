import { DomainEventResolver } from "../../../event-bus/domain/DomainEventResolver";
import { Injectable } from "../../../shared/src/decorators/Injectable";
import { ConfirmEmailTokenCreated } from "../ConfirmEmailTokenCreated";

@Injectable()
export class AAIRegistry {
  constructor(
    private readonly registry: DomainEventResolver
  ) {
    this.registerDomainEventInRegistry();
  }

  private registerDomainEventInRegistry() {
    this.registry.registerDomainEvent(ConfirmEmailTokenCreated);
  }

  public getRegistry(): DomainEventResolver {
    return this.registry;
  }
}