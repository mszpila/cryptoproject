import { DomainEvent } from "./DomainEvent";
import { Injectable } from "@nestjs/common";
import { DomainEventHandler } from "./DomainEventHandler";

export interface ISubscription {
  cancel(): Promise<void>;
}

export interface NewableEvent<TEvent extends DomainEvent> {
  new(...args: any[]): TEvent;
}

@Injectable()
export abstract class EventBus {
  abstract publish<E extends DomainEvent>(event: E): Promise<void>;
  abstract subscribe<E extends DomainEvent>(EventCls: NewableEvent<E>, handler: DomainEventHandler): Promise<ISubscription>;
}