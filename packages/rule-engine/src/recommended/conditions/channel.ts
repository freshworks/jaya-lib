import { Condition } from "../../models/rule";
import { ProductEventData } from "@freshworks-jaya/marketplace-models";
import { Utils } from '../../Utils';

export default (condition: Condition, productEventData: ProductEventData): boolean => {
  return Utils.evaluateCondition(
    condition.operator,
    productEventData.associations.channel.id,
    condition.value as string
  );
}