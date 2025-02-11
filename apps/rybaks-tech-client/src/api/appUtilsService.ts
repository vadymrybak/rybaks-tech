import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { apiRetryTimes } from "./constants";
import { LeroyAjax } from "./LeroyObservable";
import { VariablesResponse } from "../types/variablesResponse";

export const ApiService = {
  getVariables(): Observable<VariablesResponse> {
    return LeroyAjax("/api/config").pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  },

  doLogin(username: string, password: string): Observable<any>{
    return LeroyAjax("/auth/signin", {}, "json", "POST", {}, {
      email: username,
      password
    }).pipe(
      map((data) => data.response),
      retry(apiRetryTimes),
    );
  }
};
