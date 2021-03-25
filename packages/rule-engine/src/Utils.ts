import { ConditionOperator } from './index';
import ruleConfig from './RuleConfig';
import { Integrations } from './models/rule-engine';
import axios from 'axios';
import {
  BusinessHour,
  findMatchingKeys,
  PlaceholdersMap,
  findAndReplacePlaceholders,
} from '@freshworks-jaya/utilities';
import { MessagePart, ProductEventData } from '@freshworks-jaya/marketplace-models';
import Handlebars from 'handlebars';
import Helpers from 'handlebars-helpers';
import { htmlToText } from 'html-to-text';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Register Handlebars helpers
Handlebars.registerHelper(Helpers());
Handlebars.registerHelper('date', function (context, block) {
  return dayjs(context).utcOffset(block.hash.offset).format(block.hash.format);
});
Handlebars.registerHelper('htmlToText', function (context) {
  return htmlToText(context);
});

export class Utils {
  /**
   * Gets a concatenated string of messageParts with type 'text'.
   */
  public static getMessagePartsTextContent(messageParts: MessagePart[]): string {
    let messageContent = '';

    if (messageParts && messageParts.length) {
      messageContent = messageParts
        .filter((messagePart) => messagePart.text)
        .map((messagePart) => {
          return messagePart.text && messagePart.text.content;
        })
        .join(' ');
    }

    return messageContent;
  }

  public static processHanldebars(value: string, placeholders: PlaceholdersMap): string {
    const template = Handlebars.compile(value as string);
    return template(placeholders);
  }

  public static processHandlebarsAndReplacePlaceholders(value: string, placeholders: PlaceholdersMap): string {
    return findAndReplacePlaceholders(this.processHanldebars(value, placeholders), placeholders);
  }

  public static async getDynamicPlaceholders(
    text: string,
    productEventData: ProductEventData,
    integrations: Integrations,
    domain: string,
    givenPlaceholders: PlaceholdersMap,
  ): Promise<PlaceholdersMap> {
    // Step 1: Extract dynamic placeholder keys from text
    // Step 2: Fetch data required by all matching keys
    // Step 3: Return the generated placeholders map
    const generatedPlaceholders: PlaceholdersMap = {};

    if (ruleConfig.dynamicPlaceholders) {
      // Step 1
      // ------
      // Will receive an array like ['metrics.average_wait_time']
      const matchingDynamicPlaceholderKeys = findMatchingKeys(text, ruleConfig.dynamicPlaceholders);

      // Step 2
      // ------
      if (matchingDynamicPlaceholderKeys) {
        for (let i = 0, len = matchingDynamicPlaceholderKeys.length; i < len; i++) {
          const dynamicPlaceholderKey = matchingDynamicPlaceholderKeys[i];

          // Check if the placeholder key already exists in either the given placeholders or the generated placeholders in this function.
          if ({ ...givenPlaceholders, ...generatedPlaceholders }[dynamicPlaceholderKey]) {
            continue;
          }

          try {
            const value = await ruleConfig.dynamicPlaceholders[dynamicPlaceholderKey](
              productEventData,
              integrations,
              domain,
            );
            generatedPlaceholders[dynamicPlaceholderKey] = value;
          } catch (err) {}
        }
      }
    }

    // Step 3
    // ------
    return Promise.resolve(generatedPlaceholders);
  }

  /**
   * Converts operand to string.
   */
  public static convertOperand(operand: string): string {
    let retVal: string = operand && operand.toString().trim();

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
  ): Promise<void> {
    const sanitizedOperand1 = this.convertOperand(operand1);
    const sanitizedOperand2 = this.convertOperand(operand2);

    const operatorFunc = ruleConfig.operators && ruleConfig.operators[operator];

    if (operatorFunc) {
      return operatorFunc(sanitizedOperand1, sanitizedOperand2, integrations);
    }

    throw new Error('no matching condition');
  }

  /**
   * Either resolve or reject based on boolean param.
   */
  public static promisify = (response: boolean): Promise<void> => {
    return response ? Promise.resolve() : Promise.reject();
  };

  /**
   * Gets business hour for an account based on businessHourId provided.
   */
  public static getBusinessHour = (businessHourId: string, integrations: Integrations): Promise<BusinessHour> => {
    const freshchatApiUrl = integrations.freshchatv1.url;
    const freshchatApiToken = integrations.freshchatv1.token;
    return new Promise((resolve, reject) => {
      axios
        .get(`${freshchatApiUrl}/operating_hours_v2`, {
          headers: {
            Authorization: freshchatApiToken,
            'Content-Type': 'application/json',
          },
        })
        .then((response: { data: { operatingHours: BusinessHour[] } }) => {
          const matchingBusinessHour = response.data.operatingHours.find((businessHour) => {
            return businessHour.operatingHoursId === parseInt(businessHourId, 10);
          });
          if (matchingBusinessHour) {
            resolve(matchingBusinessHour);
          } else {
            reject();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
