import { Event, ProductEventData, MessageType } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  return (
    productEvent === Event.MessageCreate &&
    (productEventData.message.messages[0].message_type === MessageType.Normal ||
      productEventData.message.messages[0].message_type === MessageType.System)
  );
};
