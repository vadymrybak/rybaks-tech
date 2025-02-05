import { injectable } from '@biorate/inversion';
import { observable, action, makeObservable } from 'mobx';

import { I18n as I18nCommon } from '@biorate/i18n';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import * as i18next from 'i18next';

@injectable()
export class I18n extends I18nCommon {
  @observable public language = 'ru';

  protected get options() {
    return {
      load: 'languageOnly',
      fallbackLng: 'ru',
      supportedLngs: ['ru', 'kz'],
      debug: this.baseURL.includes('localhost'),
      saveMissing: this.baseURL.includes('localhost'),
      backend: {
        loadPath: `${this.baseURL}/locales/{{lng}}/{{ns}}`,
        addPath: `${this.baseURL}/locales/{{lng}}/{{ns}}`,
      },
    };
  }

  protected get baseURL() {
    return this.config.get<string>('location.baseURL');
  }

  protected get middlewares() {
    return [I18nextBrowserLanguageDetector, I18NextHttpBackend];
  }

  public constructor() {
    super();
    makeObservable(this);
  }

  @action public changeLanguage(language: string) {
    this.language = language;
    i18next.changeLanguage(this.language);
  }
}
