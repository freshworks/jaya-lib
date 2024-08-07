import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Method, requestAxiosify } from './RequestAxiosify';
import { RequestProxy } from './Request';

const requestAxiosWrapper = <T = unknown>(
  axiosRequestConfig: AxiosRequestConfig,
  options: {
    isUseStaticIP: boolean;
    requestProxy: RequestProxy;
  },
): Promise<AxiosResponse<T>> => {
  if (options.isUseStaticIP) {
    const headers = axiosRequestConfig.headers ? { ...axiosRequestConfig.headers } : {};

    if (axiosRequestConfig.auth?.username && axiosRequestConfig.auth?.password) {
      const authBuffer = Buffer.from(
        `${axiosRequestConfig.auth.username}:${axiosRequestConfig.auth.password}`,
      ).toString('base64');
      const authHeader = `Basic ${authBuffer}`;

      headers['Authorization'] = authHeader;
    }

    return requestAxiosify[axiosRequestConfig.method?.toLowerCase() as Method]<T>(
      options.requestProxy,
      axiosRequestConfig.url as string,
      {
        body: axiosRequestConfig.data,
        headers,
      },
    );
  } else {
    return axios.request<T>(axiosRequestConfig);
  }
};

export { requestAxiosWrapper };
