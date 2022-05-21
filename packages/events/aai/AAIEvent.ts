import { DomainEvent } from "../../shared/src/domain/DomainEvent";

export class AAIEvent<T> extends DomainEvent<T> {
  protected boundedContextName(): string {
    return "auth-and-identity";
  }
}