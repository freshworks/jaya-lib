import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import ruleConfig from '../../RuleConfig';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
): Promise<unknown> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);

  const userPhone = actionValue as string;

  return Utils.setupDynamicPlaceholders(userPhone, productEventData, integrations, domain).then(() => {
    return freshchat.updateUser(productEventData.associations.user.id, {
      phone: findAndReplacePlaceholders(userPhone, ruleConfig.placeholders as PlaceholdersMap),
    });
  });
};
