import { ProductEventData, ActorType, Actor, ActorSubType } from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCause } from '../../models/rule';

// eslint-disable-next-line complexity
export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.System;
  // Todo: check for cause if it is present
  let isActorCauseMatch = true;

  if (triggerActor.cause) {
    isActorCauseMatch =
      (triggerActor.cause === TriggerActorCause.IntelliAssign &&
        productEventData.actor.sub_type === ActorSubType.Intelliassign) ||
      (triggerActor.cause === TriggerActorCause.AssignmentRule &&
        productEventData.actor.sub_type === ActorSubType.AssignmentRule) ||
      (triggerActor.cause === TriggerActorCause.AgentGroupMapping &&
        productEventData.actor.sub_type === ActorSubType.AgentGroupMapping) ||
      (triggerActor.cause === TriggerActorCause.User && productEventData.actor.sub_type === ActorSubType.User) ||
      (triggerActor.cause === TriggerActorCause.Agent && productEventData.actor.sub_type === ActorSubType.Agent) ||
      (triggerActor.cause === TriggerActorCause.AutoResolve &&
        productEventData.actor.sub_type === ActorSubType.AutoResolve) ||
      (triggerActor.cause === TriggerActorCause.Bot && productEventData.actor.sub_type === ActorSubType.Bot);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
