import { ProductEventData, ConversationStatus } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';

export default (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
  const freshchatApiUrl = integrations.freshchatv1.url;
  const freshchatApiToken = integrations.freshchatv1.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  let assignedGroupId = actionValue as string;

  if (actionValue === '-1') {
    assignedGroupId = '';
  }

  return freshchat.conversationAssign(conversationId, assignedGroupId, 'group', ConversationStatus.New);
};
