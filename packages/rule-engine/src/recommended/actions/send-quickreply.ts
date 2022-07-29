import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Api, QuickReplyValue } from '../../models/rule';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
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

  const quickreplyValue = actionValue as QuickReplyValue;
  const responses =
    quickreplyValue.responses
      .split(',')
      .map((response) => response.trim())
      .filter(Boolean) || [];

  let generatedPlaceholders: PlaceholdersMap = {};
  let processedQuestion = '';
  let processedResponses: string[] = [];

  try {
    // Step 1: Setup dynamic placeholders using values from question and responses
    generatedPlaceholders = await Utils.getDynamicPlaceholders(
      `${quickreplyValue.question} ${quickreplyValue.responses}`,
      productEventPayload,
      integrations,
      placeholders,
      options,
      ruleAlias,
    );
    const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

    // Step 2: Replace placeholders in question and responses
    processedQuestion = Utils.processHandlebarsAndReplacePlaceholders(quickreplyValue.question, combinedPlaceholders);
    processedResponses = responses.map((response) =>
      Utils.processHandlebarsAndReplacePlaceholders(response, combinedPlaceholders),
    );
  } catch (err) {
    // Do nothing
  }

  try {
    // Step 3: Send quickreply message
    await freshchat.sendQuickreply(conversationId, processedQuestion, processedResponses);
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
        errorType: ErrorTypes.FreshchatSendQuickReply,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve({});
};
