import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import Freshchat from '@freshworks-jaya/freshchat-api';
import { Integrations } from '../../models/rule-engine';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import ruleConfig from '../../RuleConfig';

export default (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;

  return freshchat
    .getAverageWaitTimeGivenGroupId(modelProperties.assigned_group_id ? modelProperties.assigned_group_id : 'null', 30)
    .then((value) => {
      const averageWaitTimeInMinutes = Math.floor(value / 60).toString();

      const placeholders = {
        'metrics.average_wait_time': averageWaitTimeInMinutes,
      } as PlaceholdersMap;

      ruleConfig.registerPlugins([
        {
          placeholders,
        },
      ]);

      return value;
    });
};
