import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';

export default (condition: Condition, productEventData: ProductEventData, integrations: Integrations): boolean => {
  return Utils.evaluateCondition(
    condition.operator,
    productEventData.associations.channel.id,
    condition.value as string,
    integrations,
  );
};
