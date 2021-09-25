import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import requestProxyAxios, { Method } from '../services/RequestProxyAxios';

export default <T = unknown>(
  axiosRequestConfig: AxiosRequestConfig,
  options: {
    isUseStaticIP: boolean;
  },
): Promise<AxiosResponse<T>> => {
  if (options.isUseStaticIP) {
    return requestProxyAxios[axiosRequestConfig.method as Method]<T>(axiosRequestConfig.url as string, {
      body: JSON.stringify(axiosRequestConfig.data),
      headers: axiosRequestConfig.headers as never,
      staticIP: true,
    });
  } else {
    return axios.request<T>(axiosRequestConfig);
  }
};
