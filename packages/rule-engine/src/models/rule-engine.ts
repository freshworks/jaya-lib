import { ExternalEventPayload, ProductEventPayload } from '@freshworks-jaya/marketplace-models';

export interface RuleEngineOptions {
  isSchedulerEnabled: boolean;
}

export interface Integrations {
  freshchatv1: ProductCredentials;
  freshchatv2: ProductCredentials;
}

export interface ProductCredentials {
    token: string;
    url: string;
}

export interface RuleEngineExternalEventPayload extends ExternalEventPayload {
  data: TimerCompletionPayload;
}

export interface TimerCompletionPayload {
  jobId: string;
  originalPayload: ProductEventPayload;
  ruleIndex: number;
}

export interface KairosCredentials {
  group: string;
  token: string;
  url: string;
}

export interface BusinessHour {
  timezone: string;
  days?: {
    [key: string]: string;
  },
  working?: {
    [key: string]: boolean;
  },
  enabled: boolean;
  appId: number;
  operatingHoursId: number;
  created: string;
  workingDaily: boolean;
  name: string;
  defaultBhr: boolean;
  isCalendarLinked: boolean;
}
