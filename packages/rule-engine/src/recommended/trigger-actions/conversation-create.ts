import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  return productEvent === Event.ConversationCreate;
};
