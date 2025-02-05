import { container, inject, Core, Types } from '@biorate/inversion';
import { Store, Config, Spinner, Hello, Preloader, I18n } from './store';

export class Root extends Core() {
  @inject(Types.Store) protected store: Store;
}

container.bind<Store>(Types.Store).to(Store).inSingletonScope();
container.bind<Config>(Types.Config).to(Config).inSingletonScope();
container.bind<I18n>(Types.I18n).to(I18n).inSingletonScope();
container.bind<Spinner>(Types.Spinner).to(Spinner).inSingletonScope();
container.bind<Hello>(Types.Hello).to(Hello).inSingletonScope();
container.bind<Preloader>(Types.Preloader).to(Preloader).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
