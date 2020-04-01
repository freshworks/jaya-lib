import { Event, ProductEventData, ChangedStatus } from "@jaya-app/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    productEventData.changes.model_changes.status[1] === ChangedStatus.New
  );
}