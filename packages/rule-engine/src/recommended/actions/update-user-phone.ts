import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import { Api } from '../../models/rule';
import { ErrorCodes, ErrorTypes } from '../../models/error-codes';
import { LogSeverity } from '../../services/GoogleCloudLogging';

export default async (
  integrations: Integrations,
  productEventPayload: ProductEventPayload,
  actionValue: unknown,
  placeholders: PlaceholdersMap,
  apis: Api[],
): Promise<PlaceholdersMap> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);

  const userPhone = actionValue as string;
  let generatedPlaceholders: PlaceholdersMap = {};

  try {
    generatedPlaceholders = await Utils.getDynamicPlaceholders(
      userPhone,
      productEventPayload,
      integrations,
      placeholders,
    );

    const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

    await freshchat.updateUser(productEventPayload.data.associations.user.id, {
      phone: Utils.processHandlebarsAndReplacePlaceholders(userPhone, combinedPlaceholders),
    });
  } catch (err) {
    Utils.log(
      productEventPayload,
      integrations,
      ErrorCodes.FreshchatAction,
      {
        error: {
          data: err?.response?.data,
          headers: err?.response?.headers,
        },
        errorType: ErrorTypes.FreshchatUpdatePhone,
      },
      LogSeverity.ERROR,
    );
    return Promise.reject();
  }

  return Promise.resolve(generatedPlaceholders);
};
