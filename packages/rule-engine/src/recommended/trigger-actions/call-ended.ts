import { Event, ProductEventData, MessageType } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    !!productEventData.conversation.ext_entity_meta &&
    productEventData.conversation.ext_entity_meta.meta &&
    productEventData.conversation.ext_entity_meta.meta.call_life_cycle_event_type === 'CALL_ENDS'
  );
};
