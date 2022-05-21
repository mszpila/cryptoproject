import { DomainEvent } from "../../shared/src/domain/DomainEvent";

export class CoreDomainEvent<T> extends DomainEvent<T> {
  protected boundedContextName(): string {
    return "core-domain";
  }
}