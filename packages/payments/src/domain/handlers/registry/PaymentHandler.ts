import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { DomainEvent } from "../../../../../shared/src/domain/DomainEvent";
import { DomainEventHandler } from "../../../../../shared/src/domain/DomainEventHandler";

@Injectable()
export abstract class PaymentHandler<E extends DomainEvent = DomainEvent> extends DomainEventHandler<E> {
  $eventConstructor: any;
  $eventName: string;
  $eventVersion: number;

  public abstract handle(event: DomainEvent): Promise<void>;

  handlerName(): string {
    return "payment";
  }
}