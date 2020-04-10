import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { isOutsideBusinessHours } from '@freshworks-jaya/utilities/lib/is-outside-business-hours';

export default async (op1: string, op2: string, integrations: Integrations): Promise<void> => {
  const businessHour = await Utils.getBusinessHour(op1, integrations);
  return Utils.promisify(!isOutsideBusinessHours(businessHour, new Date().getTime()));
};
