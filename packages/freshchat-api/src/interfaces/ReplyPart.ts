import { MessagePart } from './MessagePart';

export interface ReplyPart {
  collection: {
    sub_parts: MessagePart[];
  };
}
