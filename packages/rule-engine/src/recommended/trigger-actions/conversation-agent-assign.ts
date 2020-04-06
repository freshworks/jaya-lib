import { Event, ProductEventData, ConversationStatus } from "@freshworks-jaya/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;
  return (
    productEvent === Event.ConversationUpdate &&
    modelProperties.status === ConversationStatus.Assigned &&
    !!productEventData.changes.model_changes.assigned_agent_id[1]
  );
}