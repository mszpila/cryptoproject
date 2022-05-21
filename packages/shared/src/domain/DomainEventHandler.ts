import { DomainEvent } from "./DomainEvent";
import { Injectable } from "../decorators/Injectable";

@Injectable()
export abstract class DomainEventHandler<E extends DomainEvent = DomainEvent> {
  abstract handlerName(): string;

  abstract handle(message: E): Promise<void> | void;

  abstract $eventName?: string;
  abstract $eventVersion?: number;
  abstract $eventConstructor?: any;
}