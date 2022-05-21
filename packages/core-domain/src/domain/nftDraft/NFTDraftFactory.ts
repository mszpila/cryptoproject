import { NFTDraft, NFTDraftID } from "./NFTDraft";
import { UserID } from "../UserID";
import { Enum } from "../../../../shared/src/domain/Enum";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { DateValue } from "../../../../shared/src/domain/DateValue";

@Enum.decorate()
export class RequiredMetadataAttributes extends Enum {
  public static readonly NAME = new RequiredMetadataAttributes("NAME");
  public static readonly DESCRIPTION = new RequiredMetadataAttributes("DESCRIPTION");
  public static readonly URI = new RequiredMetadataAttributes("URI");
}

@Injectable()
export class NFTDraftFactory {
  private requiredAttributes = new Set(Object.keys(RequiredMetadataAttributes));

  // public create(blockchainType: BlockchainType, creator: UserID, metadata: NFTMetadata[], contractAddress: BlockchainExternalID, tokenId: TokenID): NFT {
  //   this.validateRequiredAttributes(metadata);
  //
  //   return new NFT(new NFTID(), creator, creator, metadata, false, blockchainType, contractAddress, tokenId, false, null, NFTState.DRAFT);
  // }

  public createDraft(creator: UserID): NFTDraft {
    // return new NFT(new NFTID(), creator, creator, [], true, null, null, null, false, null, NFTState.DRAFT);
    return new NFTDraft(new NFTDraftID(), creator, [], null, null, DateValue.now(), DateValue.now(), DateValue.null());
  }

  // public createNFTFromDeposit(blockchainType: BlockchainType, userId: UserID, metadata: NFTMetadata, blockchain: NFTBlockchainDetails, deposit: NFTDeposit): NFT {
  //   return new NFT(new NFTID(), userId, null, NFTState.DEPOSIT, [], metadata, '');
  // }

  // private validateRequiredAttributes(metadata: NFTMetadata[]): void {
  //   const requiredAttributes = new Set<string>();
  //   for (const data of metadata) {
  //     const requiredAttribute = this.requiredAttributes.has(data.key);
  //     if (requiredAttribute) requiredAttributes.add(data.key);
  //   }
  //
  //   if (this.requiredAttributes.size !== requiredAttributes.size) throw new BadRequestException("Missing required metadata");
  // }
}