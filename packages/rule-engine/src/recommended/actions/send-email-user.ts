import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';
import Freshchat from '@freshworks-jaya/freshchat-api';
import axios from 'axios';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';

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
  const appId = modelProperties.app_id;
  const userEmail =
    productEventData.associations && productEventData.associations.user && productEventData.associations.user.email;

  if (!userEmail) {
    return Promise.reject('No user email to send');
  }

  if (!integrations.emailService) {
    return Promise.reject('No email service integration');
  }

  try {
    const emailSubject = 'Transcript of Conversation';
    const conversationHtml = await freshchat.getConversationTranscript(
      `https://${domain}`,
      modelProperties.app_id,
      conversationId,
      {
        isFetchUntilLastResolve: true,
        isIncludeFreshchatLink: false,
      },
      {
        isExcludePrivate: true,
        isExcludeSystem: true,
      },
    );

    await axios.post(
      `${integrations.emailService.url}/api/v1/email/send`,
      JSON.stringify({
        accountId: appId,
        from: {
          email: 'no-reply@freshchat.com',
          name: 'Freshchat Automations',
        },
        html: conversationHtml,
        subject: emailSubject,
        to: [
          {
            email: userEmail,
          },
        ],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: integrations.emailService.apiKey,
        },
      },
    );
  } catch (err) {
    return Promise.reject('Error sending conversation as html via email');
  }

  return Promise.resolve({});
};
