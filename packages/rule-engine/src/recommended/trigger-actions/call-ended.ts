import { Event, ProductEventData, MessageType } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    !!productEventData.changes.model_changes &&
    productEventData.changes.model_changes.call_ended[1] //--update
  );
};
