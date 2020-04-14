import { ProductEventData, ConversationStatus } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';

export default (
  freshchatApiUrl: string,
  freshchatApiToken: string,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  if (modelProperties.assigned_group_id) {
    return freshchat.conversationAssign(conversationId, '', 'agent', ConversationStatus.New).then(() => {
      return freshchat.conversationAssign(
        conversationId,
        modelProperties.assigned_group_id,
        'group',
        ConversationStatus.New,
      );
    });
  }

  return Promise.reject();
};
