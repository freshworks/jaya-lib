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
