import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { Api, PropertiesConditionValue, JsonMap } from '../../models/rule';
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
  const assigned_agent_id = modelProperties.assigned_agent_id ? modelProperties.assigned_agent_id : '';
  const status = modelProperties.status;

  const convPropertiesActionValue = actionValue as PropertiesConditionValue;
  let generatedPlaceholders: PlaceholdersMap = {};
  try {
    generatedPlaceholders = await Utils.getDynamicPlaceholders(
      convPropertiesActionValue.propertyValue,
      productEventPayload,
      integrations,
      placeholders,
      options,
      ruleAlias,
    );
    const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };
    const properties = {
      [convPropertiesActionValue.propertyKey]: Utils.processHandlebarsAndReplacePlaceholders(
        convPropertiesActionValue.propertyValue,
        combinedPlaceholders,
      ),
    };
    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.FreshchatAction,
      {
        errorType: ErrorTypes.FreshchatUpdateProperty,
        generatedPlaceholders: generatedPlaceholders as JsonMap,
        heneratedPlaceholders: combinedPlaceholders as JsonMap,
        ieneratedPlaceholders: properties as JsonMap,
        propertyKey: convPropertiesActionValue.propertyKey,
        propertyValue: convPropertiesActionValue.propertyValue,
      },
      LogSeverity.ERROR,
    );
    await freshchat.conversationPropertiesUpdate(conversationId, status, properties, assigned_agent_id);
  } catch (err) {
    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.FreshchatAction,
      {
        error: {
          data: err as JsonMap,
        },
        errorType: ErrorTypes.FreshchatUpdateProperty,
        properties: err as JsonMap,
        propertyKey: convPropertiesActionValue.propertyKey,
        propertyValue: convPropertiesActionValue.propertyValue,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve({});
};
