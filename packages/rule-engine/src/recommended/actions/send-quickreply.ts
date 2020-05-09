import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';
import { QuickReplyValue } from '../../models/rule';

export default (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
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

  return freshchat.sendQuickreply(conversationId, quickreplyValue.question, responses);
};
