import { Event, ProductEventData } from "@jaya-app/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return productEvent === Event.ConversationCreate;;
}