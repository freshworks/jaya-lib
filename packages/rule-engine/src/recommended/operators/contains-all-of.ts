import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { ErrorCodes, ErrorTypes } from '../../models/error-codes';

export default (op1: string, op2: string, integrations: Integrations, options: RuleEngineOptions): Promise<void> => {
  const operand1 = JSON.parse(op1) as string[];
  const operand2 = JSON.parse(op2) as string[];

  const containsAll = operand1.every((element) => {
    return operand2.includes(element);
  });
  Utils.customlog(integrations, ErrorCodes.FreshchatAction, {
    error: {
      operand1: operand1,
      operand2: operand2,
      prop2: containsAll,
    },
  });
  return Utils.promisify(containsAll);
};
