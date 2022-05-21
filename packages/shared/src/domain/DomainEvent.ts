import { DateValue } from './DateValue';

interface BasicObject {
  [key: string]: any
}

export abstract class DomainEvent<T extends Object = BasicObject> {
  public readonly $name: string;
  public readonly payload: T;
  public readonly $version: number;
  public readonly timestamp: DateValue = DateValue.now();

  constructor(payload: T) {
    this.$name = `${this.boundedContextName()}/${this.constructor.name}`;
    this.payload = payload;
  }

  protected abstract boundedContextName(): string;
}