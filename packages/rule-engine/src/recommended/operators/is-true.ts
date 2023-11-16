import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { Utils } from '../../Utils';
export default (op1: string, op2: string, integrations: Integrations, options: RuleEngineOptions): Promise<void> => {
  return Utils.promisify(op1 === 'true');
};
