import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<void> => {
  const modelProperties = productEventData.conversation || productEventData.message;
  return Utils.evaluateCondition(
    condition.operator,
    modelProperties.sla_policy_name || '',
    condition.value as string,
    integrations,
    options,
    ruleAlias,
  );
};
