import { ConditionOperator } from './index';
import ruleConfig from './RuleConfig';
import usernameVerbs from './constants/username-verbs';
import usernameNouns from './constants/username-nouns';
import { Integrations } from './models/rule-engine';
import axios from 'axios';
import { isOutsideBusinessHours, BusinessHour } from '@freshworks-jaya/utilities';

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
  public static evaluateCondition(
    operator: ConditionOperator,
    operand1: string,
    operand2: string,
    integrations: Integrations,
  ): Promise<boolean> {
    const sanitizedOperand1 = this.convertOperand(operand1);
    const sanitizedOperand2 = this.convertOperand(operand2);

    const operatorFunc = ruleConfig.operators && ruleConfig.operators[operator];

    if (operatorFunc) {
      return operatorFunc(sanitizedOperand1, sanitizedOperand2, integrations);
    }

    throw new Error('no matching condition');
  }

  /**
   * Gets business hour for an account based on businessHourId provided.
   */
  public static getBusinessHour = (businessHourId: string, integrations: Integrations): Promise<boolean> => {
    const freshchatApiUrl = integrations.freshchatv1.url;
    const freshchatApiToken = integrations.freshchatv1.token;
    return new Promise((resolve, reject) => {
      axios
        .get(freshchatApiUrl, {
          headers: {
            Authorization: freshchatApiToken,
          },
        })
        .then((response: { data: BusinessHour[] }) => {
          const conditionBusinessHour = response.data.filter((businessHour) => {
            return businessHour.operatingHoursId === parseInt(businessHourId, 10);
          });
          if (conditionBusinessHour && conditionBusinessHour && conditionBusinessHour[0]) {
            resolve(isOutsideBusinessHours(conditionBusinessHour && conditionBusinessHour[0], new Date().getTime()));
          } else {
            //  no businesshour then its within business hour
            resolve(false);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
