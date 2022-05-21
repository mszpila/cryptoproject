import { InvoiceRepository } from "../../domain/invoice/InvoiceRepository";
import { Invoice } from "../../domain/invoice/Invoice";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { EmitEvents } from "../../../../shared/src/decorators/EmitEvents";

@Injectable()
export class InMemoryInvoiceRepository implements InvoiceRepository {
  private readonly db: Map<string, any> = new Map();

  @EmitEvents()
  public async add(invoice: Invoice): Promise<void> {
    this.db.set(invoice.id.toString(), invoice);
  }

}