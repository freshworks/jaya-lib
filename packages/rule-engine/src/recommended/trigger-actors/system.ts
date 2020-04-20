import { ProductEventData, ActorType, Actor, ActorSubType } from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCause } from '../../models/rule';

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.System;
  // Todo: check for cause if it is present
  let isActorCauseMatch = true;

  const actorCauseDict: {
    [key: string]: (actor: Actor) => boolean;
  } = {
    [TriggerActorCause.Agent]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.Agent;
    },
    [TriggerActorCause.AgentGroupMapping]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.AgentGroupMapping;
    },
    [TriggerActorCause.AssignmentRule]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.AssignmentRule;
    },
    [TriggerActorCause.AutoResolve]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.AutoResolve;
    },
    [TriggerActorCause.Bot]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.Bot;
    },
    [TriggerActorCause.IntelliAssign]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.Intelliassign;
    },
    [TriggerActorCause.User]: (actor: Actor): boolean => {
      return actor.sub_type === ActorSubType.User;
    },
  };

  if (triggerActor.cause && actorCauseDict[triggerActor.cause]) {
    isActorCauseMatch = actorCauseDict[triggerActor.cause](productEventData.actor);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
