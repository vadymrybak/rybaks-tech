import React from "react";
import { action, makeObservable, observable, runInAction } from "mobx";
import { VariablesResponse } from "../types/variablesResponse";
import { ApiService } from "../api/appUtilsService";
import { getCookieByName } from "../utils/utils";
import { IUser } from "../types/apiService.interfaces";
import SelfPageStore from "./SelfPageStore";
import { Logger } from "../utils/logger";

export class RootStore {
  appLoaded: boolean = false;
  viewLoaded: boolean = false;
  appVariables: VariablesResponse | null = null;
  isLoggingIn: boolean = false;
  token: string | null = null;
  tokenOK: boolean = false;
  user: IUser | null = null;

  selfPageStore: SelfPageStore;

  constructor() {
    this.selfPageStore = new SelfPageStore(this);

    this.token = getCookieByName("access_token");
    ApiService.token = this.token;
    makeObservable(this, {
      appLoaded: observable,
      viewLoaded: observable,
      appVariables: observable,
      token: observable,
      isLoggingIn: observable,
      user: observable,
      tokenOK: observable,
      checkToken: action.bound,
      loadApp: action.bound,
      doLogin: action.bound,
      getVariables: action.bound,
      getUser: action.bound,
      setAppLoaded: action.bound,
    });
  }

  checkToken(token: string) {
    ApiService.token = token;
    this.appLoaded = false;
    ApiService.checkToken().subscribe({
      next: () => {
        runInAction(() => {
          this.tokenOK = true;
          this.appLoaded = true;
          this.token = getCookieByName("access_token");
        });
      },
      error: (error: unknown) => {
        console.error("Error while getting app variables!", error);
        runInAction(() => {
          this.tokenOK = false;
          this.appLoaded = true;
        });
      },
    });
  }

  loadApp() {
    Logger.debug("RootStore - Load app");
    
    this.viewLoaded = false;

    ApiService.getUser().subscribe({
      next: (data: IUser) => {
        runInAction(() => {
          this.user = data;
          this.viewLoaded = true;
        });
      },
      error: (error) => {
        console.error(error);
        this.viewLoaded = false;
      },
    });
  }

  getVariables() {
    this.appLoaded = false;

    ApiService.getVariables().subscribe({
      next: (variables: VariablesResponse) => {
        runInAction(() => {
          this.appVariables = variables;
          this.getUser();
        });
      },
      error: (error: unknown) => {
        console.error("Error while getting app variables!", error);
        runInAction(() => {
          this.appLoaded = true;
          this.token = null;
        });
      },
    });
  }

  getUser() {
    ApiService.getUser().subscribe({
      next: (data: IUser) => {
        runInAction(() => {
          this.user = data;
          this.appLoaded = true;
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  doLogin(username: string, password: string) {
    this.isLoggingIn = true;

    ApiService.doLogin(username, password).subscribe({
      next: () => {
        runInAction(() => {
          this.token = getCookieByName("access_token");
          this.tokenOK = true;
          this.isLoggingIn = false;
          ApiService.token = this.token;
        });
      },
      error: (error) => {
        console.error(error);
        this.isLoggingIn = false;
      },
    });
  }

  setAppLoaded(value: boolean) {
    this.appLoaded = value;
  }
}

export const rootStore = new RootStore();
const StoresContext = React.createContext(rootStore);
export const useStores = () => React.useContext(StoresContext);
