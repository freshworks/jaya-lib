import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import Handlebars from 'handlebars';
import Helpers from 'handlebars-helpers';

Handlebars.registerHelper(Helpers());

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
    const template = Handlebars.compile(actionValue as string);
    const handlebarsProcessedText = template(combinedPlaceholders);
    const textWithReplacedPlaceholders = findAndReplacePlaceholders(handlebarsProcessedText, combinedPlaceholders);
    await freshchat.sendNormalReplyText(conversationId, textWithReplacedPlaceholders);
  } catch (err) {
    return Promise.reject();
  }

  return Promise.resolve(generatedPlaceholders);
};
