import { ProductEventData, User } from '@freshworks-jaya/marketplace-models';
import { Condition, UserConditionValue, ConditionOperator } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';

/**
 * Check if the given userProperty condition is satisfied by the userObj.
 */
const evaluateUserPropertyCondition = (
  operator: ConditionOperator,
  userObj: User,
  conditionValue: UserConditionValue,
  integrations: Integrations,
): Promise<void> => {
  const matchedProperty =
    userObj.properties && userObj.properties.find((property) => property.name === conditionValue.propertyKey);

  return Utils.evaluateCondition(
    operator,
    (matchedProperty && matchedProperty.value) || '',
    conditionValue.propertyValue,
    integrations,
  );
};

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
): Promise<void> => {
  return evaluateUserPropertyCondition(
    condition.operator,
    productEventData.associations.user,
    condition.value as UserConditionValue,
    integrations,
  );
};
