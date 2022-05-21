import { Entity } from "../../../../shared/src/domain/Entity";
import { UserSnapshot } from "./UserSnapshot";
import { Identifier } from "../../../../shared/src/domain/Identifier";
import { UserEmail } from "./email/UserEmail";
import { UserAuthStrategy } from "./UserAuthStrategy";
import { UserPassword } from "./password/UserPassword";
import { UserOAuthID } from "./UserOAuthID";
import { DateValue } from "../../../../shared/src/domain/DateValue";

export class UserID extends Identifier {
}

export class User extends Entity<UserID, UserSnapshot> {
  constructor(
    id: UserID,
    private email: UserEmail,
    private authStrategy: UserAuthStrategy,
    private password: UserPassword | null,
    private oauth: UserOAuthID | null,
    private emailVerified: boolean,
    private createdAt: DateValue,
    private updatedAt: DateValue,
    private deletedAt: DateValue
  ) {
    super(id);
  }

  public toSnapshot(): UserSnapshot {
    return undefined;
  }

  public getEmail(): UserEmail {
    return this.email;
  }

  public getAuthStrategy(): UserAuthStrategy {
    return this.authStrategy;
  }

  public getHashedPassword(): UserPassword | null {
    return this.password;
  }

  public getOAuth(): UserOAuthID | null {
    return this.oauth;
  }

  public isEmailVerified(): boolean {
    return this.emailVerified;
  }

  public isDeleted(): boolean {
    return !this.deletedAt.isNullable();
  }

  public updatePassword(password: UserPassword): void {
    this.password = password;
  }

  public verifyEmail(): void {
    this.emailVerified = true;
  }
}