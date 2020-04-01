import { ProductEventData } from "@jaya-app/marketplace-models";
import Freshchat from '@jaya-app/freshchat-api';

export default (
  freshchatApiUrl: string,
  freshchatApiToken: string,
  productEventData: ProductEventData, 
  actionValue: any
): Promise<any> => {
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties =
    productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  return freshchat.conversationAssign(
    conversationId,
    actionValue,
    'group'
  );
} 