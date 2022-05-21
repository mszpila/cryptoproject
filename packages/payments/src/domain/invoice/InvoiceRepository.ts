import { Invoice } from "./Invoice";

export abstract class InvoiceRepository {
  public abstract add(invoice: Invoice): Promise<void>;
}