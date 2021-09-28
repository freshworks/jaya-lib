import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { WebhookContentType } from '../models/rule';
import requestProxyAxios, { Method } from '../services/RequestProxyAxios';
import { Utils } from '../Utils';
import RequestProxy from './RequestProxy';

export default <T = unknown>(
  axiosRequestConfig: AxiosRequestConfig,
  options: {
    isUseStaticIP: boolean;
    requestProxy: RequestProxy;
  },
): Promise<AxiosResponse<T>> => {
  if (options.isUseStaticIP) {
    if (axiosRequestConfig.auth) {
      const authBuffer = new Buffer(`${axiosRequestConfig.auth.username}:${axiosRequestConfig.auth.password}`).toString;
      const authHeader = `Basic ${authBuffer}`;

      if (!axiosRequestConfig.headers) {
        axiosRequestConfig.headers = {};
      }

      axiosRequestConfig.headers['Authorization'] = authHeader;
    }

    if (axiosRequestConfig.headers?.requestType === WebhookContentType.Json) {
      axiosRequestConfig.data = Utils.safelyParseJson(axiosRequestConfig.data) || {};
    }

    return requestProxyAxios[axiosRequestConfig.method?.toLowerCase() as Method]<T>(
      options.requestProxy,
      axiosRequestConfig.url as string,
      {
        body: JSON.stringify(axiosRequestConfig.data),
        headers: axiosRequestConfig.headers as never,
        staticIP: true,
      },
    );
  } else {
    return axios.request<T>(axiosRequestConfig);
  }
};
