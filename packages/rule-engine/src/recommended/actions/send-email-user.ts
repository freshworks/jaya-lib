import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import Freshchat from '@freshworks-jaya/freshchat-api';
import axios from 'axios';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { AnyJson, Api } from '../../models/rule';
import { Utils } from '../../Utils';
import { ErrorCodes } from '../../models/error-codes';
import { LogSeverity } from '../../services/GoogleCloudLogging';

export default async (
  integrations: Integrations,
  productEventPayload: ProductEventPayload,
  actionValue: unknown,
  placeholders: PlaceholdersMap,
  apis: Api[],
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<PlaceholdersMap> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken, ruleAlias);
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;
  const conversationId = modelProperties.conversation_id;
  const appId = productEventPayload.account_id;
  const userEmail =
    productEventPayload.data.associations &&
    productEventPayload.data.associations.user &&
    productEventPayload.data.associations.user.email;

  if (!userEmail) {
    return Promise.reject('No user email to send');
  }

  if (!integrations.emailService) {
    return Promise.reject('No email service integration');
  }

  try {
    const emailSubject = 'Transcript of Conversation';
    const conversationHtml = await freshchat.getConversationTranscript(
      `https://${productEventPayload.domain}`,
      modelProperties.app_id,
      conversationId,
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

    const emailResponse = await axios.post(
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

    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.EmailTrace,
      {
        data: emailResponse?.data,
      },
      LogSeverity.INFO,
    );
  } catch (err) {
    Utils.log(productEventPayload, integrations, ErrorCodes.SendEmail, {
      error: err as AnyJson,
    });
    return Promise.reject('Error sending conversation as html via email');
  }

  return Promise.resolve({});
};
