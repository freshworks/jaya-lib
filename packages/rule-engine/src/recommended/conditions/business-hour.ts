import { Condition } from '../../models/rule';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  return Utils.evaluateCondition(
    condition.operator,
    condition.value as string,
    '',
    integrations,
    options,
    ruleMatchCache,
  );
};
