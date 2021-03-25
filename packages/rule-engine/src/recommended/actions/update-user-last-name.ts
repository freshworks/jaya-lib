import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
  placeholders: PlaceholdersMap,
): Promise<PlaceholdersMap> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);

  const userName = actionValue as string;
  let generatedPlaceholders: PlaceholdersMap = {};

  try {
    generatedPlaceholders = await Utils.getDynamicPlaceholders(
      userName,
      productEventData,
      integrations,
      domain,
      placeholders,
    );

    const combinedPlaceholders = { ...placeholders, ...generatedPlaceholders };

    await freshchat.updateUser(productEventData.associations.user.id, {
      last_name: Utils.processHandlebarsAndReplacePlaceholders(userName, combinedPlaceholders),
    });
  } catch (err) {
    return Promise.reject();
  }

  return Promise.resolve(generatedPlaceholders);
};
