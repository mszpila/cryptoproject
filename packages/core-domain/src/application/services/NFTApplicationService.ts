import { BlockchainType } from "../../domain/nft/BlockchainType";
import { Web3StorageService } from "../../domain/file/Web3StorageService";
import { NFTMetadata } from "../../domain/nftDraft/NFTMetadata";
import { NFTDraftID } from "../../domain/nftDraft/NFTDraft";
import { UserID } from "../../domain/UserID";
import { NFTDraftFactory } from "../../domain/nftDraft/NFTDraftFactory";
import { NFTDraftRepository } from "../../domain/nftDraft/NFTDraftRepository";
import { NFTStandard } from "../../domain/nft/NFTStandard";
import { NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { StorageService } from "../../domain/file/StorageService";
import { DraftCreatedDTO } from "../dto/DraftCreatedDTO";
import { FileRepository } from "../../domain/file/FileRepository";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { CoreDomainRegistry } from "../../../../events/core-domain/registry/CoreDomainRegistry";
import { Web3Provider } from "../../domain/nft/Web3Provider";
import { NFTDraftSnapshot } from "../../domain/nftDraft/NFTDraftSnapshot";
import { NFTRepository } from "../../domain/nft/NFTRepository";
import { NFTSnapshot } from "../../domain/nft/NFTSnapshot";
import { UpdateNFTCommand } from "../command/UpdateNFTCommand";
import { UserCommand } from "../command/UserCommand";
import { NFTCommand } from "../command/NFTCommand";
import { DeleteNFTCommand } from "../command/DeleteNFTCommand";
import { EventBus } from "../../../../shared/src/domain/EventBus";
import { NFTCostPrepared } from "../../../../events";
import { NFTID } from "../../domain/nft/NFT";

@Injectable()
export class NFTApplicationService {
  constructor(
    private readonly web3Provider: Web3Provider,
    private readonly web3StorageService: Web3StorageService,
    private readonly storageService: StorageService,
    private readonly nftDraftRepository: NFTDraftRepository,
    private readonly nftDraftFactory: NFTDraftFactory,
    private readonly fileRepository: FileRepository,
    private readonly events: CoreDomainRegistry,
    private readonly nftRepository: NFTRepository,
    private readonly eventBus: EventBus
  ) {
  }

  public async createDraft(command: UserCommand): Promise<DraftCreatedDTO> {
    const nftDraft = this.nftDraftFactory.createDraft(new UserID(command.user));
    await this.nftDraftRepository.add(nftDraft);

    return new DraftCreatedDTO(nftDraft);
  }

  public async updateDraft(command: UpdateNFTCommand): Promise<void> {
    const nftDraft = await this.nftDraftRepository.findById(new NFTDraftID(command.nft));
    if (!nftDraft) throw new NotFoundException(new NFTDraftID(command.nft), "NFT draft with given id doesn't exist");

    const options = command.options.map(option => ({
      blockchainType: new BlockchainType(option.blockchain),
      nftStandard: new NFTStandard(option.standard)
    }));

    nftDraft.setOptions(options);
    nftDraft.updateMetadata(new NFTMetadata(command.metadata));

    await this.nftDraftRepository.update(nftDraft);
  }

  public async createNFT(command: NFTCommand): Promise<void> {
    const nft = await this.nftDraftRepository.findById(new NFTDraftID(command.nft));
    if (!nft) throw new NotFoundException(new NFTDraftID(command.nft), "NFT with given id doesn't exist");

    if (!nft.getMetadata()) throw new NotFoundException(new NFTDraftID(command.nft), "NFT doesn\'t have required metadata");
    if (!nft.getMetadata().hasRequiredFields()) throw new NotFoundException(new NFTDraftID(command.nft), "NFT doesn\'t have filled required metadata");

    const file = await this.fileRepository.findByNFTDraft(nft.id);
    if (!file) throw new NotFoundException(new NFTDraftID(command.nft), "NFT with given id doesn't have an assigned file");

    const fileSize = file.getSize();
    if (!fileSize) throw new UnprocessableEntityException(file.getSize(), "File doesn't have calculated size");

    const uploadCost = await this.web3StorageService.getFilePrice(file);
    const deploymentCost = await this.web3Provider.getDeploymentPrice(nft);
    const commission = "100";

    await this.eventBus.publish(new NFTCostPrepared({
      nft: nft.id.toString(),
      cost: uploadCost.concat(deploymentCost, commission)
    }));
  }

  public async withdrawNFT(command: any): Promise<void> {
    // const nftDraft = await this.nftRepository.findById(new NFTID(command.nftDraft));
    // await this.web3Provider.withdrawNFT(nftDraft, new BlockchainExternalID(command.externalID));
    // await this.nftRepository.update(nftDraft);
  }

  public async getNFTDraft(command: NFTCommand): Promise<NFTDraftSnapshot> {
    // TODO: fix user auth
    const nft = await this.nftDraftRepository.findById(new NFTDraftID(command.nft));
    // if (!nftDraft.getNFTOwner().equals(new UserID(command.user))) throw new UnauthorizedException();
    if (!nft) throw new NotFoundException(`NFT ${command.nft} does not exist`);

    return nft.toSnapshot();
  }

  public async getNFT(command: NFTCommand): Promise<NFTSnapshot> {
    // TODO: fix user auth
    const nft = await this.nftRepository.findByID(new NFTID(command.nft));
    // if (!nftDraft.getNFTOwner().equals(new UserID(command.user))) throw new UnauthorizedException();
    if (!nft) throw new NotFoundException(`NFT ${command.nft} does not exist`);

    return nft[0].toSnapshot();
  }

  public async getNFTByOwner(command: UserCommand): Promise<NFTSnapshot> {
    // TODO: fix user auth
    const nft = await this.nftRepository.findByOwner(new UserID(command.user));
    // if (!nftDraft.getNFTOwner().equals(new UserID(command.user))) throw new UnauthorizedException();

    return nft[0].toSnapshot();
  }

  public async mintToken(command: NFTCommand): Promise<void> {
    const nft = await this.nftDraftRepository.findById(new NFTDraftID(command.nft));

    // TODO: emit event new MintingStarted({ nftDraft: nftDraft.id.toString() });
  }

  public async deleteDraft(command: DeleteNFTCommand): Promise<void> {
    const nft = await this.nftDraftRepository.findById(new NFTDraftID(command.nft));

    if (!nft.getCreator().equals(new UserID(command.user)))
      throw new UnauthorizedException();

    await this.nftDraftRepository.delete(nft.id);
  }

  public async listNFT(command: any): Promise<any> {
    // const nftList = await this.nftRepository.list(new UserID(command.user));
    return;
  }
}