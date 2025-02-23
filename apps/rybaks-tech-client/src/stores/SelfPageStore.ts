import { action, makeObservable, observable, runInAction } from "mobx";
import { concatMap } from "rxjs/operators";
import { RootStore } from "./RootStore";
import { ApiService } from "../api/appUtilsService";
import { IScreenshot, IScreenshotByDay, IScreenshotResponse, IUserGame } from "../types/apiService.interfaces";
import { Logger } from "../utils/logger";

class SelfPageStore {
  /**
   * Можно добраться до RootStore из этого store
   */
  rootStore: RootStore;

  gamesLoaded: boolean = false;
  screenshotsLoaded: boolean = false;
  uploadInProgress: boolean = false;

  createGameModalOpen: boolean = false;
  screenshotModalOpen: boolean = false;

  userGames: IUserGame[] = [];
  loadedScreenshots: IScreenshotByDay = {};
  activeGameTab: number = 0;
  activeScreenshot: IScreenshot | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      gamesLoaded: observable,
      screenshotsLoaded: observable,
      uploadInProgress: observable,
      screenshotModalOpen: observable,
      createGameModalOpen: observable,
      activeScreenshot: observable,
      activeGameTab: observable,
      userGames: observable,
      handleTabChange: action.bound,
      uploadScreenshots: action.bound,
      loadView: action.bound,
      toggleCreateGameModalOpen: action.bound,
      toggleScreenshotModalOpen: action.bound,
      handleThumbnailClick: action.bound,
    });
  }

  toggleCreateGameModalOpen(value: boolean) {
    this.createGameModalOpen = value;
  }

  toggleScreenshotModalOpen(value: boolean) {
    this.screenshotModalOpen = value;
  }

  handleThumbnailClick(screenshot: IScreenshot) {
    Logger.debug(`(SelfPageStore - handleThumbnailClick) Clicked: ${screenshot.filename}`);
    this.activeScreenshot = screenshot;
    this.screenshotModalOpen = true;
  }

  loadView() {
    this.gamesLoaded = false;
    if (this.rootStore.user) {
      ApiService.getUserGames(this.rootStore.user.id)
        .pipe(
          concatMap((games: IUserGame[]) => {
            runInAction(() => {
              this.gamesLoaded = true;
              this.userGames = games;
              this.activeGameTab = this.userGames[0].id;
            });
            if (this.rootStore.user) {
              return ApiService.getGameScreenshots(this.rootStore.user.id, games[0].id);
            }
            throw new Error("Could not game game list");
          }),
        )
        .subscribe({
          next: (fetchedScreenshots: IScreenshotResponse) => {
            runInAction(() => {
              this.screenshotsLoaded = true;
              this.loadedScreenshots = fetchedScreenshots.screenshots.byDay;
            });
          },
          error: (error) => {
            console.log(error);
            this.gamesLoaded = false;
            this.screenshotsLoaded = false;
          },
        });
    } else {
      throw new Error("User is undefined");
    }
  }

  uploadScreenshots(files: FileList) {
    Logger.debug(`uploadScreenshots - Uploading ${files.length} for gameid ${this.activeGameTab}`);

    this.uploadInProgress = true;

    if (this.rootStore.user) {
      ApiService.uploadScreenshots(files, this.rootStore.user.id, this.activeGameTab).subscribe({
        next: (data: any) => {
          runInAction(() => {
            this.uploadInProgress = false;
            this.handleTabChange(this.activeGameTab);
          });
        },
        error: (error) => {
          this.uploadInProgress = false;
          console.log(error);
        },
      });
    }
  }

  handleTabChange(gameId: number) {
    this.screenshotsLoaded = false;
    this.activeGameTab = gameId;

    if (this.rootStore.user) {
      ApiService.getGameScreenshots(this.rootStore.user.id, gameId).subscribe({
        next: (fetchedScreenshots: IScreenshotResponse) => {
          runInAction(() => {
            this.screenshotsLoaded = true;
            this.loadedScreenshots = fetchedScreenshots.screenshots.byDay;
          });
        },
        error: (error) => {
          console.log(error);
          this.screenshotsLoaded = false;
        },
      });
    }
  }
}

export default SelfPageStore;
