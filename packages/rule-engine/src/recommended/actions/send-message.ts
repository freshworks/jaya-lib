import { ProductEventData } from "@freshworks-jaya/marketplace-models";
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Utils } from '../../Utils';
import ruleConfig from "../../RuleConfig";
import { PluginPlaceholders } from "../../models/plugin";

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

  return freshchat.postMessage(
    conversationId,
    Utils.findAndReplacePlaceholders(actionValue, ruleConfig.placeholders as PluginPlaceholders),
    'normal'
  );
} 