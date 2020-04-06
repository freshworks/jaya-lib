import { Event, ProductEventData } from "@freshworks-jaya/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return productEvent === Event.ConversationCreate;;
}