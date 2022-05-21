import { CoreDomainEvent } from "../CoreDomainEvent";

interface NFTCollectionDeployedPayload {
  collection: string;
}

export class NFTCollectionDeployed extends CoreDomainEvent<NFTCollectionDeployedPayload> {
}