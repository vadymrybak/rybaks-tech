import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { apiRetryTimes } from "./constants";
import { LeroyAjax } from "./LeroyObservable";
import { VariablesResponse } from "../types/variablesResponse";
import { IUserResponse } from "../types/apiService.interfaces";

export class ApiService {
  public static token: string | null = null;

  public static getVariables(): Observable<VariablesResponse> {
    return LeroyAjax("/api/config", {}, "json", "GET", {
      Authorization: `Bearer ${ApiService.token}`,
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }

  public static getUser(): Observable<IUserResponse> {
    return LeroyAjax("/api/user", {}, "json", "GET", {
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
