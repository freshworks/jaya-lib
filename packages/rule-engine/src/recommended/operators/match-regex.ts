import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
export default (op1: string, op2: string, integrations: Integrations): Promise<void> => {
  const regex = new RegExp(op2, 'g');

  return Utils.promisify(regex.test(op1));
};
