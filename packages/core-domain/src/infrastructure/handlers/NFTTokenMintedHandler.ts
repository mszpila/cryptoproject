import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { Handler } from "../../../../shared/src/decorators/Handler";
import { CoreDomainInfrastructureHandler } from "./registry/CoreDomainInfrastructureHandler";
import { NFTTokenMinted } from "../../../../events/core-domain/infrastructure/NFTTokenMinted";

@Injectable()
@Handler(NFTTokenMinted)
export class NFTTokenMintedHandler extends CoreDomainInfrastructureHandler {
  constructor() {
    super();
  }

  public async handle(event: NFTTokenMinted): Promise<void> {
    // TODO: create token entity and watch it with cron
  }
}