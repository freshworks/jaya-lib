export interface MessagePart {
  callback?: {
    label: string;
    payload: string;
  };
  collection?: {
    sub_parts: MessagePart[];
  };
  image?: { url: string };
  quick_reply_button?: {
    custom_reply_text?: string;
    label: string;
  };
  reference?: {
    label: string;
    reference_id: string;
  };
  template_content?: {
    sections: {
      name: string;
      parts: MessagePart[];
    }[];
    type: string;
  };
  text?: { content: string };
  url_button?: {
    label: string;
    target: string;
    url: string;
  };
}
