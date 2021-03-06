import { Logging } from '@google-cloud/logging';
import { ApiResponse } from '@google-cloud/logging/build/src/log';
import { JsonMap } from '../models/rule';
import { GoogleServiceAccountConfig } from './GoogleServiceAccount';

export interface GoogleCloudLoggingConfig extends GoogleServiceAccountConfig {
  logName: string;
}

export enum LogSeverity {
  ALERT = 'ALERT',
  CRITICAL = 'CRITICAL',
  DEBUG = 'DEBUG',
  DEFAULT = 'DEFAULT',
  EMERGENCY = 'EMERGENCY',
  ERROR = 'ERROR',
  INFO = 'INFO',
  NOTICE = 'NOTICE',
  WARNING = 'WARNING',
}
export class GoogleCloudLogging {
  private logging: Logging;

  constructor(private config: GoogleCloudLoggingConfig) {
    this.logging = new Logging({
      credentials: {
        client_email: this.config.client_email,
        private_key: this.config.private_key,
      },
      projectId: this.config.project_id,
    });
  }

  log(jsonMap: JsonMap, severity: LogSeverity): Promise<ApiResponse> {
    const log = this.logging.log(this.config.logName);

    const metadata = {
      resource: {
        type: 'global',
      },
      severity,
    };

    const entry = log.entry(metadata, jsonMap);

    return log.write(entry);
  }
}
