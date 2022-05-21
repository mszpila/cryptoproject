import { AsyncContainerModule } from "inversify";
import { EventBus } from "../shared/src/domain/EventBus";
import { NodeNativeEventBus } from "./infrastructure/NodeNativeEventBus";
import { DomainEventResolver } from "./domain/DomainEventResolver";
import { Serializer } from "./domain/Serializer";
import { CoreDomainRegistry } from "../events/core-domain/registry/CoreDomainRegistry";

export class EventBusModuleProd extends AsyncContainerModule {
  constructor() {
    super(async (bind) => {
      bind(EventBus).to(NodeNativeEventBus).inSingletonScope();
      bind(DomainEventResolver).toSelf().inSingletonScope();
      bind(Serializer).toSelf().inSingletonScope();
      bind(CoreDomainRegistry).toSelf().inSingletonScope();
    });
  }
}