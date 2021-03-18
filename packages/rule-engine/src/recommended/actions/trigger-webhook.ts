/* eslint-disable complexity */
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';
import { TriggerWebhookValue, WebhookContentType } from '../../models/rule';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import axios, { AxiosRequestConfig } from 'axios';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Utils } from '../../Utils';

const contentTypeMap: {
  [key in WebhookContentType]: string;
} = {
  [WebhookContentType.Json]: 'application/json',
  [WebhookContentType.UrlEncoded]: 'application/x-www-form-urlencoded',
  [WebhookContentType.Xml]: 'application/xml',
};

const contentMap: {
  [key in WebhookContentType]: (content: string | object) => string | object;
} = {
  [WebhookContentType.Json]: (content: string | object) => {
    return content;
  },
  [WebhookContentType.UrlEncoded]: (content: string | object) => {
    return querystring.stringify(content as ParsedUrlQueryInput, '&', '=');
  },
  [WebhookContentType.Xml]: (content: string | object) => {
    return content;
  },
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
    // TODO: findAndReplacePlaceholders in each property value of customHeaders
    axiosRequestConfig.headers = { ...triggerWebhookValue.customHeaders };
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
      // TODO: findAndReplacePlaceholders in each property value of content
      axiosRequestConfig.data = contentMap[triggerWebhookValue.contentType](triggerWebhookValue.content);
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
