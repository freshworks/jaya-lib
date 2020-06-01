import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';
import axios from 'axios';
import { SendEmailAnyoneValue } from '../../models/rule';
import { Utils } from '../../Utils';
import ruleConfig from '../../RuleConfig';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
  const modelProperties = productEventData.conversation || productEventData.message;
  const appId = modelProperties.app_id;

  if (!integrations.emailService) {
    return Promise.reject('No email service integration');
  }

  const sendEmailAnyoneValue = actionValue as SendEmailAnyoneValue;

  try {
    // Step 1: Setup dynamic placeholders using values from subject and body
    // await Utils.setupDynamicPlaceholders(
    //   `${sendEmailAnyoneValue.subject}-${sendEmailAnyoneValue.body}`,
    //   productEventData,
    //   integrations,
    // );

    // Step 2: Replace placeholders in subject and body
    const emailTo = sendEmailAnyoneValue.to.map((email) => {
      return {
        email: email,
      };
    });

    // const emailParams = {
    //   body: findAndReplacePlaceholders(sendEmailAnyoneValue.body, ruleConfig.placeholders as PlaceholdersMap),
    //   subject: findAndReplacePlaceholders(sendEmailAnyoneValue.subject, ruleConfig.placeholders as PlaceholdersMap),
    //   to: emailTo,
    // };

    const emailParams = {
      body: sendEmailAnyoneValue.body,
      subject: sendEmailAnyoneValue.subject,
      to: emailTo,
    };

    // Step 3: Make send email API call
    return axios.post(
      `${integrations.emailService.url}/api/v1/email/send`,
      JSON.stringify({
        accountId: appId,
        from: {
          email: 'no-reply@freshchat.com',
          name: 'Freshchat Automations',
        },
        html: emailParams.body,
        subject: emailParams.subject,
        to: emailParams.to,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: integrations.emailService.apiKey,
        },
      },
    );
  } catch (err) {
    return Promise.reject('Error sending conversation as html via email');
  }
};
