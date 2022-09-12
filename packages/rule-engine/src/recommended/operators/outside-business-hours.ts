import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { isOutsideBusinessHours } from '@freshworks-jaya/utilities';

export default async (
  op1: string,
  op2: string,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleAlias: string | undefined,
): Promise<void> => {
  try {
    const alias = ruleAlias || '';
    const businessHour = await Utils.getBusinessHour(op1, integrations, alias);
    const isOutsideBusinessHoursValue = isOutsideBusinessHours(businessHour, new Date().getTime());
    return Utils.promisify(isOutsideBusinessHoursValue);
  } catch (err) {
    if (err) {
      throw new Error('Error while getting BusinessHour');
    } else {
      return Utils.promisify(false);
    }
  }
};
