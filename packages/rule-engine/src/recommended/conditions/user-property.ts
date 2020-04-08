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
): boolean => {
  let retVal = false;
  const matchedProperty =
    userObj.properties && userObj.properties.find((property) => property.name === conditionValue.propertyKey);

  if (matchedProperty) {
    retVal = Utils.evaluateCondition(operator, matchedProperty.value, conditionValue.propertyValue, integrations);
  }

  return retVal;
};

export default (condition: Condition, productEventData: ProductEventData, integrations: Integrations): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return evaluateUserPropertyCondition(
    condition.operator,
    productEventData.associations.user,
    condition.value as UserConditionValue,
    integrations,
  );
};
