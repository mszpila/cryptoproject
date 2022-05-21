import { BadRequestException } from '@nestjs/common';

export class Token {

  private readonly token: string;

  constructor(token: string) {
    this.assertCorrectToken(token);
    this.token = token;
  }

  private assertCorrectToken(token: string) {
    if (!token || !token.length) {
      throw new BadRequestException('Token cannot be null or empty string');
    }
  }

  public toString(): string {
    return this.token;
  }
}
