import { BlockchainAddress } from "../nft/NFT";

export class NFTDeposit {
  constructor(
    public readonly deposited: boolean,
    public readonly deposit: BlockchainAddress
  ) {
  }
}