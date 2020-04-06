import { Event, ProductEventData, ChangedStatus } from "@freshworks-jaya/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    productEventData.changes.model_changes.status[1] === ChangedStatus.Resolve
  );
}