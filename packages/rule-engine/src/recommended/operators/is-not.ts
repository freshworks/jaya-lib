import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default (op1: string, op2: string, integrations: Integrations, options: RuleEngineOptions): Promise<void> => {
  try {
    const operand1 = new Date(op1);
    const operand2 = new Date(op2);

    return Utils.promisify(operand1.getTime() !== operand2.getTime());
  } catch (err) {
    return Promise.reject('Error converting the given operand to date format');
  }
};
