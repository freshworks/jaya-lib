import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
export default (op1: string, op2: string, integrations: Integrations): Promise<void> => {
  return Utils.promisify(!!op1);
};
