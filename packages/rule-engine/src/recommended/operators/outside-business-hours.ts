import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default (op1: string, op2: string, integrations: Integrations): boolean => {
  const conditionBusinessHours = Utils.getBusinessHour(op1, integrations);
  if (conditionBusinessHours) {
    return Utils.outsideBusinessHours(conditionBusinessHours);
  }
  return true;
};
