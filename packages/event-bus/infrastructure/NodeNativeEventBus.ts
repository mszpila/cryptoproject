import { EventBus, NewableEvent } from "../../shared/src/domain/EventBus";
import { DomainEvent } from "../../shared/src/domain/DomainEvent";
import { Serializer } from "../domain/Serializer";
import { DomainEventHandler } from "../../shared/src/domain/DomainEventHandler";
import { EventEmitter2 } from "eventemitter2";
import { Injectable } from "../../shared/src/decorators/Injectable";


@Injectable()
export class NodeNativeEventBus implements EventBus {
  private readonly eventEmitter: EventEmitter2 = new EventEmitter2();

  constructor(
    private readonly serializer: Serializer
  ) {
  }

  public async publish<E extends DomainEvent>(event: E): Promise<void> {
    const serializedEvent = await this.serializer.serialize(event);
    this.eventEmitter.emit(event.$name, serializedEvent);
  }

  public async subscribe<E extends DomainEvent>(EventCls: NewableEvent<E>, handler: DomainEventHandler): Promise<ISubscription> {
    const eventName = this.getEventName(EventCls);
    const self = this;

    this.eventEmitter.addListener(eventName, subscribeFunction);

    function subscribeFunction(serializedEvent: any) {
      self.serializer
        .deserialize(serializedEvent)
        .then(event => handler.handle(event as E))
        .catch(err => console.error(err));
    }

    return {
      cancel: async () => {
        this.eventEmitter.removeListener(eventName, subscribeFunction);
      }
    }
  }

  private getEventName<E extends DomainEvent>(EventCls: NewableEvent<E>): string {
    return (new EventCls({})).$name;
  }
}

export interface ISubscription {
  cancel(): Promise<void>;
}