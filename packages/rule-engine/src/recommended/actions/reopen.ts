import { ConversationStatus, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { AnyJson, Api } from '../../models/rule';
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

  try {
    await freshchat.conversationStatusUpdate(conversationId, ConversationStatus.New);
  } catch (err) {
    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.FreshchatAction,
      {
        error: err as AnyJson,
        errorType: ErrorTypes.FreshchatReopenConversation,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve({});
};
