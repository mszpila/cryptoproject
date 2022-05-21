import { BadRequestException } from "@nestjs/common";

export class UserEmail {
  constructor(
    private readonly email: string
  ) {
    const formattedEmail = this.reformatEmail(email);

    if (!this.validateEmail(formattedEmail)) {
      throw new BadRequestException(`Given email is not valid: ${email}`);
    }

    this.email = formattedEmail;
  }

  private reformatEmail(input: string): string {
    return input.trim().toLocaleLowerCase();
  }

  private validateEmail(input: string): boolean {
    return /\A[a-z\d!#$%&'*+\/=?^_‘{|}~-]+(?:\.[a-z\d!#$%&'*+\/=?^_‘{|}~-]+)*@(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?\z/.test(input);
  }
}