import { Event, ProductEventData, ConversationStatus } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

const isChangeMatching = (changedAssignee: boolean, assignChangeValue: string | null): boolean => {
  if (assignChangeValue === 'ANY') {
    return true;
  }

  return (assignChangeValue === 'TRUE' && !!changedAssignee) || (assignChangeValue === 'FALSE' && !changedAssignee);
};

const isTriggerChangeMatching = (productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  if (!productEventData.changes.model_changes.do_not_auto_resolve) {
    return false;
  }

  if (!triggerAction.change) {
    return false;
  }

  const conversationAssignChangeTuple = productEventData.changes.model_changes.do_not_auto_resolve;

  return (
    isChangeMatching(conversationAssignChangeTuple[0], triggerAction.change.from) &&
    isChangeMatching(conversationAssignChangeTuple[1], triggerAction.change.to)
  );
};

export default (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  const isProductEventMatch = productEvent === Event.ConversationUpdate;
  let isTriggerChangeMatch = false;

  if (isProductEventMatch && triggerAction.change) {
    isTriggerChangeMatch = isTriggerChangeMatching(productEventData, triggerAction);
  }

  return isTriggerChangeMatch;
};
