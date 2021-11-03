import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { BusinessHour, isOutsideBusinessHours } from '@freshworks-jaya/utilities';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

export default async (
  op1: string,
  op2: string,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  try {
    const businessHours = ruleMatchCache?.businessHours || (await Utils.getBusinessHours(integrations));
    const businessHour = businessHours.find((bh) => {
      return bh.operatingHoursId === parseInt(op1, 10);
    });
    let result = false;

    if (businessHour) {
      result = isOutsideBusinessHours(businessHour, new Date().getTime());
    }

    return Promise.resolve({
      data: {
        ...ruleMatchCache,
        businessHours,
      },
      result,
    });
  } catch (err) {
    if (err) {
      throw new Error('Error while getting BusinessHour');
    } else {
      return Promise.resolve({
        data: ruleMatchCache,
        result: false,
      });
    }
  }
};
