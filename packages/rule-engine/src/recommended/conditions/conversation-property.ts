import { ModelProperties, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition, ConditionOperator, ConversationPropsConditionValue } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';

/**
 * Check if the given userProperty condition is satisfied by the userObj.
 */
const evaluateConversationPropertyCondition = (
  operator: ConditionOperator,
  convObj: ModelProperties,
  conditionValue: ConversationPropsConditionValue,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<void> => {
  const propertyKey = conditionValue.propertyKey;
  const matchedProperty = convObj.properties[propertyKey];

  return Utils.evaluateCondition(
    operator,
    (matchedProperty && matchedProperty.value) || '',
    conditionValue.propertyValue,
    integrations,
    options,
    ruleAlias,
  );
};

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<void> => {
  return evaluateConversationPropertyCondition(
    condition.operator,
    productEventData.conversation || productEventData.message,
    condition.value as ConversationPropsConditionValue,
    integrations,
    options,
    ruleAlias,
  );
};
