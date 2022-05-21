import { Container } from "inversify";
import { ConfigService } from "../../ConfigService";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { DomainModule } from "./domain/DomainModule";
import { EventBusModuleDev } from "../../event-bus/EventBusModuleDev";
import { PaymentHandlersRegistry } from "./domain/handlers/registry/PaymnetHandlersRegistry";

export class PaymentModule {
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

    await container.get(PaymentHandlersRegistry).registerHandlers();
    return container;
  }

  private static async createDevContainer(): Promise<Container> {
    const container = new Container({ autoBindInjectable: true });

    container.load(
      new DomainModule(),
      new EventBusModuleDev()
    );

    await container.get(PaymentHandlersRegistry).registerHandlers();
    return container;
  }
}

