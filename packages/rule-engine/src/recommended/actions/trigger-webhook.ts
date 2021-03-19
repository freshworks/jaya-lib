import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';
import { JsonArray, JsonMap, TriggerWebhookValue, WebhookContentType } from '../../models/rule';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import axios, { AxiosRequestConfig } from 'axios';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Utils } from '../../Utils';
import _ from 'lodash-es';

const contentTypeMap: {
  [key in WebhookContentType]: string;
} = {
  [WebhookContentType.Json]: 'application/json',
  [WebhookContentType.UrlEncoded]: 'application/x-www-form-urlencoded',
  [WebhookContentType.Xml]: 'application/xml',
};

const contentMap: {
  [key in WebhookContentType]: (content: string | JsonMap) => string | JsonMap;
} = {
  [WebhookContentType.Json]: (content: string | JsonMap) => {
    return content;
  },
  [WebhookContentType.UrlEncoded]: (content: string | JsonMap) => {
    return querystring.stringify(content as ParsedUrlQueryInput, '&', '=');
  },
  [WebhookContentType.Xml]: (content: string | JsonMap) => {
    return content;
  },
};

const replacePlaceholdersInObject = (jsonMap: JsonMap | JsonArray, combinedPlaceholders: PlaceholdersMap): void => {
  (function traverseObject(json: JsonMap | JsonArray): void {
    _.forOwn(json, (value, key) => {
      if (_.isString(value)) {
        (json as JsonMap)[key] = findAndReplacePlaceholders(value as string, combinedPlaceholders);
      } else if (_.isObject(value) || _.isArray(value)) {
        traverseObject(value as JsonArray | JsonMap);
      }
    });
  })(jsonMap);
};

const getReplacedContent = (content: string | JsonMap, combinedPlaceholders: PlaceholdersMap): string | JsonMap => {
  if (_.isString(content)) {
    return findAndReplacePlaceholders(content as string, combinedPlaceholders);
  }

  replacePlaceholdersInObject(content as JsonMap, combinedPlaceholders);
  return content;
};

const getRequestConfig = (
  triggerWebhookValue: TriggerWebhookValue,
  combinedPlaceholders: PlaceholdersMap,
): AxiosRequestConfig => {
  // Step 1: Add mandatory method and url parameters
  const axiosRequestConfig: AxiosRequestConfig = {
    method: triggerWebhookValue.requestType,
    url: findAndReplacePlaceholders(triggerWebhookValue.url, combinedPlaceholders),
  };

  // Step 2: Add custom headers if available
  if (triggerWebhookValue.customHeaders) {
    axiosRequestConfig.headers = replacePlaceholdersInObject(
      triggerWebhookValue.customHeaders as JsonMap,
      combinedPlaceholders,
    );
  }

  // Step 3: Handle authentication
  if (triggerWebhookValue.authHeader) {
    if (triggerWebhookValue.authHeader.username) {
      // Simple auth with username and password
      axiosRequestConfig.auth = {
        password: findAndReplacePlaceholders(triggerWebhookValue.authHeader.password, combinedPlaceholders),
        username: findAndReplacePlaceholders(triggerWebhookValue.authHeader.username, combinedPlaceholders),
      };
    } else if (triggerWebhookValue.authHeader.apiKey) {
      // API key based authentication
      if (!axiosRequestConfig.headers) {
        axiosRequestConfig.headers = {};
      }

      axiosRequestConfig.headers['Authorization'] = `Bearer ${findAndReplacePlaceholders(
        triggerWebhookValue.authHeader.apiKey,
        combinedPlaceholders,
      )}`;
    }
  }

  // Step 4: Handle content-type
  if (triggerWebhookValue.contentType) {
    if (!axiosRequestConfig.headers) {
      axiosRequestConfig.headers = {};
    }

    axiosRequestConfig.headers['Content-Type'] = contentTypeMap[triggerWebhookValue.contentType];

    if (triggerWebhookValue.content) {
      // Step 5: Handle content based on content-type
      const replacedContent = getReplacedContent(triggerWebhookValue.content, combinedPlaceholders);

      axiosRequestConfig.data = contentMap[triggerWebhookValue.contentType](replacedContent);
    }
  }

  return axiosRequestConfig;
};

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
  placeholders: PlaceholdersMap,
): Promise<PlaceholdersMap> => {
  const triggerWebhookValue = actionValue as TriggerWebhookValue;

  let combinedPlaceholders: PlaceholdersMap = {};

  // Get dynamic placeholders and combine it with the static placeholders
  try {
    const generatedPlaceholders = await Utils.getDynamicPlaceholders(
      JSON.stringify(`${triggerWebhookValue}`),
      productEventData,
      integrations,
      domain,
      placeholders,
    );

    combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };
  } catch (err) {
    return Promise.reject('Failed to generate dynamic placeholders map');
  }

  const axiosRequestConfig = getRequestConfig(triggerWebhookValue, combinedPlaceholders);

  try {
    // Step 6: Make the API call
    await axios.request(axiosRequestConfig);
  } catch (err) {
    return Promise.reject('Trigger webhook failure');
  }

  return Promise.resolve({});
};
