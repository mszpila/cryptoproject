import * as bcrypt from "bcrypt";
import { BadRequestException } from "@nestjs/common";

export class UserPassword {
  private constructor(private readonly hashedPassword: string) {
  }

  private static isValidPassword(password: string): boolean {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[?!@#$%^&*-])(?=.{8,})/.test(
        password
      )
    ) {
      throw new BadRequestException("Password is not valid");
    }
    return true;
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: UserPassword
  ): Promise<boolean> {
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    if (!result) {
      // throw new BadRequestException('Wrong credentials');
      return false;
    }
    return result;
  }

  static async createPassword(password: string): Promise<UserPassword> {
    if (UserPassword.isValidPassword(password)) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      return new UserPassword(hashedPassword);
    }
  }

  static restoreHashedPassword(password: string): UserPassword {
    return new UserPassword(password);
  }

  toString(): string {
    return this.hashedPassword;
  }
}