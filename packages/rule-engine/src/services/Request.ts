import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { JsonMap } from '../models/rule';
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
    const headers = axiosRequestConfig.headers ? { ...axiosRequestConfig.headers } : {};
    let jsonData: JsonMap | null = null;
    let isContentTypeJson = false;

    if (axiosRequestConfig.auth) {
      const authBuffer = new Buffer(`${axiosRequestConfig.auth.username}:${axiosRequestConfig.auth.password}`).toString;
      const authHeader = `Basic ${authBuffer}`;

      headers['Authorization'] = authHeader;
    }

    if (headers['Content-Type'] === 'application/json') {
      isContentTypeJson = true;
      jsonData = Utils.safelyParseJson(axiosRequestConfig.data) || null;
    }

    return requestProxyAxios[axiosRequestConfig.method?.toLowerCase() as Method]<T>(
      options.requestProxy,
      axiosRequestConfig.url as string,
      {
        body: isContentTypeJson ? (jsonData ? JSON.stringify(jsonData) : '') : axiosRequestConfig.data,
        headers,
        staticIP: true,
      },
    );
  } else {
    return axios.request<T>(axiosRequestConfig);
  }
};
