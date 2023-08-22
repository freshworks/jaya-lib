import { ModelProperties, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition, ConditionOperator, PropertiesConditionValue, JsonMap } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { ErrorCodes, ErrorTypes } from '../../models/error-codes';

/**
 * Check if the given conversationProperty condition is satisfied by the convObj.
 */
const evaluateConversationPropertyCondition = (
  operator: ConditionOperator,
  convObj: ModelProperties,
  conditionValue: PropertiesConditionValue,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleAlias: string,
): Promise<void> => {
  const propertyKey = conditionValue.propertyKey;
  let matchedProperty = convObj.properties[propertyKey];
  if (Array.isArray(conditionValue.propertyValue)) {
    conditionValue.propertyValue = conditionValue.propertyValue.toString();
    matchedProperty = JSON.stringify(matchedProperty);
  }
  Utils.customlog(integrations, ErrorCodes.FreshchatAction, {
    error: {
      operator: operator,
      prop: convObj as unknown as JsonMap,
      prop2: conditionValue as unknown as JsonMap,
      prop3: propertyKey,
      prop4: matchedProperty,
    },
  });

  return Utils.evaluateCondition(
    operator,
    matchedProperty || '',
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
    condition.value as PropertiesConditionValue,
    integrations,
    options,
    ruleAlias,
  );
};
