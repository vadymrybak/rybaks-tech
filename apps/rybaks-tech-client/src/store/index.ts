import { init, kill, injectable, inject, Types } from '@biorate/inversion';
import { createContext, useContext } from 'react';
import { Config } from './config';
import { I18n } from './i18n';
import { Spinner } from './spinner';
import { Hello } from './hello';
import { Preloader } from './preloader';

@injectable()
export class Store {
  protected static StoreContext: React.Context<Store>;

  public static useStore: () => Store;

  @inject(Types.Config) public config: Config;

  @inject(Types.I18n) public i18n: I18n;

  @inject(Types.Spinner) public spinner: Spinner;

  @inject(Types.Hello) public hello: Hello;

  @inject(Types.Preloader) public preloader: Preloader;

  public constructor() {
    Store.StoreContext = createContext<Store>(this);
    Store.useStore = () => useContext(Store.StoreContext);
  }

  @init() protected async initialize() {}

  @kill() protected destruct() {}
}

export { Config } from './config';
export { I18n } from './i18n';
export { Spinner } from './spinner';
export { Hello } from './hello';
export { Preloader } from './preloader';
