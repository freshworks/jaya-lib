import { ProductEventData } from './PayloadData';

export enum Event {
  AppInstall = 'onAppInstall',
  AppUninstall = 'onAppUninstall',
  ConversationCreate = 'onConversationCreate',
  ConversationUpdate = 'onConversationUpdate',
  ExternalEvent = 'onExternalEvent',
  MessageCreate = 'onMessageCreate',
}

export interface EventPayload {
  account_id: string;
  domain: string;
  event: Event;
  iparams: unknown;
  region: string;
  timestamp: number;
  version: string;
}

export interface ProductEventPayload extends EventPayload {
  data: ProductEventData;
  encodedData?: string;
}

export interface ExternalEventPayload extends EventPayload {
  data: unknown;
}
