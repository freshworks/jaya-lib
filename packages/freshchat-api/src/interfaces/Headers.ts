import { AxiosHeaders } from "axios";

export interface Headers extends AxiosHeaders {
  Authorization: string;
  'Content-Type': string;
  'x-automation-rule-alias'?: string;
  'x-service': string;
}
