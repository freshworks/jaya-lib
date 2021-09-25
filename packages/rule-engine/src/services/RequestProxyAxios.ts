import $request, { RequestProxyOptions } from './RequestProxy';
import { AxiosResponse } from 'axios';

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
