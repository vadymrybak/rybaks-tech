import { container, inject, Core, Types, init } from "@biorate/inversion";
import { IConfig, Config } from "@biorate/config";
import { ConfigLoader } from "@biorate/config-loader";
import { ConfigLoaderEnv } from "@biorate/config-loader-env";
import { ConfigLoaderFs } from "@biorate/config-loader-fs";
import { ConfigLoaderVault } from "@biorate/config-loader-vault";
import { Prometheus, IPrometheus } from "@biorate/prometheus";
import { VaultConnector, IVaultConnector } from "@biorate/vault";
import { ISequelizeConnector } from "@biorate/sequelize";
import { ServiceApiSequelizeConnector } from "./connectors/SequelizeConnector";
import { Application } from "./application";
import { IApplication } from "./interfaces";
import { Test } from "./test";
import { AuthService, BJwtService, DbService, JwtStrategy, UserService } from "./services";

export class Root extends Core() {
  @inject(Types.Config) public readonly config: IConfig;

  @inject(Types.ConfigLoaderEnv) public readonly configLoaderEnv: ConfigLoader;

  @inject(Types.ConfigLoaderFs) public readonly configLoaderFs: ConfigLoader;

  @inject(Types.ConfigLoaderVault) public readonly configLoaderVault: ConfigLoader;

  @inject(Types.Vault) public readonly vault: IVaultConnector;

  @inject(Types.Prometheus) public readonly prometheus: IPrometheus;

  @inject(Types.ServiceApiSequelizeConnector) public connector: ISequelizeConnector;

  @inject(Types.Test) public readonly test: Test;

  @inject(Types.Application) public readonly application: IApplication;

  @init()
  public loaded() {
    // Workaround to initialize Strategy so that I could get config
    container.get(Types.JwtStrategy);
  }
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderEnv).to(ConfigLoaderEnv).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderFs).to(ConfigLoaderFs).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderVault).to(ConfigLoaderVault).inSingletonScope();
container.bind<IVaultConnector>(Types.Vault).to(VaultConnector).inSingletonScope();
container.bind<IPrometheus>(Types.Prometheus).to(Prometheus).inSingletonScope();
container.bind<IApplication>(Types.Application).to(Application).inSingletonScope();
container.bind<Test>(Types.Test).to(Test).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
container.bind<ISequelizeConnector>(Types.ServiceApiSequelizeConnector).to(ServiceApiSequelizeConnector).inSingletonScope();
container.bind<DbService>(Types.DbService).to(DbService).inSingletonScope();
container.bind<AuthService>(Types.AuthService).to(AuthService).inSingletonScope();
container.bind<BJwtService>(Types.BJwtService).to(BJwtService).inSingletonScope();
container.bind<JwtStrategy>(Types.JwtStrategy).to(JwtStrategy).inSingletonScope();
container.bind<UserService>(Types.UserService).to(UserService).inSingletonScope();
