import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';

export default (productEventData: ProductEventData, integrations: Integrations, domain: string): Promise<string> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;

  return freshchat.getConversationTranscript(
    `https://${domain}`,
    modelProperties.app_id,
    modelProperties.conversation_id,
    {
      isIncludeFreshchatLink: true,
    },
  );
};
