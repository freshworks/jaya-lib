import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

export default async (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
  let unassignedCount: number;

  try {
    if (isNaN(ruleMatchCache.unassignedCount as number)) {
      unassignedCount = await freshchat.getUnassignedCountGivenGroupId(modelProperties.assigned_group_id || 'null', 1);
    } else {
      unassignedCount = ruleMatchCache.unassignedCount as number;
    }

    return Utils.evaluateCondition(
      condition.operator,
      unassignedCount.toString(),
      condition.value as string,
      integrations,
      options,
      {
        ...ruleMatchCache,
        unassignedCount,
      },
    );
  } catch (err) {
    throw err;
  }
};
