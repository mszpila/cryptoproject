import { Identifier } from "../../../../../shared/src/domain/Identifier";
import { Entity } from "../../../../../shared/src/domain/Entity";
import { UserID } from "../User";
import { ResetPasswordTokenSnapshot } from "./ResetPasswordTokenSnapshot";

export class ResetPasswordTokenID extends Identifier {
}

export class ResetPasswordToken extends Entity<ResetPasswordTokenID, ResetPasswordTokenSnapshot> {
  constructor(
    id: ResetPasswordTokenID,
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