import { ProductEventData, ActorType, ConversationStatus } from "@freshworks-jaya/marketplace-models";
import Freshchat from '@freshworks-jaya/freshchat-api';

export default (
  freshchatApiUrl: string,
  freshchatApiToken: string,
  productEventData: ProductEventData, 
  actionValue: any
): Promise<any> => {
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties =
    productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  let assignedAgentId = '';
  let conversationStatus = ConversationStatus.Assigned;

  if (actionValue === '-2') {
    if (productEventData.actor.type === ActorType.Agent) {
      assignedAgentId = productEventData.actor.id;
    } else {
      throw new Error('Event performing actor is a user. Cannot assign conversation to user');
    }
  } else if (actionValue === '-1') {
    conversationStatus = ConversationStatus.New;
  } else {
    assignedAgentId = actionValue;
  }

  return freshchat.conversationAssign(
    conversationId,
    assignedAgentId,
    'agent',
    conversationStatus
  );
} 