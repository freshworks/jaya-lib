import { Event, ProductEventData } from "@jaya-app/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    !!productEventData.changes.model_changes.assigned_group_id[1]
  );
}