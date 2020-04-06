import { Event, ProductEventData } from "@freshworks-jaya/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    !!productEventData.changes.model_changes.assigned_group_id[1]
  );
}