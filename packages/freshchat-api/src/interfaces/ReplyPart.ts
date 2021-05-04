import { MessagePart } from './MessagePart';

export interface ReplyPart {
  collection?: {
    sub_parts: MessagePart[];
  };
  template_content?: {
    sections: {
      name: string;
      parts: MessagePart[];
    }[];
    type: string;
  };
}
