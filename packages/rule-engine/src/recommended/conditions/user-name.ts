import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
): Promise<void> => {
  const userFirstName = productEventData.associations.user.first_name
    ? productEventData.associations.user.first_name
    : '';
  const userLastName = productEventData.associations.user.last_name ? productEventData.associations.user.last_name : '';
  const userName = `${userFirstName} ${userLastName}`.trim();

  return Utils.evaluateCondition(condition.operator, userName, condition.value as string, integrations);
};
