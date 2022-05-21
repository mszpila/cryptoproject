import { Enum } from "../../../../shared/src/domain/Enum";

@Enum.decorate()
export class UserAuthStrategy extends Enum {
  public static readonly STANDARD = new UserAuthStrategy("STANDARD");
  public static readonly GOOGLE = new UserAuthStrategy("GOOGLE");
}