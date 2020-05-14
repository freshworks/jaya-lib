import {
  Event,
  ProductEventData,
  ChangedStatusNew,
  ChangedStatusDeprecated,
} from '@freshworks-jaya/marketplace-models';
import { TriggerAction, ConversationStatusChangeValue, ConversationStatusChange } from '../../models/rule';

const isChangeMatching = (
  changedStatus: ChangedStatusNew | ChangedStatusDeprecated,
  statusChangeValue: ConversationStatusChangeValue | null,
): boolean => {
  if (statusChangeValue === ConversationStatusChangeValue.Any) {
    return true;
  }

  return (
    (statusChangeValue === ConversationStatusChangeValue.Resolved &&
      (changedStatus === ChangedStatusNew.Resolved || changedStatus === ChangedStatusDeprecated.Resolve)) ||
    (statusChangeValue === ConversationStatusChangeValue.New &&
      (changedStatus === ChangedStatusNew.New || changedStatus === ChangedStatusDeprecated.New)) ||
    (statusChangeValue === ConversationStatusChangeValue.Assigned &&
      (changedStatus === ChangedStatusNew.Assigned || changedStatus === ChangedStatusDeprecated.Assign))
  );
};

const isTriggerChangeMatching = (productEventData: ProductEventData, triggerAction: TriggerAction): boolean => {
  if (!productEventData.changes.model_changes.status) {
    return false;
  }

  const conversationStatusChangeTuple = productEventData.changes.model_changes.status;
  const triggerActionStatusChange = triggerAction.change as ConversationStatusChange;

  return (
    isChangeMatching(conversationStatusChangeTuple[0], triggerActionStatusChange.from) &&
    isChangeMatching(conversationStatusChangeTuple[1], triggerActionStatusChange.to)
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
