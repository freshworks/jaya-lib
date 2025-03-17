import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  return (
    productEvent === Event.ConversationUpdate &&
    !!productEventData.changes.model_changes &&
    !!productEventData.changes.model_changes?.resolution_sla_breach &&
    !!productEventData.changes.model_changes?.resolution_sla_breach[1] &&
    !!productEventData.conversation?.resolution_due_breached &&
    productEventData.conversation?.resolution_due_type === 'RESOLUTION_DUE'
  );
};
