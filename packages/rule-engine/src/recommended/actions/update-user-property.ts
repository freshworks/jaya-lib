import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import ruleConfig from '../../RuleConfig';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { UserConditionValue } from '../../models/rule';

export default (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
): Promise<unknown> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);

  const uperPropertiesActionValue = actionValue as UserConditionValue;

  return Utils.setupDynamicPlaceholders(
    uperPropertiesActionValue.propertyValue,
    productEventData,
    integrations,
    domain,
  ).then(() => {
    return freshchat.updateUser(productEventData.associations.user.id, {
      properties: [
        {
          name: uperPropertiesActionValue.propertyKey,
          value: findAndReplacePlaceholders(
            uperPropertiesActionValue.propertyValue,
            ruleConfig.placeholders as PlaceholdersMap,
          ),
        },
      ],
    });
  });
};
