import { Event, ProductEventData, ConversationStatus } from "@jaya-app/marketplace-models";

export default (productEvent: Event, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;
  return (
    productEvent === Event.ConversationUpdate &&
    modelProperties.status === ConversationStatus.Assigned &&
    !!productEventData.changes.model_changes.assigned_agent_id[1]
  );
}