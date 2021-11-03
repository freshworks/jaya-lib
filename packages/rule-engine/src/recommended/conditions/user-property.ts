import { ProductEventData, User } from '@freshworks-jaya/marketplace-models';
import { Condition, UserConditionValue, ConditionOperator } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

/**
 * Check if the given userProperty condition is satisfied by the userObj.
 */
const evaluateUserPropertyCondition = (
  operator: ConditionOperator,
  userObj: User,
  conditionValue: UserConditionValue,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  const matchedProperty =
    userObj.properties && userObj.properties.find((property) => property.name === conditionValue.propertyKey);

  return Utils.evaluateCondition(
    operator,
    (matchedProperty && matchedProperty.value) || '',
    conditionValue.propertyValue,
    integrations,
    options,
    ruleMatchCache,
  );
};

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  return evaluateUserPropertyCondition(
    condition.operator,
    productEventData.associations.user,
    condition.value as UserConditionValue,
    integrations,
    options,
    ruleMatchCache,
  );
};
