import { DomainEvent } from "../../shared/src/domain/DomainEvent";
import { NewableEvent } from "../../shared/src/domain/EventBus";
import { Injectable } from "../../shared/src/decorators/Injectable";

export type ClassConstructor<T extends DomainEvent = DomainEvent, TArgs extends Array<any> = any[]> = new (...args: TArgs) => T;

@Injectable()
export class DomainEventResolver {
  private readonly domainEventRegistry: Map<string, ClassConstructor> = new Map();

  public registerDomainEvent(event: ClassConstructor): void {
    this.domainEventRegistry.set(this.getEventName(event), Object.getPrototypeOf(event).constructor);
  }

  public resolveDomainEvent(eventName: string): ClassConstructor {
    return this.domainEventRegistry.get(eventName);
  }

  public getEventName<E extends DomainEvent>(EventCls: NewableEvent<E>): string {
    return (new EventCls({})).$name;
  }

  public getDomainEventRegistry(): Map<string, ClassConstructor> {
    return this.domainEventRegistry;
  }
}