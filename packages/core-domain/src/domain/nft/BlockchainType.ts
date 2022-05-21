import { Enum } from "../../../../shared/src/domain/Enum";

@Enum.decorate()
export class BlockchainType extends Enum {
  public static readonly ETHEREUM = new BlockchainType("ETHEREUM");
  public static readonly POLYGON = new BlockchainType("POLYGON");
  public static readonly SOLANA = new BlockchainType("SOLANA");
}