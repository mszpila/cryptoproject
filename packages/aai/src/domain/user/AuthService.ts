import { UserRepository } from "./UserRepository";
import { User, UserID } from "./User";
import { UserEmail } from "./email/UserEmail";
import { UserAuthStrategy } from "./UserAuthStrategy";
import { UserPassword } from "./password/UserPassword";
import { UserOAuthID } from "./UserOAuthID";
import { DateValue } from "../../../../shared/src/domain/DateValue";
import { BadRequestException } from "@nestjs/common";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository
  ) {
  }

  public async standardRegister(
    email: UserEmail,
    password: UserPassword | null
  ): Promise<User> {
    const alreadyExists: User | null = await this.userRepository.findByEmail(email);

    if (alreadyExists) {
      throw new BadRequestException("Something went wrong");
    }

    const date = new DateValue(new Date());
    const user = new User(new UserID(), email, UserAuthStrategy.STANDARD, password, null, false, date, date, new DateValue(null));

    return this.userRepository.add(user);
  }

  public async googleRegister(
    email: UserEmail,
    oauth: UserOAuthID | null
  ): Promise<User> {
    const alreadyExists: User | null = await this.userRepository.findByEmail(email);

    if (alreadyExists) {
      throw new BadRequestException("Something went wrong");
    }

    const date = new DateValue(new Date());
    const user = new User(new UserID(), email, UserAuthStrategy.GOOGLE, null, oauth, true, date, date, new DateValue(null));

    return this.userRepository.add(user);
  }

  public async standardLogin(email: UserEmail, password: string): Promise<User> {
    const user: User | null = await this.userRepository.findByEmail(email);

    if (!user || !user.getAuthStrategy().equals(UserAuthStrategy.STANDARD)) {
      throw new BadRequestException("Wrong credentials");
    }

    const hashedPassword = user.getHashedPassword();

    const correctPassword = await UserPassword.comparePassword(password, hashedPassword);

    if (!correctPassword) {
      throw new BadRequestException("Wrong credentials");
    }

    return user;
  }

  public async googleLogin(email: UserEmail, oauthId: string): Promise<User> {
    const user: User | null = await this.userRepository.findByEmail(email);

    if (!user || user.getAuthStrategy().equals(UserAuthStrategy.STANDARD)) {
      throw new BadRequestException("Wrong credentials");
    }

    const correctOAuthId = oauthId === user.getOAuth().toString();

    if (!correctOAuthId) {
      throw new BadRequestException("Wrong credentials");
    }

    return user;
  }
}