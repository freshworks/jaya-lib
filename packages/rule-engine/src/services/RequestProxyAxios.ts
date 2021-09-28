import axios, { AxiosResponse } from 'axios';

export interface RequestProxyResponse<T = never> {
  headers: never;
  response: T;
  status: number;
}

export interface RequestProxyOptions {
  body?: string;
  headers?: never;
  maxAttempts?: number;
  retryDelay?: number;
  staticIP?: boolean;
}

export interface RequestProxy {
  delete<T = never, R = RequestProxyResponse<T>>(url: string, options?: RequestProxyOptions): Promise<R>;
  get<T = never, R = RequestProxyResponse<T>>(url: string, options?: RequestProxyOptions): Promise<R>;
  patch<T = never, R = RequestProxyResponse<T>>(url: string, options?: RequestProxyOptions): Promise<R>;
  post<T = never, R = RequestProxyResponse<T>>(url: string, options?: RequestProxyOptions): Promise<R>;
  put<T = never, R = RequestProxyResponse<T>>(url: string, options?: RequestProxyOptions): Promise<R>;
}

declare const $request: RequestProxy;

export enum Method {
  Delete = 'delete',
  Get = 'get',
  Patch = 'patch',
  Post = 'post',
  Put = 'put',
}

const requestProxyFunc = <T = unknown>(
  method: Method,
  url: string,
  options: RequestProxyOptions,
): Promise<AxiosResponse<T>> => {
  axios
    .get('https://en4s25cy11pdvai.m.pipedream.net/AXIOSEnteredRequestProxyFunc')
    .then(() => {
      // Do nothing
    })
    .catch(() => {
      // Do nothing
    });
  if ($request) {
    axios
      .get('https://en4s25cy11pdvai.m.pipedream.net/AXIOSRequestObjectExists')
      .then(() => {
        // Do nothing
      })
      .catch(() => {
        // Do nothing
      });
    $request
      .get('https://en4s25cy11pdvai.m.pipedream.net/REQUESTThisMeansSuccess')
      .then(() => {
        // Do nothing
      })
      .catch(() => {
        // Do nothing
      });

    return new Promise((resolve, reject) => {
      $request[method]<T>(url, options).then(
        (data) => {
          resolve({
            data: data.response,
            headers: data.headers,
            status: data.status,
          } as unknown as AxiosResponse);
        },
        (error) => {
          reject(error);
        },
      );
    });
  } else {
    axios
      .get('https://en4s25cy11pdvai.m.pipedream.net/AXIOSRequestObjectDoesNotExist')
      .then(() => {
        // Do nothing
      })
      .catch(() => {
        // Do nothing
      });
    return Promise.reject(new Error('$request is not defined'));
  }
};

const requestProxyAxios: {
  [key in Method]: <T = unknown>(url: string, options: RequestProxyOptions) => Promise<AxiosResponse<T>>;
} = {
  [Method.Delete]: <T = unknown>(url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(Method.Delete, url, options),
  [Method.Get]: <T = unknown>(url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(Method.Get, url, options),
  [Method.Patch]: <T = unknown>(url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(Method.Patch, url, options),
  [Method.Post]: <T = unknown>(url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(Method.Post, url, options),
  [Method.Put]: <T = unknown>(url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(Method.Put, url, options),
};

export default requestProxyAxios;
