import { Condition } from "../../models/rule";
import { ProductEventData } from "@jaya-app/marketplace-models";
import { Utils } from '../../Utils';

export default (condition: Condition, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return Utils.evaluateCondition(
    condition.operator,
    modelProperties.assigned_agent_id,
    condition.value as string
  );
}