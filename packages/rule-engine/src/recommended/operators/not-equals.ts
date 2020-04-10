import { Integrations } from '../../models/rule-engine';
export default (op1: string, op2: string, integrations: Integrations): Promise<boolean> => {
  return Promise.resolve(op1 !== op2);
};
