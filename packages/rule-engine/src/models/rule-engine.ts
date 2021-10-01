import { ExternalEventPayload, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { RequestProxy } from '@freshworks-jaya/marketplace-models/lib/services/request';
import { GoogleCloudLoggingConfig } from '../services/GoogleCloudLogging';

export interface RuleEngineOptions {
  isSchedulerEnabled: boolean;
  isUseStaticIP: boolean;
  maxProductEventDelay: number;
}

export enum ExternalEventType {
  DeleteSchedules = 'DELETE_SCHEDULES',
}

export interface Integrations {
  emailService?: {
    apiKey: string;
    url: string;
  };
  freshchatv1: ProductCredentials;
  freshchatv2: ProductCredentials;
  freshdesk?: ProductCredentials;
  googleCloudLoggingConfig: GoogleCloudLoggingConfig;
  marketplaceServices: {
    requestProxy: RequestProxy;
  };
  timezoneOffset: number;
}

export interface ProductCredentials {
  token: string;
  url: string;
}

export interface RuleEngineExternalEventPayload extends ExternalEventPayload {
  data: TimerCompletionPayload;
}

export interface DeleteSchedulesData {
  jobsToDelete: string[];
}

export interface TimerCompletionPayload {
  eventData?: DeleteSchedulesData;
  eventType?: ExternalEventType;
  jobId: string;
  originalPayload: ProductEventPayload;
  ruleAlias?: string;
  ruleIndex: number;
  scheduled_at?: string;
}

export interface KairosCredentials {
  group: string;
  token: string;
  url: string;
}
