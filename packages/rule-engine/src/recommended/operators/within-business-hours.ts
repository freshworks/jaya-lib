import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default async (op1: string, op2: string, integrations: Integrations): Promise<boolean> => {
  const businessHour = await Utils.getBusinessHour(op1, integrations);
  return !businessHour;
};
