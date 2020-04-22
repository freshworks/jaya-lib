import { ProductEventData, ActorType, Actor, ActorSubType } from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCause } from '../../models/rule';

const actorCauseDict: {
  [key in TriggerActorCause]: (actorSubType: ActorSubType) => boolean;
} = {
  [TriggerActorCause.Agent]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.Agent;
  },
  [TriggerActorCause.AgentGroupMapping]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.AgentGroupMapping;
  },
  [TriggerActorCause.AssignmentRule]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.AssignmentRule;
  },
  [TriggerActorCause.AutoResolve]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.AutoResolve;
  },
  [TriggerActorCause.Bot]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.Bot;
  },
  [TriggerActorCause.IntelliAssign]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.Intelliassign;
  },
  [TriggerActorCause.User]: (actorSubType: ActorSubType): boolean => {
    return actorSubType === ActorSubType.User;
  },
};

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.System;
  let isActorCauseMatch = true;

  if (triggerActor.cause && productEventData.actor.sub_type && actorCauseDict[triggerActor.cause]) {
    isActorCauseMatch = actorCauseDict[triggerActor.cause](productEventData.actor.sub_type);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
