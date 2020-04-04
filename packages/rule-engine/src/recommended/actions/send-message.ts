import { ProductEventData } from "@jaya-app/marketplace-models";
import Freshchat from '@jaya-app/freshchat-api';
import { Placeholder } from '../../Placeholder';
import { Integrations } from '../../models/rule-engine';

export default (
  integrations: Integrations,
  productEventData: ProductEventData, 
  actionValue: any
): Promise<any> => {
  const freshchatApiUrl= integrations.freshchat.v1.url;
  const freshchatApiToken= integrations.freshchat.v1.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties =
    productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  return freshchat.postMessage(
    conversationId,
    Placeholder.findAndReplacePlaceholders(
      productEventData,
      actionValue
    ),
    'normal'
  );
} 