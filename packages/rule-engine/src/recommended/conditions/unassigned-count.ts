import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import Freshchat from '@freshworks-jaya/freshchat-api';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
  options: RuleEngineOptions,
): Promise<void> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;

  return freshchat
    .getUnassignedCountGivenGroupId(modelProperties.assigned_group_id || 'null', 1)
    .then((unassignedCount) => {
      return Utils.evaluateCondition(
        condition.operator,
        unassignedCount.toString(),
        condition.value as string,
        integrations,
        options,
      );
    });
};
