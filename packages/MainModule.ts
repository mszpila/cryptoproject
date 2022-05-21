import { Module } from "@nestjs/common";
import { NFTController } from "./core-domain/src/infrastructure/apis/NFTController";
import { NFTApplicationService } from "./core-domain/src/application/services/NFTApplicationService";
import { ConfigModule } from "@nestjs/config";
import { FileController } from "./core-domain/src/infrastructure/apis/FileController";
import { FileApplicationService } from "./core-domain/src/application/services/FileApplicationService";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { BundlerNetworkController } from "./core-domain/src/infrastructure/apis/BundlerNetworkController";
import { BundlrNetworkStorage } from "./core-domain/src/infrastructure/services/storage/web3/BundlrNetworkStorage";
import { CoreDomainModule } from "./core-domain/src/CoreDomainModule";
import { ConfigService } from "./ConfigService";
import { PaymentModule } from "./payments/src/PaymentModule";

const coreDomainModule = CoreDomainModule.create();
const paymentModule = PaymentModule.create();

@Module({
  imports: [
    ConfigModule.forRoot({ load: [ConfigService.getEnv], isGlobal: true }),
    EventEmitterModule.forRoot()
  ],
  controllers: [
    NFTController,
    FileController,
    BundlerNetworkController
  ],
  providers: [
    { provide: NFTApplicationService, useFactory: async () => (await coreDomainModule).get(NFTApplicationService) },
    { provide: FileApplicationService, useFactory: async () => (await coreDomainModule).get(FileApplicationService) },
    { provide: BundlrNetworkStorage, useFactory: async () => (await coreDomainModule).get(BundlrNetworkStorage) }
  ]
})

export class MainModule {
}
