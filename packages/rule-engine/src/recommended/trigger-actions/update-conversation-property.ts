import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  const keys = Object.keys(productEventData.changes.model_changes);
  const match = keys.find((value) => /^cf_[a-zA-Z0-9_]+/.test(value));

  return (
    productEvent === Event.ConversationUpdate &&
    productEventData.actor.actor_source != 'API' &&
    !!productEventData.changes.model_changes &&
    (!!productEventData.changes.model_changes.assigned_agent_id ||
      !!productEventData.changes.model_changes.assigned_group_id ||
      !!productEventData.changes.model_changes.status ||
      !!productEventData.changes.model_changes.priority ||
      match !== undefined)
  );
};
