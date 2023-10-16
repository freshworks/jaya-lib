import { ConversationStatus, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Utils } from '../../Utils';
import { AnyJson, Api } from '../../models/rule';
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

  let assignedGroupId = actionValue as string;

  if (actionValue === '-1') {
    assignedGroupId = '';
  } else {
    try {
      let generatedPlaceholders: PlaceholdersMap = {};
      generatedPlaceholders = await Utils.getDynamicPlaceholders(
        assignedGroupId,
        productEventPayload,
        integrations,
        placeholders,
        options,
        ruleAlias,
      );

      const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

      assignedGroupId = Utils.processHandlebarsAndReplacePlaceholders(assignedGroupId, combinedPlaceholders);
    } catch (err) {
      return Promise.reject();
    }
  }

  try {
    const convoStatus =
      modelProperties.status === ConversationStatus.Resolved ? ConversationStatus.Resolved : ConversationStatus.New;
    await freshchat.conversationAssign(conversationId, assignedGroupId, 'group', convoStatus);
  } catch (err) {
    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.FreshchatAction,
      {
        error: err as AnyJson,
        errorType: ErrorTypes.FreshchatAssignGroup,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve({});
};
