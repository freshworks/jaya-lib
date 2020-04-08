import { ProductEventData } from './PayloadData';
export declare enum Event {
    AppInstall = "onAppInstall",
    AppUninstall = "onAppUninstall",
    ConversationCreate = "onConversationCreate",
    ConversationUpdate = "onConversationUpdate",
    ExternalEvent = "onExternalEvent",
    MessageCreate = "onMessageCreate"
}
export interface EventPayload {
    account_id: string;
    domain: string;
    event: Event;
    iparams: any;
    region: string;
    timestamp: string;
    version: string;
}
export interface ProductEventPayload extends EventPayload {
    data: ProductEventData;
}
export interface ExternalEventPayload extends EventPayload {
    data: any;
}
