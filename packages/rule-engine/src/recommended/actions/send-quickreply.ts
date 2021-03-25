import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';
import { Api, QuickReplyValue } from '../../models/rule';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
  placeholders: PlaceholdersMap,
  apis: Api[],
): Promise<PlaceholdersMap> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  const quickreplyValue = actionValue as QuickReplyValue;
  const responses = quickreplyValue.responses
    .split(',')
    .map((response) => response.trim())
    .filter(Boolean);

  try {
    await freshchat.sendQuickreply(conversationId, quickreplyValue.question, responses);
  } catch (err) {
    return Promise.reject();
  }

  return Promise.resolve({});
};
