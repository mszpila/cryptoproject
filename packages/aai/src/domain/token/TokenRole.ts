import { Enum } from "../../../../shared/src/domain/Enum";

@Enum.decorate()
export class TokenRole extends Enum {
  public static readonly USER = new TokenRole("USER");
  public static readonly ADMIN = new TokenRole("ADMIN");
}