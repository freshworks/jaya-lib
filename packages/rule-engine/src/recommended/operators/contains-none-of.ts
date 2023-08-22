import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default (op1: string, op2: string, integrations: Integrations, options: RuleEngineOptions): Promise<void> => {
  const operand1 = JSON.parse(op1) as string[];
  const operand2 = op2.split(',');
  let containsAll;
  if (operand1.length == 0) {
    containsAll = true;
  } else {
    containsAll = operand2.every((element) => {
      return !operand1.includes(element);
    });
  }
  return Utils.promisify(containsAll);
};
