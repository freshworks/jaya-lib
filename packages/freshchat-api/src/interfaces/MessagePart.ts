export interface MessagePart {
  callback?: {
    label: string;
    payload: string;
  };
  collection?: {
    sub_parts: MessagePart[];
  };
  file?: {
    content_type: string;
    file_size_in_bytes: number;
    name: string;
    url: string;
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
