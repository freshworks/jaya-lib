import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';

export default (productEventPayload: ProductEventPayload, integrations: Integrations): Promise<string> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;

  return freshchat.getConversationTranscript(
    `https://${productEventPayload.domain}`,
    modelProperties.app_id,
    modelProperties.conversation_id,
    {
      isFetchUntilLastResolve: true,
      isIncludeFreshchatLink: false,
      timezoneOffset: integrations.timezoneOffset,
    },
    {
      isExcludePrivate: true,
      isExcludeSystem: true,
    },
  );
};
