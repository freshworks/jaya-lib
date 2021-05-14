import { Logging } from '@google-cloud/logging';
import { ApiResponse } from '@google-cloud/logging/build/src/log';
import { GoogleServiceAccountConfig } from './models/rule-engine';
import { JsonMap } from './models/rule';

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
export default class GoogleCloudLogging {
  private logging: Logging;

  constructor(private config: GoogleServiceAccountConfig) {
    this.logging = new Logging({
      credentials: {
        client_email: this.config.clientEmail,
        private_key: this.config.privateKey,
      },
      projectId: this.config.projectId,
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
