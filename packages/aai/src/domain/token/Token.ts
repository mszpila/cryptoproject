import { Identifier } from "../../../../shared/src/domain/Identifier";
import { Entity } from "../../../../shared/src/domain/Entity";
import { TokenSnapshot } from "./TokenSnapshot";
import { TokenValue } from "./TokenValue";
import { TokenRole } from "./TokenRole";
import { UserID } from "../user/User";

export class TokenID extends Identifier {
}

export class Token extends Entity<TokenID, TokenSnapshot> {
  constructor(
    id: TokenID,
    private user: UserID,
    private value: TokenValue,
    private role: TokenRole
  ) {
    super(id);
  }

  toSnapshot(): TokenSnapshot {
    return undefined;
  }

  public getUser(): UserID {
    return this.user;
  }

  public isAdmin(): boolean {
    return this.role.equals(TokenRole.ADMIN);
  }

  public getValue(): TokenValue {
    return this.value;
  }
}