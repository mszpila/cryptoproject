import {Identifier} from "../domain/Identifier";

class UserID extends Identifier {}

export class TokenPayload {
  constructor(
    public readonly userId: UserID,
  ) {
  }
}