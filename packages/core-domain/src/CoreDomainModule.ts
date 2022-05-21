import { Container } from "inversify";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { DomainModule } from "./domain/DomainModule";
import { EventBusModuleDev } from "../../event-bus/EventBusModuleDev";
import { InfrastructureModuleProd } from "./infrastructure/InfrastructureModuleProd";
import { InfrastructureModuleDev } from "./infrastructure/InfrastructureModuleDev";
import { ConfigService } from "../../ConfigService";
import { CoreDomainHandlersRegistry } from "./domain/handlers/registry/CoreDomainHandlersRegistry";
import { CoreDomainRegistry } from "../../events/core-domain/registry/CoreDomainRegistry";

export class CoreDomainModule {
  public static async create(): Promise<Container> {
    const config = ConfigService.getEnv() || process.env.CONFIG;

    if (process.env.LAZY_ENV === "prod" && !config) {
      throw new RuntimeException("Config is not provided for production environment");
    }

    if (process.env.LAZY_ENV === "prod") {
      return this.createProdContainer();
    }

    return this.createDevContainer();
  }

  private static async createProdContainer(): Promise<Container> {
    const container = new Container({ autoBindInjectable: true });

    container.load(
      new DomainModule(),
      new EventBusModuleDev()
    );

    await container.loadAsync(
      new InfrastructureModuleProd()
    );

    container.get(CoreDomainRegistry).registerDomainEventInRegistry();
    await container.get(CoreDomainHandlersRegistry).registerHandlers();
    return container;
  }

  private static async createDevContainer(): Promise<Container> {
    const container = new Container({ autoBindInjectable: true });

    container.load(
      new DomainModule(),
      new InfrastructureModuleDev(),
      new EventBusModuleDev()
    );

    container.get(CoreDomainRegistry).registerDomainEventInRegistry();
    await container.get(CoreDomainHandlersRegistry).registerHandlers();
    return container;
  }
}