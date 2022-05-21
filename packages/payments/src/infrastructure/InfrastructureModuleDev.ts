import { ContainerModule } from "inversify";
import { PaymentProvider } from "../domain/PaymentProvider";
import { DummyPaymentProvider } from "./providers/DummyPaymentProvider";
import { InvoiceRepository } from "../domain/invoice/InvoiceRepository";
import { InMemoryInvoiceRepository } from "./repos/InMemoryInvoiceRepository";

export class InfrastructureModuleDev extends ContainerModule {
  constructor() {
    super((bind) => {
      bind(PaymentProvider).to(DummyPaymentProvider).inSingletonScope();
      bind(InvoiceRepository).to(InMemoryInvoiceRepository).inSingletonScope();
    });
  }
}