import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';

export default (productEventPayload: ProductEventPayload, integrations: Integrations): Promise<string> => {
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;

  return Promise.resolve(
    `https://${productEventPayload.domain}/a/${modelProperties.app_id}/open/conversation/${modelProperties.conversation_id}`,
  );
};
