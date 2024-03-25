import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    !!productEventData.changes.model_changes &&
    !!productEventData.changes.model_changes?.detected_language &&
    !!productEventData.changes.model_changes?.detected_language[1]
  );
};
