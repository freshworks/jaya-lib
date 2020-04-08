import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Utils } from '../../Utils';
import ruleConfig from '../../RuleConfig';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';

export default (
  freshchatApiUrl: string,
  freshchatApiToken: string,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  return freshchat.postMessage(
    conversationId,
    findAndReplacePlaceholders(actionValue as string, ruleConfig.placeholders as PlaceholdersMap),
    'normal',
  );
};
