import { BadRequestException } from "@nestjs/common";

export class TokenValue {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new BadRequestException("Token in not valid");
    }

    this.value = value;
  }

  private isValid(value: string): boolean {
    return /[a-zA-Z\d]/.test(value);
  }
}