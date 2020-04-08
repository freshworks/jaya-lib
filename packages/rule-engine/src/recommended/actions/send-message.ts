import { ProductEventData } from "@freshworks-jaya/marketplace-models";
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Utils } from '../../Utils';
import ruleConfig from "../../RuleConfig";
import { PluginPlaceholders } from "../../models/plugin";
import { Integrations } from '../../models/rule-engine';

export default (
  integrations: Integrations,
  productEventData: ProductEventData, 
  actionValue: any
): Promise<any> => {
  const freshchatApiUrl= integrations.freshchatv1.url;
  const freshchatApiToken= integrations.freshchatv1.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties =
    productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  return freshchat.postMessage(
    conversationId,
    Utils.findAndReplacePlaceholders(actionValue, ruleConfig.placeholders as PluginPlaceholders),
    'normal'
  );
} 