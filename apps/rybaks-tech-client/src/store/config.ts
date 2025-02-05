import { init, injectable } from '@biorate/inversion';
import { Config as BaseConfig } from '@biorate/config';
import { Config as ConfigApi } from '../api';

@injectable()
export class Config extends BaseConfig {
  @init() protected async initialize() {
    this.set('location.host', process.env.host ?? location.host);
    this.set('location.baseURL', process.env.baseURL ?? location.origin);

    const { data } = await ConfigApi.fetch();
    this.merge(data);
  }
}
