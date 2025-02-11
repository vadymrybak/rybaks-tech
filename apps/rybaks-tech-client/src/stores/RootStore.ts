import React from "react";
import { makeObservable, observable, runInAction } from "mobx";
import { VariablesResponse } from "../types/variablesResponse";
import { ApiService } from "../api/appUtilsService";
import { getCookieByName } from "../utils/utils";

export class RootStore {
  appVariables: VariablesResponse | null = null;
  appLoaded: boolean = false;
  isLoggingIn: boolean = false;
  token: string | null = null;

  constructor() {
    makeObservable(this, {
      appLoaded: observable,
      appVariables: observable,
      token: observable,
      isLoggingIn: observable,
    });
    this.appLoaded = false;

    this.token = getCookieByName("access_token");
  }

  public fetchAppVariables = () => {
    this.appLoaded = false;

    ApiService.getVariables().subscribe({
      next: (variables: VariablesResponse) => {
        runInAction(() => {
          this.token = getCookieByName("access_token");
          this.appVariables = variables;
          this.appLoaded = true;
        });
      },
      error: (error: unknown) => {
        console.error("Error while getting app variables!", error);
      },
    });
  };

  public doLogin = (username: string, password: string) => {
    this.isLoggingIn = true;

    ApiService.doLogin(username, password).subscribe({
      next: (data: any) => {
        runInAction(() => {
          this.token = getCookieByName("access_token");
          this.isLoggingIn = false;
        });
      },
      error: (error) => {
        console.log(error);
        this.isLoggingIn = false;
      },
    });
  };
}

export const rootStore = new RootStore();
const StoresContext = React.createContext(rootStore);
export const useStores = () => React.useContext(StoresContext);
