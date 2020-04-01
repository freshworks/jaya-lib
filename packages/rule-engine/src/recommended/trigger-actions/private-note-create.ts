import { Event, ProductEventData, MessageType } from "@jaya-app/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return (
    productEvent === Event.MessageCreate &&
    productEventData.message.messages[0].message_type === MessageType.Private
  );
}