import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';
import axios from 'axios';
import { SendEmailAnyoneValue } from '../../models/rule';
import { Utils } from '../../Utils';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
  placeholders: PlaceholdersMap,
): Promise<PlaceholdersMap> => {
  const modelProperties = productEventData.conversation || productEventData.message;
  const appId = modelProperties.app_id;

  if (!integrations.emailService) {
    return Promise.reject('No email service integration');
  }

  const sendEmailAnyoneValue = actionValue as SendEmailAnyoneValue;
  let generatedPlaceholders: PlaceholdersMap = {};

  try {
    // Step 1: Setup dynamic placeholders using values from subject and body
    generatedPlaceholders = await Utils.getDynamicPlaceholders(
      `${sendEmailAnyoneValue.subject} ${sendEmailAnyoneValue.body}`,
      productEventData,
      integrations,
      domain,
      placeholders,
    );

    const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

    // Step 2: Replace placeholders in subject and body
    const emailTo = sendEmailAnyoneValue.to.map((email) => {
      return {
        email: findAndReplacePlaceholders(email, combinedPlaceholders),
      };
    });

    // Replace end-of-line characters with <br>
    sendEmailAnyoneValue.body = sendEmailAnyoneValue.body.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const emailParams = {
      body: findAndReplacePlaceholders(sendEmailAnyoneValue.body, combinedPlaceholders),
      subject: findAndReplacePlaceholders(sendEmailAnyoneValue.subject, combinedPlaceholders),
      to: emailTo,
    };

    // Step 3: Make send email API call
    await axios.post(
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
    return Promise.reject('Failed to setup dynamic placeholders');
  }

  return Promise.resolve(generatedPlaceholders);
};
