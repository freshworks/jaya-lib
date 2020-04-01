import { ProductEventData, ActorType } from "@jaya-app/marketplace-models";
import Freshchat from '@jaya-app/freshchat-api';

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

    if (actionValue === '-2') {
      if (productEventData.actor.type === ActorType.Agent) {
        assignedAgentId = productEventData.actor.id;
      } else {
        throw new Error('Event performing actor is a user. Cannot assign conversation to user');
      }
    } else {
      assignedAgentId = actionValue;
    }

    return freshchat.conversationAssign(
      conversationId,
      assignedAgentId,
      'agent'
    );
} 