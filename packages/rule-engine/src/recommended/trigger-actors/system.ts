import { ProductEventData, ActorType, Actor, ActorSubType } from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCause } from '../../models/rule';

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.System;
  // Todo: check for cause if it is present
  let isActorCauseMatch = true;

  const actorCauseDict: {
    [key: string]: (productEventActor: Actor) => boolean;
  } = {
    [TriggerActorCause.Agent]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.Agent;
    },
    [TriggerActorCause.AgentGroupMapping]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.AgentGroupMapping;
    },
    [TriggerActorCause.AssignmentRule]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.AssignmentRule;
    },
    [TriggerActorCause.AutoResolve]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.AutoResolve;
    },
    [TriggerActorCause.Bot]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.Bot;
    },
    [TriggerActorCause.IntelliAssign]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.Intelliassign;
    },
    [TriggerActorCause.User]: (productEventActor: Actor): boolean => {
      return productEventActor.sub_type === ActorSubType.User;
    },
  };

  if (triggerActor.cause && actorCauseDict[triggerActor.cause]) {
    isActorCauseMatch = actorCauseDict[triggerActor.cause](productEventData.actor);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
