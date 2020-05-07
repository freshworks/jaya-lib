import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
export default (op1: string, op2: string, integrations: Integrations): Promise<void> => {
  const operand1 = parseInt(op1, 10);
  const operand2 = parseInt(op2, 10);

  return Utils.promisify(operand1 > operand2);
};
