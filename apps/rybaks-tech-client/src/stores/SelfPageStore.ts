import { action, makeObservable, observable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { ApiService } from "../api/appUtilsService";
import { IScreenshot, IScreenshotByDay, IScreenshotResponse, IUser, IUserGame } from "../types/apiService.interfaces";
import { Logger } from "../utils/logger";
import { Subscription } from "rxjs";

class SelfPageStore {
  /**
   * Можно добраться до RootStore из этого store
   */
  rootStore: RootStore;

  gamesLoaded: boolean = false;
  screenshotsLoading: boolean = false;
  gameCreating: boolean = false;
  uploadInProgress: boolean = false;
  endReached: boolean = false;

  createGameModalOpen: boolean = false;
  screenshotModalOpen: boolean = false;

  userGames: IUserGame[] = [];
  loadedScreenshots: IScreenshotByDay = {};
  activeGameTab: number = 0;
  activeScreenshot: IScreenshot | null = null;

  from: number = 0;
  size: number = 100;

  filesAmount: number = 0;

  uploading$: Subscription = new Subscription();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      gameCreating: observable,
      gamesLoaded: observable,
      endReached: observable,
      filesAmount: observable,
      screenshotsLoading: observable,
      uploadInProgress: observable,
      screenshotModalOpen: observable,
      createGameModalOpen: observable,
      activeScreenshot: observable,
      activeGameTab: observable,
      userGames: observable,
      from: observable,
      size: observable,
      handleTabChange: action.bound,
      uploadScreenshots: action.bound,
      loadView: action.bound,
      toggleCreateGameModalOpen: action.bound,
      toggleScreenshotModalOpen: action.bound,
      handleThumbnailClick: action.bound,
      handleFetchMoreItems: action.bound,
      handleCreateNewGame: action.bound,
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
      ApiService.getUserGames(this.rootStore.user.id).subscribe({
        next: (games: IUserGame[]) => {
          runInAction(() => {
            this.gamesLoaded = true;
            this.userGames = games.sort((a, b) => {
              var keyA = a.name,
                keyB = b.name;
              // Compare the 2 dates
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });
            this.activeGameTab = this.userGames[0].id;
          });
        },
        error: (error) => {
          console.error(error);
          this.gamesLoaded = false;
        },
      });
    } else {
      throw new Error("User is undefined");
    }
  }

  uploadScreenshots(files: FileList) {
    Logger.debug(`uploadScreenshots - Uploading ${files.length} for gameid ${this.activeGameTab}`);
    this.uploadInProgress = true;
    this.filesAmount = files.length;

    const toBeUploaded: { [key: string]: File[] } = {};
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const dateTaken = new Date(file.lastModified).toLocaleDateString();
      if (toBeUploaded[dateTaken]) {
        toBeUploaded[dateTaken].push(file);
      } else {
        toBeUploaded[dateTaken] = [file];
      }
    }

    if (this.rootStore.user) {
      ApiService.uploadScreenshots(files, (this.rootStore.user as IUser).id, this.activeGameTab).subscribe({
        next: (data: any) => {
          runInAction(() => {
            Logger.debug(data);
            this.uploadInProgress = false;
            this.handleTabChange(this.activeGameTab);
          });
        },
        error: (error) => {
          this.uploadInProgress = false;
          console.error(error);
        },
      });
    }
  }

  handleTabChange(gameId: number) {
    this.screenshotsLoading = true;
    this.endReached = false;
    this.from = 0;
    this.loadedScreenshots = {};
    this.activeGameTab = gameId;
    this.uploading$.unsubscribe();

    if (this.rootStore.user) {
      this.uploading$ = ApiService.getGameScreenshots(this.rootStore.user.id, gameId, this.from, this.size).subscribe({
        next: (fetchedScreenshots: IScreenshotResponse) => {
          runInAction(() => {
            this.screenshotsLoading = false;
            this.from += this.size;
            this.loadedScreenshots = fetchedScreenshots.screenshots.byDay;
          });
        },
        error: (error) => {
          console.error(error);
          this.screenshotsLoading = false;
        },
      });
    }
  }

  handleFetchMoreItems() {
    this.screenshotsLoading = true;

    if (this.rootStore.user) {
      this.uploading$ = ApiService.getGameScreenshots(this.rootStore.user.id, this.activeGameTab, this.from, this.size).subscribe({
        next: (fetchedScreenshots: IScreenshotResponse) => {
          runInAction(() => {
            this.screenshotsLoading = false;

            const lastDayInCurrent = Object.keys(this.loadedScreenshots)[Object.keys(this.loadedScreenshots).length - 1];
            const firstDayInIncoming = Object.keys(fetchedScreenshots.screenshots.byDay)[0];

            if (Object.keys(fetchedScreenshots.screenshots.byDay).length > 0 && !this.endReached) {
              if (lastDayInCurrent && firstDayInIncoming) {
                if (lastDayInCurrent === firstDayInIncoming) {
                  this.loadedScreenshots[lastDayInCurrent].push(...fetchedScreenshots.screenshots.byDay[firstDayInIncoming]);
                  delete fetchedScreenshots.screenshots.byDay[firstDayInIncoming];
                }
                this.loadedScreenshots = {
                  ...this.loadedScreenshots,
                  ...fetchedScreenshots.screenshots.byDay,
                };
              } else {
                this.loadedScreenshots = fetchedScreenshots.screenshots.byDay;
              }
              this.from += this.size;
            } else {
              this.endReached = true;
            }
          });
        },
        error: (error) => {
          console.error(error);
          this.screenshotsLoading = false;
        },
      });
    }
  }

  handleCreateNewGame(gameName: string, base64icon: string) {
    Logger.debug(`Create game - gameName: ${gameName}`);

    this.gameCreating = true;
    if (this.rootStore.user) {
      ApiService.createGame(this.rootStore.user?.id, gameName, base64icon).subscribe({
        next: (response: any) => {
          Logger.debug(`Game created: ${response}`);
          this.gameCreating = false;
          this.createGameModalOpen = false;
          this.userGames = [];

          if (this.rootStore.user) {
            ApiService.getUserGames(this.rootStore.user.id).subscribe({
              next: (games: IUserGame[]) => {
                runInAction(() => {
                  this.gamesLoaded = true;
                  this.userGames = games.sort((a, b) => {
                    var keyA = a.name,
                      keyB = b.name;
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                  });
                  this.activeGameTab = this.userGames[0].id;
                });
              },
              error: (error) => {
                console.error(error);
                this.gamesLoaded = false;
              },
            });
          }
        },
        error: (error) => {
          console.error(error);
          this.gameCreating = false;
        },
      });
    }
  }
}

export default SelfPageStore;
