import { ConditionOperator } from './index';
import ruleConfig from './RuleConfig';
import { Integrations } from './models/rule-engine';
import Helpers from 'handlebars-helpers';
import axios from 'axios';
import {
  BusinessHour,
  findMatchingKeys,
  PlaceholdersMap,
  findAndReplacePlaceholders,
} from '@freshworks-jaya/utilities';
import { MessagePart, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Handlebars from 'handlebars';
import { htmlToText } from 'html-to-text';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ErrorCodes } from './models/error-codes';
import { JsonMap } from './models/rule';
import { GoogleCloudLogging, LogSeverity } from './services/GoogleCloudLogging';

dayjs.extend(utc);

// Register Handlebars helpers
Handlebars.registerHelper(Helpers());
Handlebars.registerHelper(
  'date',
  function (context: string, block: { hash: { format: string | undefined; offset: string } }) {
    let date = dayjs(context);

    const offsetString = block?.hash?.offset;
    const offsetNumber = offsetString && parseInt(offsetString, 10);

    if (Number.isInteger(offsetNumber)) {
      date = date.utcOffset(offsetNumber as number);
    }

    if (block?.hash?.format) {
      return date.format(block.hash.format);
    }

    return date.format();
  },
);
Handlebars.registerHelper('htmlToText', function (context: string) {
  return htmlToText(context);
});

export class Utils {
  public static safelyParseJson(value: string): JsonMap | null {
    try {
      const jsonMap = JSON.parse(value);
      if (typeof jsonMap === 'object' && jsonMap.constructor === Object) {
        return jsonMap;
      }

      throw new Error('Not a valid Json Map');
    } catch (err) {
      return null;
    }
  }

  public static async log(
    productEventPayload: ProductEventPayload,
    integrations: Integrations,
    errorCode: ErrorCodes,
    info: JsonMap,
    severity?: LogSeverity,
  ): Promise<void> {
    try {
      const conversation = productEventPayload.data?.conversation || productEventPayload.data?.message;
      const conversationId = conversation?.conversation_id;
      const googleCloudLogging = new GoogleCloudLogging(integrations.googleCloudLoggingConfig);

      googleCloudLogging.log(
        {
          account_id: productEventPayload.account_id,
          conversation_id: conversationId,
          error_code: errorCode,
          event_epoch: new Date(productEventPayload.timestamp * 1000).toISOString(),
          info,
          region: productEventPayload.region,
        },
        severity || LogSeverity.ERROR,
      );
    } catch (err) {}
  }

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
    let processedString = '';
    let isError = false;
    try {
      const template = Handlebars.compile(value as string);
      processedString = template(placeholders);
    } catch (err) {
      isError = true;
    }

    return isError ? value : processedString;
  }

  public static processHandlebarsAndReplacePlaceholders(value: string, placeholders: PlaceholdersMap): string {
    const handlebarsProcessedValue = this.processHanldebars(value, placeholders);

    return findAndReplacePlaceholders(handlebarsProcessedValue, placeholders);
  }

  public static async getDynamicPlaceholders(
    text: string,
    productEventPayload: ProductEventPayload,
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
              productEventPayload,
              integrations,
              domain,
            );
            generatedPlaceholders[dynamicPlaceholderKey] = value;
          } catch (err) {
            this.log(productEventPayload, integrations, ErrorCodes.DynamicPlaceholder, {
              dynamicPlaceholderKey,
              error: err,
            });
          }
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
