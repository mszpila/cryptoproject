import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { Handler } from "../../../../shared/src/decorators/Handler";
import { NFTCollectionDeployed } from "../../../../events/core-domain/infrastructure/NFTCollectionDeployed";
import { CoreDomainInfrastructureHandler } from "./registry/CoreDomainInfrastructureHandler";

@Injectable()
@Handler(NFTCollectionDeployed)
export class NFTCollectionDeployedHandler extends CoreDomainInfrastructureHandler<NFTCollectionDeployed> {
  constructor() {
    super();
  }

  public async handle(event: NFTCollectionDeployed): Promise<void> {
    // TODO: create collection entity and watch it with cron
  }
}