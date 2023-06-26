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
  return Utils.evaluateCondition(
    condition.operator,
    productEventData.conversation.ext_entity_meta.meta.call_status || '',
    condition.value as string,
    integrations,
    options,
    ruleAlias,
  );
};
