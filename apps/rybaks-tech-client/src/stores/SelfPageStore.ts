import { action, makeObservable, observable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { ApiService } from "../api/appUtilsService";
import { IUserGame } from "../types/apiService.interfaces";

class SelfPageStore {
  /**
   * Можно добраться до RootStore из этого store
   */
  rootStore: RootStore;

  gamesLoaded: boolean = false;
  userGames: IUserGame[] = [];
  activeGameTab: number = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      gamesLoaded: observable,
      activeGameTab: observable,
      getUserGames: action.bound,
      handleTabChange: action.bound,
      uploadScreenshots: action.bound,
    });
  }

  getUserGames() {
    this.gamesLoaded = false;
    if (this.rootStore.user) {
      ApiService.getUserGames(this.rootStore.user.id).subscribe({
        next: (data: IUserGame[]) => {
          runInAction(() => {
            this.userGames = data;
            this.gamesLoaded = true;
            this.activeGameTab = this.userGames[0].id;
          });
        },
        error: (error) => {
          console.log(error);
          this.gamesLoaded = false;
        },
      });
    } else {
      throw new Error("User is undefined");
    }
  }

  uploadScreenshots(files: FileList) {
    ApiService.uploadScreenshots(files).subscribe({
      next: (data: any) => {
        runInAction(() => {
          console.log(data);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  handleTabChange(value: number) {
    const tab = this.userGames.find((el) => el.id === value);
    if (tab) {
      this.activeGameTab = tab.id;
    }
  }
}

export default SelfPageStore;
