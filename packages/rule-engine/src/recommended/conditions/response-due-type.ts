import { Condition } from "../../models/rule";
import { ProductEventData } from "@freshworks-jaya/marketplace-models";
import { Utils } from '../../Utils';

export default (condition: Condition, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return Utils.evaluateCondition(
    condition.operator,
    modelProperties.response_due_type,
    condition.value as string
  );
}