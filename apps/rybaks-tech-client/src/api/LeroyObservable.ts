import { ajax, AjaxResponse, AjaxRequest } from "rxjs/ajax";
import { Observable } from "rxjs";
import { apiTimeout } from "./constants";

/**
 * Returns an improved version of RxJS Ajax
 * @param url REST API url when request will be made
 */
export function LeroyAjax(
  url: string,
  getParams: object = {},
  responseType: XMLHttpRequestResponseType = "json",
  method: "GET" | "POST" = "GET",
  headers: object = {},
  body: object = {},
  timeout: number = apiTimeout,
): Observable<AjaxResponse> {
  const paramsArr = Object.entries(getParams);
  const params = paramsArr?.length ? "?" + paramsArr.map((entry) => entry[0] + "=" + entry[1]).join("&") : "";

  const getURL = url + params;

  const ajaxSetup: AjaxRequest = {
    method,
    headers,
    responseType,
    url: getURL,
    body,
    async: true,
    crossDomain: false,
    withCredentials: false,
    timeout,
  };

  return ajax(ajaxSetup);
}
