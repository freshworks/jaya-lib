import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';

export default (
  condition: Condition,
  productEventData: ProductEventData,
  integrations: Integrations,
): Promise<boolean> => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return Promise.resolve(
    Utils.evaluateCondition(
      condition.operator,
      modelProperties.response_due_type,
      condition.value as string,
      integrations,
    ),
  );
};
