import { ExternalEventPayload, ProductEventPayload } from '@freshworks-jaya/marketplace-models';

export interface RuleEngineOptions {
  isSchedulerEnabled: boolean;
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
  googleServiceAccount: GoogleServiceAccountConfig;
  timezoneOffset: number;
}

export interface GoogleServiceAccountConfig {
  clientEmail: string;
  logName: string;
  privateKey: string;
  projectId: string;
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
  ruleIndex: number;
}

export interface KairosCredentials {
  group: string;
  token: string;
  url: string;
}
