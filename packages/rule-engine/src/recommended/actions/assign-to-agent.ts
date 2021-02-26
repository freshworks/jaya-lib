import { ProductEventData, ActorType, ConversationStatus } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Utils } from '../../Utils';

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
  placeholders: PlaceholdersMap,
): Promise<PlaceholdersMap> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
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
    assignedAgentId = actionValue as string;

    try {
      let generatedPlaceholders: PlaceholdersMap = {};
      generatedPlaceholders = await Utils.getDynamicPlaceholders(
        assignedAgentId,
        productEventData,
        integrations,
        domain,
        placeholders,
      );

      const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

      assignedAgentId = findAndReplacePlaceholders(assignedAgentId, combinedPlaceholders);
    } catch (err) {
      return Promise.reject();
    }
  }

  try {
    await freshchat.conversationAssign(conversationId, assignedAgentId, 'agent', conversationStatus);
  } catch (err) {
    return Promise.reject();
  }

  return Promise.resolve({});
};
