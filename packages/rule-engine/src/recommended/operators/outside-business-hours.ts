import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { isOutsideBusinessHours } from '@freshworks-jaya/utilities';

export default async (op1: string, op2: string, integrations: Integrations): Promise<void> => {
  try {
    const businessHour = await Utils.getBusinessHour(op1, integrations);
    return Utils.promisify(isOutsideBusinessHours(businessHour, new Date().getTime()));
  } catch (err) {
    if (err) {
      throw new Error('Error while getting BusinessHour');
    } else {
      return Utils.promisify(false);
    }
  }
};
