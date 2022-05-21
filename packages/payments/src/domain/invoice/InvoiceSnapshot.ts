import { Versionable } from "../../../../shared/src/domain/IVersionable";
import { Invoice, InvoiceID } from "./Invoice";

export class InvoiceSnapshot implements Versionable {
  public readonly id: string;
  public readonly version: number;

  constructor(invoice: Invoice) {
    this.id = invoice.id.toString();
    this.version = invoice.version;
  }

  public static toEntity(snapshot: InvoiceSnapshot): Invoice {
    return new Invoice(
      new InvoiceID(snapshot.id),
    )
  }
}