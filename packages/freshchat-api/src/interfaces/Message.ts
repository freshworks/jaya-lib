import { MessagePart } from './MessagePart';
import { ReplyPart } from './ReplyPart';

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
  message_parts: MessagePart[];
  message_type: MessageType;
  reply_parts: ReplyPart[];
}
