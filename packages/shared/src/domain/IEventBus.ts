// import { IEventHandler } from '../decorators/Handler';
// import { DomainEvent } from "./DomainEvent";
//
// export interface ISubscription {
//   cancel(): Promise<void>;
// }
//
// export interface NewableEvent<TEvent extends DomainEvent> {
//   new(...args: any[]): TEvent;
// }
//
// export abstract class IEventBus {
//   abstract publish<E extends DomainEvent>(event: E): Promise<void>;
//   abstract subscribe<E extends DomainEvent>(EventCls: NewableEvent<E>, handler: IEventHandler<E>): Promise<ISubscription>;
// }
