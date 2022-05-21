import { User } from "../../domain/user/User";

export class UserDTO {
  public readonly id: string;

  constructor(user: User) {
    this.id = user.id.toString();
  }
}