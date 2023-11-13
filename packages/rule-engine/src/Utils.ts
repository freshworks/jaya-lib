import { ConditionOperator } from './index';
import ruleConfig from './RuleConfig';
import { Integrations, RuleEngineOptions } from './models/rule-engine';
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
import { APITraceCodes, ErrorCodes } from './models/error-codes';
import { AnyJson, ConditionDataType, JsonMap } from './models/rule';
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
Handlebars.registerHelper('matchRegex', function (sentence: string, regex: RegExp) {
  const isRegExp = (val: RegExp | JsonMap): boolean => {
    if (val instanceof RegExp) {
      return true;
    }

    return (
      typeof val.flags === 'string' &&
      typeof val.ignoreCase === 'boolean' &&
      typeof val.multiline === 'boolean' &&
      typeof val.global === 'boolean'
    );
  };

  if (!(typeof sentence === 'string' && sentence !== '')) {
    return [];
  }
  if (!isRegExp(regex)) {
    throw new TypeError('expected a regular expression');
  }
  return sentence.match(regex);
});

export class Utils {
  public static safelyParseJson(value: string, options?: { allowArray?: boolean }): JsonMap | null {
    try {
      const jsonMap: JsonMap = JSON.parse(value);
      if (
        (typeof jsonMap === 'object' && jsonMap.constructor === Object) ||
        (options?.allowArray && Array.isArray(jsonMap))
      ) {
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
    errorCode: ErrorCodes | APITraceCodes,
    info: JsonMap | AnyJson,
    severity?: LogSeverity,
  ): Promise<void> {
    try {
      const conversation = productEventPayload.data?.conversation || productEventPayload.data?.message;
      const conversationId = conversation?.conversation_id;
      const firstMessage = conversation?.messages && conversation.messages[0];
      const messageId = firstMessage?.id;
      const googleCloudLogging = new GoogleCloudLogging(integrations.googleCloudLoggingConfig);

      googleCloudLogging.log(
        {
          account_id: productEventPayload.account_id,
          actor_subentity: productEventPayload.data.actor.sub_entity || null,
          actor_type: productEventPayload.data.actor.type,
          conversation_id: conversationId,
          domain: productEventPayload.domain,
          error_code: errorCode,
          event_epoch: new Date(productEventPayload.timestamp * 1000).toISOString(),
          event_name: productEventPayload.event,
          info,
          message_id: messageId || 0,
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
        .filter((messagePart) => messagePart.text || messagePart.email)
        .map((messagePart) => {
          return (messagePart.text && messagePart.text.content) || (messagePart.email && messagePart.email.subject);
        })
        .join(' ');
    }

    return messageContent;
  }

  /**
   * Gets a concatenated string of messageParts with type 'email'.
   */
  public static getMessagePartsEmailContent(messageParts: MessagePart[]): string {
    let messageContent = '';

    if (messageParts && messageParts.length) {
      messageContent = messageParts
        .filter((messagePart) => messagePart.email)
        .map((messagePart) => {
          return messagePart.email && messagePart.email.content;
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
    givenPlaceholders: PlaceholdersMap,
    options: RuleEngineOptions,
    ruleAlias: string,
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
              options,
              ruleAlias,
            );
            generatedPlaceholders[dynamicPlaceholderKey] = value;
          } catch (err) {
            this.log(productEventPayload, integrations, ErrorCodes.DynamicPlaceholder, {
              dynamicPlaceholderKey,
              error: err as AnyJson,
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
    operand1: string | boolean,
    operand2: string | boolean,
    integrations: Integrations,
    options: RuleEngineOptions,
    ruleAlias: string,
    conditionDataType?: ConditionDataType,
  ): Promise<void> {
    const sanitizedOperand1 =
      conditionDataType === ConditionDataType.Boolean ? operand1 : this.convertOperand(operand1 as string);
    const sanitizedOperand2 = this.convertOperand(operand2 as string);

    const operatorFunc = ruleConfig.operators && ruleConfig.operators[operator];

    if (operatorFunc) {
      return operatorFunc(sanitizedOperand1 as string, sanitizedOperand2, integrations, options, ruleAlias);
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
  public static getBusinessHour = (
    businessHourId: string,
    integrations: Integrations,
    ruleAlias: string,
  ): Promise<BusinessHour> => {
    const freshchatApiUrl = integrations.freshchatv1.url;
    const freshchatApiToken = integrations.freshchatv1.token;
    return new Promise((resolve, reject) => {
      axios
        .get(`${freshchatApiUrl}/operating_hours_v2`, {
          headers: {
            Authorization: freshchatApiToken,
            'Content-Type': 'application/json',
            'x-automation-rule-alias': ruleAlias,
            'x-service': 'advanced_automation',
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
