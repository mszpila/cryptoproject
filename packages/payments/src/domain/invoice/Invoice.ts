import { Entity } from "../../../../shared/src/domain/Entity";
import { Identifier } from "../../../../shared/src/domain/Identifier";
import { InvoiceSnapshot } from "./InvoiceSnapshot";

export class InvoiceID extends Identifier {}

export class Invoice extends Entity<InvoiceID, InvoiceSnapshot> {
  constructor(
    id: InvoiceID,
  ) {
    super(id);
  }

  public toSnapshot(): InvoiceSnapshot {
    return new InvoiceSnapshot(this);
  }

  public setTxID(id: string): void {
    //
  }
}