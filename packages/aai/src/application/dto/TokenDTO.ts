import { Token } from "../../domain/token/Token";

export class TokenDTO {
  public readonly token: string;

  constructor(token: Token) {
    this.token = token.id.toString();
  }
}