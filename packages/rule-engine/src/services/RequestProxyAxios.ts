import RequestProxy, { RequestProxyOptions } from './RequestProxy';
import { AxiosResponse } from 'axios';

export enum Method {
  Delete = 'delete',
  Get = 'get',
  Patch = 'patch',
  Post = 'post',
  Put = 'put',
}

const requestProxyFunc = <T = unknown>(
  requestProxy: RequestProxy,
  method: Method,
  url: string,
  options: RequestProxyOptions,
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    requestProxy[method]<T>(url, options).then(
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
};

const requestProxyAxios: {
  [key in Method]: <T = unknown>(
    requestProxy: RequestProxy,
    url: string,
    options: RequestProxyOptions,
  ) => Promise<AxiosResponse<T>>;
} = {
  [Method.Delete]: <T = unknown>(requestProxy: RequestProxy, url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(requestProxy, Method.Delete, url, options),
  [Method.Get]: <T = unknown>(requestProxy: RequestProxy, url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(requestProxy, Method.Get, url, options),
  [Method.Patch]: <T = unknown>(requestProxy: RequestProxy, url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(requestProxy, Method.Patch, url, options),
  [Method.Post]: <T = unknown>(requestProxy: RequestProxy, url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(requestProxy, Method.Post, url, options),
  [Method.Put]: <T = unknown>(requestProxy: RequestProxy, url: string, options: RequestProxyOptions) =>
    requestProxyFunc<T>(requestProxy, Method.Put, url, options),
};

export default requestProxyAxios;
