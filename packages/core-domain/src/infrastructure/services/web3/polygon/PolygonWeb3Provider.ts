import { EthereumWeb3Provider } from "../ethereum/EthereumWeb3Provider";
import { ethers, providers, Signer } from "ethers";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { ConfigService } from "../../../../../../ConfigService";

@Injectable()
export class PolygonWeb3Provider extends EthereumWeb3Provider {
  private readonly POLYGON_RPC = 'POLYGON_RPC';
  private readonly polygon: providers.JsonRpcProvider;
  private readonly polygonSigner: Signer;

  constructor(
    configService: ConfigService,
  ) {
    super(configService);
    this.polygon = new ethers.providers.JsonRpcProvider(this.configService.get<string>(this.POLYGON_RPC));
    this.polygonSigner = this.polygon.getSigner();
  }
}
