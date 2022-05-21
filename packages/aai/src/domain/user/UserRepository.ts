import { User, UserID } from "./User";
import { UserEmail } from "./email/UserEmail";

export abstract class UserRepository {
  public abstract add(user: User): Promise<User>;

  public abstract update(user: User): Promise<void>;

  public abstract findById(userId: UserID): Promise<User | null>;

  public abstract findByEmail(userEmail: UserEmail): Promise<User | null>;
}