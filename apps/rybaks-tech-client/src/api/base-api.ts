import { Axios, IAxiosFetchOptions } from '@biorate/axios';
import { container, Types } from '@biorate/inversion';
import { Spinner, Config } from '../store';
import { IError } from '../interfaces';
import * as errors from './errors';

export class BaseApi extends Axios {
  public withCredentials = false;

  public retries = 0;

  public baseURL = this.config.get<string>('location.baseURL');

  protected get spinner(): Spinner {
    return container.get<Spinner>(Types.Spinner);
  }

  protected get config(): Config {
    return container.get<Config>(Types.Config);
  }

  protected async before(params: IAxiosFetchOptions) {
    this.spinner.show(this.constructor.name);
    await super.before(params);
  }

  protected async finally(startTime: [number, number]) {
    await super.finally(startTime);
    this.spinner.hide(this.constructor.name);
  }

  protected async catch(e: IError, startTime: [number, number]) {
    //@ts-ignore
    const Error = errors[e?.response?.data?.code];
    await (Error ? new Error().process(e) : new errors.UnknownError().process(e));
    await super.catch(e, startTime);
  }
}
