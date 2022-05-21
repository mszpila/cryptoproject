import { DomainEvent } from "../../shared/src/domain/DomainEvent";
import { DomainEventResolver } from "./DomainEventResolver";
import { DateValue } from "../../shared/src/domain/DateValue";
import { Injectable } from "../../shared/src/decorators/Injectable";

export type Writeable<T extends Object> = { -readonly [K in keyof T]: T[K] }

@Injectable()
export class Serializer {
  constructor(
    private readonly registry: DomainEventResolver
  ) {
  }

  public async deserialize<E extends DomainEvent>(eventBuffer: Buffer): Promise<E> {
    const rawEvent = JSON.parse(eventBuffer.toString('utf-8')) as RawDomainEvent;

    const EventConstructor = this.registry.resolveDomainEvent(rawEvent.$name);

    const event = new EventConstructor() as any as Writeable<E>;

    event.$version = rawEvent.$version;
    event.timestamp = new DateValue(new Date(rawEvent.timestamp));
    event.payload = rawEvent.payload;

    return event;
  }

  public async serialize<E extends DomainEvent>(event: E): Promise<Buffer> {
    const serializedJSON: string = JSON.stringify({
      $name: event.$name,
      $version: event.$version,
      timestamp: DateValue.now().toISOString(),
      payload: event.payload,
    });

    return Buffer.from(serializedJSON);
  }
}

interface RawDomainEvent<P extends Object = Object> {
  $name: string;
  $version: number;
  timestamp: string;
  payload: P;
}