import React from "react";
import { makeObservable, observable, runInAction } from "mobx";
import { VariablesResponse } from "../types/variablesResponse";
import { ApiService } from "../api/appUtilsService";
import { getCookieByName } from "../utils/utils";
import { IUserResponse } from "../types/apiService.interfaces";

export class RootStore {
  appVariables: VariablesResponse | null = null;
  appLoaded: boolean = false;
  isLoggingIn: boolean = false;
  token: string | null = null;
  user: IUserResponse | null = null;

  constructor() {
    this.token = getCookieByName("access_token");
    ApiService.token = this.token;
    makeObservable(this, {
      appLoaded: observable,
      appVariables: observable,
      token: observable,
      isLoggingIn: observable,
      user: observable,
    });
    this.appLoaded = false;
  }

  public fetchAppVariables = () => {
    this.appLoaded = false;

    ApiService.getVariables().subscribe({
      next: (variables: VariablesResponse) => {
        runInAction(() => {
          // this.token = getCookieByName("access_token");
          this.appVariables = variables;
          this.getUser();
          this.appLoaded = true;
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
  };

  public doLogin = (username: string, password: string) => {
    this.isLoggingIn = true;

    ApiService.doLogin(username, password).subscribe({
      next: () => {
        runInAction(() => {
          this.token = getCookieByName("access_token");
          ApiService.token = this.token;
          this.getUser();
        });
      },
      error: (error) => {
        console.log(error);
        this.isLoggingIn = false;
      },
    });
  };

  public getUser = () => {
    ApiService.getUser().subscribe({
      next: (data: IUserResponse) => {
        runInAction(() => {
          this.user = data;
          this.appLoaded = true;
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
