import { BigNumber, BytesLike, Contract, ContractFactory, ContractInterface, ethers, providers, Wallet } from "ethers";
import NFT721 from "./contracts/721.sol/NFTCollection.json";
import NFT1155 from "./contracts/1155.sol/NFTCollection1155.json";
import { BadRequestException } from "@nestjs/common";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider/src.ts";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { ConfigService } from "../../../../../../ConfigService";
import { BlockchainAddress, NFT } from "../../../../domain/nft/NFT";
import { NFTStandard } from "../../../../domain/nft/NFTStandard";
import { defaultAbiCoder } from "ethers/lib/utils";
import { ICreateNFT } from "../../../../domain/nft/Web3Provider";

@Injectable()
export class EthereumWeb3Provider {
  private readonly ETHEREUM_RPC = "ETHEREUM_RPC";
  private readonly WALLET = this.configService.get<string>("METAMASK_WALLET_PRIVATE_KET");
  private readonly ethereum: providers.JsonRpcProvider;
  private readonly wallet: Wallet;

  constructor(
    protected readonly configService: ConfigService
  ) {
    this.ethereum = new ethers.providers.JsonRpcProvider(this.configService.get<string>(this.ETHEREUM_RPC));
    this.wallet = new ethers.Wallet(this.WALLET, this.ethereum);
  }

  public async createNFT(nftWeb3Uri: URL, standard: NFTStandard): Promise<ICreateNFT> {
    switch (standard) {
      // case NFTStandard.NFT_721: {
      //   return this.prepareResponseBasedOnReceipt(await this.createNFT721(null, file, nftDraft));
      // }
      case NFTStandard.NFT_1155: {
        // return this.prepareResponseBasedOnReceipt(await this.createNFT1155(null, nftWeb3Uri));
        return this.createNFT1155(null, nftWeb3Uri);
      }
      default:
        throw new BadRequestException("Selected NFT type is not implemented");
    }
  }

  private prepareResponseBasedOnReceipt(receipt: TransactionReceipt): ICreateNFT {
    const contract = new BlockchainAddress(receipt.to);
    const tokenId = defaultAbiCoder.decode(["uint256"], receipt.logs[0].topics[3])[0].toString();
    return { contract, tokenId };
  }

  // private async createNFT721(contractAddress: BlockchainExternalID | null, file: File, nftDraft: NFT): Promise<TransactionReceipt> {
  //   const abi = NFT721.abi;
  //   const bytes = NFT721.bytecode;
  //   const contract = contractAddress
  //     ? new Contract(contractAddress.toString(), abi, this.wallet)
  //     : await this.createNFT721Collection(abi, bytes, nftDraft.getCollectionName(), nftDraft.getSymbol());
  //
  //   const tx: TransactionResponse = await contract.mintToken(file.getWeb3URI());
  //   return tx.wait(2);
  // }

  // private async createNFT721Collection(
  //   abi: ContractInterface,
  //   bytes: BytesLike,
  //   collectionName: NFTTitle,
  //   collectionSymbol: NFTTitle,
  // ): Promise<Contract> {
  //   const _mintingFee = BigNumber.from("0");
  //   const _maxTokens = BigNumber.from("13");
  //   const _limitedCollection = false;
  //   const _onlyOwnerCanMint = true;
  //
  //   const contract = await new ContractFactory(abi, bytes, this.wallet).deploy(
  //     collectionName.toString(),
  //     collectionSymbol.toString(),
  //     _mintingFee,
  //     _maxTokens,
  //     _limitedCollection,
  //     _onlyOwnerCanMint
  //   );
  //
  //   await contract.deployTransaction.wait(2);
  //   return contract;
  // }

  private async createNFT1155(contractAddress: BlockchainAddress | null, nftWeb3URI: URL): Promise<ICreateNFT> {
    const abi = NFT1155.abi;
    const bytes = NFT1155.bytecode;
    const contract = contractAddress
      ? new Contract(contractAddress.toString(), abi, this.wallet)
      : await this.createNFT1155Collection(abi, bytes, ""); // collectionMetadataURI?

    const tx: TransactionResponse = await contract.mintToken(nftWeb3URI.toString(), BigNumber.from("1")); // fill with args ("uri", copies number)
    const receipt = await tx.wait(2);

    return {
      contract: new BlockchainAddress(contract.address),
      tokenId: defaultAbiCoder.decode(["uint256", "uint16"], receipt.logs[1].data)[0].toString()
    };
  }

  private async createNFT1155Collection(abi: ContractInterface, bytes: BytesLike, collectionMetadataURI: string): Promise<Contract> {
    const _mintingFee = BigNumber.from("0");
    const _maxTokens = BigNumber.from("13");
    const _limitedCollection = false;
    const _onlyOwnerCanMint = true;

    const contract = await new ContractFactory(abi, bytes, this.wallet).deploy(
      collectionMetadataURI,
      _mintingFee,
      _maxTokens,
      _limitedCollection,
      _onlyOwnerCanMint
    );

    await contract.deployTransaction.wait(2);
    return contract;
  }

  public async withdrawNFT(nft: NFT, withdrawAddress: BlockchainAddress): Promise<void> {
    let transactionReceipt: TransactionReceipt;

    switch (nft.getBlockchainType()) {
      case NFTStandard.NFT_721: {
        transactionReceipt = await this.withdrawNFT721(nft.getContract(), withdrawAddress);
        break;
      }
      case NFTStandard.NFT_1155: {
        transactionReceipt = await this.withdrawNFT1155(nft.getContract(), withdrawAddress);
        break;
      }
      default:
        throw new BadRequestException("Selected NFT type is not implemented");
    }

    // const nftDraft = this.nftFactory.create(blockchainType, userId, metadata, contractAddress, transactionReceipt.logs[0].transactionHash);
    // await this.nftRepository.add(nftDraft);
  }

  private async withdrawNFT721(contractAddress: BlockchainAddress, withdrawAddress: BlockchainAddress | null): Promise<TransactionReceipt> {
    const abi = NFT721.abi;
    const contract = new Contract(contractAddress.toString(), abi, this.wallet);
    const tx: TransactionResponse = await contract.transfer(withdrawAddress); // fill with args ("uri")

    return tx.wait(2);
  }

  private async withdrawNFT1155(contractAddress: BlockchainAddress, withdrawAddress: BlockchainAddress | null): Promise<TransactionReceipt> {
    const abi = NFT1155.abi;
    const contract = new Contract(contractAddress.toString(), abi, this.wallet);
    const tx: TransactionResponse = await contract.transfer(withdrawAddress); // fill with args ("uri")

    return tx.wait(2);
  }

  public async checkConfirmations(): Promise<void> {
    // const tx = await this.ethereum.getTransactionReceipt()
  }
}