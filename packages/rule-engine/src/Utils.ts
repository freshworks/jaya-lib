import { ConditionOperator, PluginPlaceholders } from './index';
import ruleConfig from './RuleConfig';
import usernameVerbs from './constants/username-verbs';
import usernameNouns from './constants/username-nouns';
import { Integrations } from './models/rule-engine';
import axios from 'axios';

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
  public static evaluateCondition(operator: ConditionOperator, operand1: string, operand2: string, integrations: Integrations): boolean {
    const sanitizedOperand1 = this.convertOperand(operand1);
    const sanitizedOperand2 = this.convertOperand(operand2);

    const operatorFunc = ruleConfig.operators && ruleConfig.operators[operator];

    if (operatorFunc) {
      return operatorFunc(sanitizedOperand1, sanitizedOperand2, integrations);
    }

    throw new Error('no matching condition');
  }

  /**
   * Replaces all occurrences of a string within a string with another string.
   */
  public static replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  /**
   * Finds and replaces all placeholders.
   */
  public static findAndReplacePlaceholders(message: string, placeholders: PluginPlaceholders): string {
    let result = message;

    // Construct regex string with placeholders like so.
    // agent\\.first_name|agent\\.last_name|agent\\.id
    const placeholdersRegExpString = Object.keys(placeholders)
      .map((placeholder) => {
        return placeholder.replace('.', '\\.');
      })
      .join('|');

    // Regex to find all placeholders in a given string with the format.
    // {<placeholder>|<alValue>}
    // Eg. {user.first_name|there}
    const regExpString = `(?:(?<=\\{)(?:${placeholdersRegExpString})(?:\\|[\\w\\s]+)?(?=\\}))`;
    const placeholdersRegExp = new RegExp(regExpString, 'gm');

    // Find matches in the given message for above regexp.
    // Eg. ['user.first_name|there', 'agent.id']
    const matches = message.match(placeholdersRegExp);

    // Replace placeholder with value for each match
    if (Array.isArray(matches)) {
      result = matches.reduce((replacedString, match) => {
        // Each match is of the format `field|altValue`
        const [field, altValue] = match.split('|');

        // Construct regex to replace all occurrences of match.
        // Use value for placeholder from
        // If not available, use altValue.
        // Even if that is not available, use an empty string.
        // Constructed replacement regex string will look like so.
        // Eg. \\{user\\.first_name(\\|there)?\\}
        const value = (placeholders && placeholders[field]) || altValue || '';
        const regExpReplaceString = `\\{${field.replace('.', '\\.')}(\\|${altValue})?\\}`;

        // Replace all occurrences of placeholder with value.
        return this.replaceAll(replacedString, regExpReplaceString, value.trim());
      }, result);
    }

    return result;
  }
  /**
   * Returns true if isWithinBusinessHours
   */
  public static isWithinBusinessHours(businessHour: any): boolean {
    return true;
  }
  /**
   * Returns true if outsideBusinessHours
   */
  public static outsideBusinessHours(businessHour: any): boolean {
    return true;
  }
  /**
   * Gets business hour for an account based on businessHourId provided.
   */
  public static getBusinessHour = async (
    businessHourId: string,
    integrations: Integrations
  ): Promise<any> => {
    const freshchatApiUrl= integrations.freshchatv1.url;
    const freshchatApiToken= integrations.freshchatv1.token;
    try {
      let businessHours = await axios.get(freshchatApiUrl, {
        headers: {
          Authorization: freshchatApiToken,
        },
      });
      let conditionBusinessHour = businessHours.data.filterBy('operatingHoursId', parseInt(businessHourId));
      return conditionBusinessHour && conditionBusinessHour[0];
    } catch (err) {
      throw new Error('Error getting BusinessHours');
    }
  }
}
