import { ActorType, ConversationStatus, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Utils } from '../../Utils';
import { Api } from '../../models/rule';
import { ErrorCodes, ErrorTypes } from '../../models/error-codes';
import { LogSeverity } from '../../services/GoogleCloudLogging';

export default async (
  integrations: Integrations,
  productEventPayload: ProductEventPayload,
  actionValue: unknown,
  placeholders: PlaceholdersMap,
  apis: Api[],
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<PlaceholdersMap> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken, ruleAlias);
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;
  const conversationId = modelProperties.conversation_id;

  let assignedAgentId = '';
  let conversationStatus = ConversationStatus.Assigned;

  if (actionValue === '-2') {
    if (productEventPayload.data.actor.type === ActorType.Agent) {
      assignedAgentId = productEventPayload.data.actor.id;
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
        productEventPayload,
        integrations,
        placeholders,
        options,
        ruleAlias,
      );

      const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

      assignedAgentId = Utils.processHandlebarsAndReplacePlaceholders(assignedAgentId, combinedPlaceholders);
    } catch (err) {
      return Promise.reject();
    }
  }

  try {
    await freshchat.conversationAssign(conversationId, assignedAgentId, 'agent', conversationStatus);
  } catch (err) {
    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.FreshchatAction,
      {
        error: {
          data: err?.response?.data,
          headers: err?.response?.headers,
        },
        errorType: ErrorTypes.FreshchatAssignAgent,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve({});
};
