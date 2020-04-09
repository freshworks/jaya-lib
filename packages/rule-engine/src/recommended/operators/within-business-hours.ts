import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { isOutsideBusinessHours } from '@freshworks-jaya/utilities';

export default (op1: string, op2: string, integrations: Integrations): boolean => {
  const conditionBusinessHours = Utils.getBusinessHour(op1, integrations);
  if (conditionBusinessHours) {
    return !isOutsideBusinessHours(conditionBusinessHours, new Date().getTime());
  }
  return true;
};
