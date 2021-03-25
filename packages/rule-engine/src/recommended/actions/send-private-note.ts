import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import ruleConfig from '../../RuleConfig';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
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

  let generatedPlaceholders: PlaceholdersMap = {};

  try {
    generatedPlaceholders = await Utils.getDynamicPlaceholders(
      actionValue as string,
      productEventData,
      integrations,
      domain,
      placeholders,
    );

    const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

    await freshchat.postMessage(
      conversationId,
      Utils.processHandlebarsAndReplacePlaceholders(actionValue as string, combinedPlaceholders),
      'private',
      'bot',
    );
  } catch (err) {
    return Promise.reject();
  }

  return Promise.resolve(generatedPlaceholders);
};
