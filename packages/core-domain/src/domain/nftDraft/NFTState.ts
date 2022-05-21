import { Enum } from "../../../../shared/src/domain/Enum";

@Enum.decorate()
export class NFTState extends Enum {
  public static readonly DRAFT = new NFTState('DRAFT');
  public static readonly READY = new NFTState('READY');
  public static readonly PUBLISHED = new NFTState('PUBLISHED');
  public static readonly DEPOSIT = new NFTState('DEPOSIT');
}