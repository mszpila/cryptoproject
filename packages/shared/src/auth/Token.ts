import { BadRequestException } from "@nestjs/common";

export class Token {
  constructor(
    private readonly token: string,
  ) {
    if (!token.length) throw new BadRequestException('Token cannot be empty');
    this.token = token;
  }

  public toString(): string {
    return this.token;
  }
}