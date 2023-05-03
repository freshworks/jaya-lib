import { ConversationStatus, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Api } from '../../models/rule';
import { Utils } from '../../Utils';
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
  let conversationStatus = actionValue as ConversationStatus;
  let assignedAgentId = '';

  if (conversationStatus === ConversationStatus.Assigned) {
    if (productEventPayload.data.associations.agent) {
      assignedAgentId = productEventPayload.data.associations.agent.id;
    } else {
      conversationStatus = ConversationStatus.New;
    }
  }

  try {
    if (assignedAgentId !== '') {
      await freshchat.conversationAssign(conversationId, assignedAgentId, 'agent', conversationStatus);
    } else {
      await freshchat.conversationStatusUpdate(conversationId, conversationStatus);
    }
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
        errorType: ErrorTypes.FreshchatReopenConversation,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve({});
};
