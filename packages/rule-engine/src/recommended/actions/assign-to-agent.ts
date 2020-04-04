import { ProductEventData, ActorType } from "@jaya-app/marketplace-models";
import Freshchat from '@jaya-app/freshchat-api';
import { Integrations } from '../../models/rule-engine';

export default (
  integrations: Integrations,
  productEventData: ProductEventData, 
  actionValue: any
): Promise<any> => {
  const freshchatApiUrl= integrations.freshchat.v1.url;
  const freshchatApiToken= integrations.freshchat.v1.token;
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