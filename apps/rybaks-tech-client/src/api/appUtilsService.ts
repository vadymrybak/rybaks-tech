import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { apiRetryTimes } from "./constants";
import { LeroyAjax } from "./LeroyObservable";
import { VariablesResponse } from "../types/variablesResponse";
import { IUser, IUserGame } from "../types/apiService.interfaces";

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

  public static getUserGames(id: number): Observable<IUserGame[]> {
    return LeroyAjax(`/api/user/${id}/games`, {}, "json", "GET", {
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
}
