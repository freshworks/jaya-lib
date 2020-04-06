import { Condition, UserConditionValue, ConditionOperator } from "../../models/rule";
import { ProductEventData, User } from "@freshworks-jaya/marketplace-models";
import { Utils } from '../../Utils';

/**
 * Check if the given userProperty condition is satisfied by the userObj.
 */
const evaluateUserPropertyCondition = (
  operator: ConditionOperator,
  userObj: User,
  conditionValue: UserConditionValue
): boolean => {
  // Return false if there are no user properties
  if (!userObj.properties) {
    return false;
  }

  let retVal = false;
  const matchedProperty = userObj.properties.find(
    property => property.name === conditionValue.propertyKey
  );

  if (matchedProperty) {
    retVal = Utils.evaluateCondition(
      operator,
      matchedProperty.value,
      conditionValue.propertyValue
    );
  }

  return retVal;
}

export default (condition: Condition, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return evaluateUserPropertyCondition(
    condition.operator,
    productEventData.associations.user,
    condition.value as UserConditionValue
  );
}