import { ContainerModule } from "inversify";
import { NFTApplicationService } from "./services/NFTApplicationService";
import { FileApplicationService } from "./services/FileApplicationService";

export class ApplicationModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bind(NFTApplicationService).toSelf();
      bind(FileApplicationService).toSelf();
    });
  }
}