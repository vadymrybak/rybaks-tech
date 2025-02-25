import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { apiRetryTimes } from "./constants";
import { LeroyAjax } from "./LeroyObservable";
import { VariablesResponse } from "../types/variablesResponse";
import { IScreenshotResponse, IUser, IUserGame } from "../types/apiService.interfaces";

export class ApiService {
  public static token: string | null = null;

  public static checkToken(): Observable<VariablesResponse> {
    return LeroyAjax("/api/check-token", {}, "json", "GET", {
      Authorization: `Bearer ${ApiService.token}`,
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static getVariables(): Observable<VariablesResponse> {
    return LeroyAjax("/api/config", {}, "json", "GET", {
      Authorization: `Bearer ${ApiService.token}`,
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static getUser(): Observable<IUser> {
    return LeroyAjax("/api/user", {}, "json", "GET", {
      Authorization: `Bearer ${ApiService.token}`,
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static uploadScreenshots(files: FileList, userId: number, gameId: number): Observable<any> {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
      formData.append(`lastModified[${i}]`, files[i].lastModified.toString());
    }
    return LeroyAjax(
      `api/user/${userId}/game/${gameId}/screenshots/upload`,
      {},
      "json",
      "POST",
      {
        Authorization: `Bearer ${ApiService.token}`,
      },
      formData,
    ).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static getUserGames(id: number): Observable<IUserGame[]> {
    return LeroyAjax(`/api/user/${id}/games`, {}, "json", "GET", {
      Authorization: `Bearer ${ApiService.token}`,
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static getGameScreenshots(userId: number, gameId: number, from: number, size: number): Observable<IScreenshotResponse> {
    return LeroyAjax(`/api/user/${userId}/game/${gameId}/screenshots`, { from, size }, "json", "GET", {
      Authorization: `Bearer ${ApiService.token}`,
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static doLogin(username: string, password: string): Observable<any> {
    return LeroyAjax(
      "/auth/signin",
      {},
      "json",
      "POST",
      {},
      {
        email: username,
        password,
      },
    ).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static createGame(userId: number, gameName: string, base64icon: string): Observable<any> {
    return LeroyAjax(
      `api/user/${userId}/game/create`,
      {},
      "json",
      "POST",
      {
        Authorization: `Bearer ${ApiService.token}`,
      },
      {
        gameName,
        base64icon,
      },
    ).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }
}
