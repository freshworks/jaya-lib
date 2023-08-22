import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { ErrorCodes, ErrorTypes } from '../../models/error-codes';

export default (op1: string, op2: string, integrations: Integrations, options: RuleEngineOptions): Promise<void> => {
  const operand1 = JSON.parse(op1) as string[];
  const operand2 = op2.split(',');
  const containsAll = operand2.every((element) => {
    return operand1.includes(element);
  });
  return Utils.promisify(containsAll);
};
