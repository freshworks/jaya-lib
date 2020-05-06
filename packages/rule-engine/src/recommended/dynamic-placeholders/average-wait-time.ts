import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';

export default (productEventData: ProductEventData, integrations: Integrations): Promise<string> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;

  return freshchat
    .getAverageWaitTimeGivenGroupId(modelProperties.assigned_group_id ? modelProperties.assigned_group_id : 'null', 1)
    .then((value) => {
      return Math.ceil(value / 60).toString();
    });
};
