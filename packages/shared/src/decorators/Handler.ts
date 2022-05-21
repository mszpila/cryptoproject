import { DomainEvent } from "../domain/DomainEvent";

export function Handler<E extends DomainEvent>(EventConstructor: any): Function {
  return function(HandlerConstructor: any) {
    const dummyEvent: DomainEvent = new EventConstructor({});

    const proto = HandlerConstructor.prototype;

    proto.$eventName = dummyEvent.$name;
    proto.$eventVersion = dummyEvent.$version;
    proto.$eventConstructor = EventConstructor;

    return HandlerConstructor;
  };
}

// class HandlerDomainEventDecorator {
//   constructor(
//     private HandlerClass: any,
//     private EventConstructor: any,
//   ) {
//   }
//
//   private injectEventBusIfNotInjected(): void {
//     if (!Reflect.hasMetadata('injected:bus', this.HandlerClass)) {
//       Inject(EventBus)(this.HandlerClass, HandlerDomainEventDecorator.EVENT_BUS_KEY);
//       Reflect.defineMetadata('injected:bus', true, this.HandlerClass);
//     }
//   }
//
//   private static readonly EVENT_BUS_KEY = '@@__eventBus_handler';
//
//   decorate(): void {
//     this.injectEventBusIfNotInjected();
//     const dummyEvent: DomainEvent = new this.EventConstructor({});
//
//     const proto = this.HandlerClass.prototype;
//
//     proto.$eventName = dummyEvent.$name;
//     proto.$eventVersion = dummyEvent.$version;
//     proto.$eventConstructor = this.EventConstructor;
//
//     const eventBus: EventBus = this.HandlerClass[HandlerDomainEventDecorator.EVENT_BUS_KEY];
//
//     eventBus.subscribe(dummyEvent, this.HandlerClass);
//   }
// }

