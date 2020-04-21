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

function isActorCauseMatching(triggerActorCause: string, actorSubType: string): boolean {
  switch (triggerActorCause) {
    case 'INTELLI_ASSIGN':
      return actorSubType === ActorSubType.Intelliassign;
    case 'ASSIGNMENT_RULE':
      return actorSubType === ActorSubType.AssignmentRule;
    default:
      return false;
  }
}

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.System;
  // Todo: check for cause if it is present
  let isActorCauseMatch = true;

  if (triggerActor.cause && productEventData.actor.sub_type && actorCauseDict[triggerActor.cause]) {
    isActorCauseMatch = actorCauseDict[triggerActor.cause](productEventData.actor.sub_type);
  }

  if (triggerActor.cause && productEventData.actor.sub_type) {
    isActorCauseMatch = isActorCauseMatching(triggerActor.cause as string, productEventData.actor.sub_type as string);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
