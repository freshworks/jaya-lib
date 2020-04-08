import { ConditionOperator } from './index';
import ruleConfig from './RuleConfig';
import usernameVerbs from './constants/username-verbs';
import usernameNouns from './constants/username-nouns';

export class Utils {
  /**
   * Returns true if username is generated
   */
  public static isUsernameGenerated(username: string): boolean {
    const split = username.split(/\s+/);

    if (split.length !== 2) {
      return false;
    }

    const [verb, noun] = split;
    return !!(usernameVerbs[verb] && usernameNouns[noun]);
  }

  /**
   * Converts operand to string.
   */
  public static convertOperand(operand: string): string {
    let retVal: string = operand && operand.toString().trim().toLowerCase();

    retVal = typeof retVal === 'string' ? retVal : '';
    return retVal;
  }

  /**
   * Performs operation defined by 'operator' on operands operand1 and operand2.
   */
  public static evaluateCondition(operator: ConditionOperator, operand1: string, operand2: string): boolean {
    const sanitizedOperand1 = this.convertOperand(operand1);
    const sanitizedOperand2 = this.convertOperand(operand2);

    const operatorFunc = ruleConfig.operators && ruleConfig.operators[operator];

    if (operatorFunc) {
      return operatorFunc(sanitizedOperand1, sanitizedOperand2);
    }

    throw new Error('no matching condition');
  }
}
