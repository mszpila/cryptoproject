import { Identifier } from "../../../../../shared/src/domain/Identifier";
import { ConfirmEmailTokenSnapshot } from "./ConfirmEmailTokenSnapshot";
import { Entity } from "../../../../../shared/src/domain/Entity";
import { UserID } from "../User";
import { ResetPasswordTokenSnapshot } from "../password/ResetPasswordTokenSnapshot";

export class ConfirmEmailTokenID extends Identifier {
}

export class ConfirmEmailToken extends Entity<ConfirmEmailTokenID, ConfirmEmailTokenSnapshot> {
  constructor(
    id: ConfirmEmailTokenID,
    private readonly user: UserID
  ) {
    super(id);
  }

  public toSnapshot(): ResetPasswordTokenSnapshot {
    return undefined;
  }

  public getUser(): UserID {
    return this.user;
  }
}