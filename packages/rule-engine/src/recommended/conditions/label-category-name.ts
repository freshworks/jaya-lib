import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
): Promise<void> => {
  return Utils.evaluateCondition(
    condition.operator,
    productEventData.associations.label_category?.name || '',
    condition.value as string,
    integrations,
  );
};
