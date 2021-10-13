export interface RequestProxyResponse {
  headers: never;
  response: string;
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
  delete(url: string, options?: RequestProxyOptions): Promise<RequestProxyResponse>;
  get(url: string, options?: RequestProxyOptions): Promise<RequestProxyResponse>;
  patch(url: string, options?: RequestProxyOptions): Promise<RequestProxyResponse>;
  post(url: string, options?: RequestProxyOptions): Promise<RequestProxyResponse>;
  put(url: string, options?: RequestProxyOptions): Promise<RequestProxyResponse>;
}
