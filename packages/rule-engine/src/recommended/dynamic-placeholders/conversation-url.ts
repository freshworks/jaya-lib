import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Integrations } from '../../models/rule-engine';

export default (productEventData: ProductEventData, integrations: Integrations, domain: string): Promise<string> => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return Promise.resolve(
    `https://${domain}/a/${modelProperties.app_id}/open/conversation/${modelProperties.conversation_id}`,
  );
};
