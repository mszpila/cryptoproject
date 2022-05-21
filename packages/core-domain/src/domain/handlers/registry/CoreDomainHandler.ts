import { DomainEventHandler } from "../../../../../shared/src/domain/DomainEventHandler";
import { DomainEvent } from "../../../../../shared/src/domain/DomainEvent";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";

@Injectable()
export abstract class CoreDomainHandler<E extends DomainEvent = DomainEvent> extends DomainEventHandler<E> {
  $eventConstructor: any;
  $eventName: string;
  $eventVersion: number;

  public abstract handle(event: DomainEvent): Promise<void>;

  handlerName(): string {
    return "core-domain";
  }
}