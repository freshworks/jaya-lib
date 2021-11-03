import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

export default (
  op1: string,
  op2: string,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  return Promise.resolve({
    data: ruleMatchCache,
    result: op1.toLowerCase().startsWith(op2.toLowerCase()),
  });
};
