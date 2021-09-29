import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import requestProxyAxios, { Method } from '../services/RequestProxyAxios';
import RequestProxy from './RequestProxy';
import { Buffer } from 'safe-buffer';

export default <T = unknown>(
  axiosRequestConfig: AxiosRequestConfig,
  options: {
    isUseStaticIP: boolean;
    requestProxy: RequestProxy;
  },
): Promise<AxiosResponse<T>> => {
  if (options.isUseStaticIP) {
    const headers = axiosRequestConfig.headers ? { ...axiosRequestConfig.headers } : {};

    if (axiosRequestConfig.auth?.username && axiosRequestConfig.auth?.password) {
      const authBuffer = new Buffer(`${axiosRequestConfig.auth.username}:${axiosRequestConfig.auth.password}`).toString(
        'base64',
      );
      const authHeader = `Basic ${authBuffer}`;

      headers['Authorization'] = authHeader;
    }

    return requestProxyAxios[axiosRequestConfig.method?.toLowerCase() as Method]<T>(
      options.requestProxy,
      axiosRequestConfig.url as string,
      {
        body: axiosRequestConfig.data,
        headers,
        staticIP: true,
      },
    );
  } else {
    return axios.request<T>(axiosRequestConfig);
  }
};
