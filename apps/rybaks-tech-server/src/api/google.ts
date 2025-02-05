import { AxiosPrometheus } from '@biorate/axios-prometheus';

export class GETGoogle extends AxiosPrometheus {
  public baseURL = 'https://google.com';

  public url = '/';

  public method = 'get';

  public static fetch() {
    return this._fetch<string>();
  }
}
