import { Integrations, RuleEngineOptions } from '../../models/rule-engine';
import { RuleMatchCache, RuleMatchResponse } from '../../models/plugin';

export default (
  op1: string,
  op2: string,
  integrations: Integrations,
  options: RuleEngineOptions,
  ruleMatchCache: Partial<RuleMatchCache>,
): Promise<RuleMatchResponse> => {
  const regex = new RegExp(op2, 'g');

  return Promise.resolve({
    data: ruleMatchCache,
    result: regex.test(op1),
  });
};
