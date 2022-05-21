import { Entity } from "../domain/Entity";
import { EventBus } from "../domain/EventBus";
import { inject } from "inversify";

/**
 * @private
 */
class EmitEventsDecorator {
  constructor(
    private target: any,
    private propertyKey: string,
    private descriptorOrPositionNumber: number | TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
  ) {
  }

  private injectEventBusIfNotInjected(): void {
    if (!Reflect.hasMetadata("injected:bus", this.target)) {
      inject(EventBus)(this.target, EmitEventsDecorator.EVENT_BUS_KEY);
      Reflect.defineMetadata("injected:bus", true, this.target);
    }
  }

  private isArgumentDecorator(): boolean {
    return typeof this.descriptorOrPositionNumber === "number";
  }

  decorate(): void {
    if (this.isArgumentDecorator()) {
      this.decorateArgument();
    } else {
      this.decorateMethod();
    }
  }

  private decorateArgument() {
    const argumentRoots = this.getArgumentRoots();

    if (!argumentRoots.has(this.propertyKey)) {
      argumentRoots.set(this.propertyKey, new Set());
    }

    argumentRoots.get(this.propertyKey)!.add(this.descriptorOrPositionNumber as number);

    this.defineArgumentRoots(argumentRoots);
  }

  private decorateMethod() {
    this.injectEventBusIfNotInjected();

    type AnyAsyncFunction = (...args: any[]) => Promise<any>;

    const descriptor = this.descriptorOrPositionNumber as TypedPropertyDescriptor<AnyAsyncFunction>;
    const originalFunction: AnyAsyncFunction = descriptor.value!;
    const positions = this.getArgumentsPositions();

    descriptor.value = async function(this: any, ...args: any[]) {
      const result = await originalFunction.apply(this, args);

      const emitOnArgs = async (args: any) => {
        for (const _arg of args) {
          const isArrayArg = Array.isArray(_arg);

          if (isArrayArg) {
            await emitOnArgs(_arg);
          }

          if (_arg instanceof Entity) {
            await EmitEventsDecorator.publishEventsAndReset(this, _arg);
          }
        }
      };

      if (positions.length !== 0) {
        for (const pos of positions) {
          await EmitEventsDecorator.publishEventsAndReset(this, args[pos]);
        }
      } else {
        await emitOnArgs(args);
      }

      return result;
    };
  }

  private getArgumentRoots(): Map<string, Set<number>> {
    return Reflect.getMetadata("arguments:roots", this.target) || new Map<string, Set<number>>();
  }

  private defineArgumentRoots(map: Map<string, Set<number>>) {
    Reflect.defineMetadata("arguments:roots", map, this.target);
  }

  private getArgumentsPositions(): number[] {
    const argumentRoots: Map<string, Set<number>> = this.getArgumentRoots();

    if (!argumentRoots.has(this.propertyKey)) {
      return [];
    }

    return Array.from(argumentRoots.get(this.propertyKey)!.values());
  }

  private static async publishEventsAndReset(ctx: any, entity: Entity<any, any>): Promise<void> {
    const eventBus = ctx[EmitEventsDecorator.EVENT_BUS_KEY];

    for (const event of entity.events) {
      await eventBus.publish(event);
    }

    entity.resetEvents();
  }

  private static readonly EVENT_BUS_KEY = "@@__eventBus";
}

/**
 * Decorates async function in that way that emits events on all or marked aggregates positions.
 * Use as parameter decorator to mark positions needed event emitting.
 * Parent class should be marked as injectable.
 * @constructor
 */
export function EmitEvents() {
  return function(
    target: any,
    propertyKey: string,
    descriptorOrPositionNumber: number | TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
  ): void {
    new EmitEventsDecorator(target, propertyKey, descriptorOrPositionNumber).decorate();
  };
}
