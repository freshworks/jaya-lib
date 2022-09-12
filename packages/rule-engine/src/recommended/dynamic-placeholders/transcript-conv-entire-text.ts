import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { ErrorCodes, ErrorTypes } from '../../models/error-codes';
import { LogSeverity } from '../../services/GoogleCloudLogging';
import Constants from '../Constants';

export default (
  productEventPayload: ProductEventPayload,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<string> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken, ruleAlias);
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;

  return freshchat
    .getConversationTranscript(
      `https://${productEventPayload.domain}`,
      modelProperties.app_id,
      modelProperties.conversation_id,
      {
        isIncludeFreshchatLink: false,
        messagesLimit: options.isUseStaticIP
          ? Constants.MAX_MESSAGES_TRANSCRIPT_STATIC_IP
          : Constants.MAX_MESSAGES_TRANSCRIPT,
        output: 'text',
        timezoneOffset: integrations.timezoneOffset,
      },
      {
        isExcludePrivate: true,
        isExcludeSystem: true,
      },
    )
    .then((transcript) => Promise.resolve(transcript))
    .catch((err) => {
      Utils.log(
        productEventPayload,
        integrations,
        ErrorCodes.FreshchatPlaceholder,
        {
          error: {
            data: err?.response?.data,
            headers: err?.response?.headers,
          },
          errorType: ErrorTypes.TranscriptEntireText,
        },
        LogSeverity.ERROR,
      );
      return Promise.reject();
    });
};
