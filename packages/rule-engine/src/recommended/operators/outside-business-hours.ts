import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default (op1: string, op2: string, integrations: Integrations):boolean => {
  let conditionBusinessHour = Utils.getBusinessHour(
    op1,
    integrations
  );
  if (conditionBusinessHour) {
    return Utils.outsideBusinessHours(conditionBusinessHour);
  }
  return true; 
}

