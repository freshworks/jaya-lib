import { Condition } from '../../models/rule';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
): Promise<boolean> => {
  return Promise.resolve(Utils.evaluateCondition(condition.operator, condition.value as string, '', integrations));
};
