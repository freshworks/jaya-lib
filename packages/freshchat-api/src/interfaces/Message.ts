import { MessagePart } from './MessagePart';
import { ReplyPart } from './ReplyPart';

export enum MessageSource {
  Api = 'api',
  FbMessenger = 'fb_messenger',
  FbNative = 'fb_native',
  Freshdesk = 'freshdesk',
  Invalid = 'invalid',
  Mobile = 'mobile',
  Smooch = 'smooch',
  System = 'system',
  Web = 'web',
  Zendesk = 'zendesk',
}

export enum ActorType {
  Agent = 'agent',
  System = 'system',
  User = 'user',
}

export enum MessageType {
  Normal = 'normal',
  Private = 'private',
  System = 'system',
}

export interface Message {
  actor_id: string;
  actor_type: ActorType;
  app_id: string;
  channel_id: string;
  conversation_id: string;
  created_time: string;
  id: string;
  in_reply_to?: {
    message_id: string;
  };
  message_parts: MessagePart[];
  message_source: MessageSource;
  message_type: MessageType;
  meta_data?: {
    isReopen?: boolean;
    isResolved?: boolean;
  };
  reply_parts?: ReplyPart[];
  stepId?: string;
}

export interface MessagesLink {
  deprecation?: string;
  href: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  title?: string;
  type?: string;
}

export interface GetMessagesResponse {
  link?: MessagesLink;
  messages: Message[];
}

export interface GetConversationMessagesOptions {
  isFetchUntilLastResolve?: boolean;
  isIncludeFreshchatLink?: boolean;
  output?: 'html' | 'text';
}

export interface FilterMessagesOptions {
  isExcludeNormal?: boolean;
  isExcludePrivate?: boolean;
  isExcludeSystem?: boolean;
}
