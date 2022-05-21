import { Body, Controller, Get, Post } from "@nestjs/common";
import { BundlrNetworkStorage } from "../services/storage/web3/BundlrNetworkStorage";
import BigNumber from "bignumber.js";

@Controller("/bundler-network")
export class BundlerNetworkController {
  constructor(
    private readonly bundler: BundlrNetworkStorage
  ) {
  }

  @Get()
  public async getBalance(): Promise<BigNumber> {
    return this.bundler.getBalance();
  }

  @Post()
  public async fundAccount(
    @Body() body: FundAccountBody,
  ): Promise<void> {
    await this.bundler.fundAccount(body.amount);
  }
}

interface FundAccountBody {
  amount: number;
}