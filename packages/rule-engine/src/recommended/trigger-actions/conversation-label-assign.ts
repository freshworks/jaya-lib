import { Event, ProductEventData, ConversationStatus } from '@freshworks-jaya/marketplace-models';
import { TriggerAction } from '../../models/rule';

const isChangeMatching = (changedAssignee: string, assignChangeValue: string | null): boolean => {
  if (assignChangeValue === 'ANY') {
    return true;
  }

  return (
    (assignChangeValue === 'ASSIGNED' && !!changedAssignee) ||
    (assignChangeValue === 'UNASSIGNED' && !changedAssignee) ||
    assignChangeValue === changedAssignee
  );
};

const isTriggerChangeMatching = (productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  if (!productEventData.changes.model_changes.label_category_id || !productEventData.changes.model_changes.label_subcategory_id) {
    return false;
  }

  if (!triggerAction.change) {
    return false;
  }

  const conversationLabelCategoryChangeTuple = productEventData.changes.model_changes.label_category_id;
  const conversationLabelSubcategoryChangeTuple = productEventData.changes.model_changes.label_subcategory_id;

  return (
    (
      isChangeMatching(conversationLabelCategoryChangeTuple[0], triggerAction.change.from) &&
      isChangeMatching(conversationLabelCategoryChangeTuple[1], triggerAction.change.to)
    ) ||
    (
      isChangeMatching(conversationLabelSubcategoryChangeTuple[0], triggerAction.change.from) &&
      isChangeMatching(conversationLabelSubcategoryChangeTuple[1], triggerAction.change.to)
    )
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
