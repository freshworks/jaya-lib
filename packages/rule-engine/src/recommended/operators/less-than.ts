import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

export default (
  op1: string,
  op2: string,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  const operand1 = parseInt(op1, 10);
  const operand2 = parseInt(op2, 10);

  return Promise.resolve({
    data: ruleMatchCache,
    result: operand1 < operand2,
  });
};
