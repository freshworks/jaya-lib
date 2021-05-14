import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';

export default (
  productEventPayload: ProductEventPayload,
  integrations: Integrations,
  domain: string,
): Promise<string> => {
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;

  return Promise.resolve(
    `https://${domain}/a/${modelProperties.app_id}/open/conversation/${modelProperties.conversation_id}`,
  );
};
