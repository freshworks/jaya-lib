import { ProductEventData, ActorType, ActorSubEntity } from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCause } from '../../models/rule';

const actorCauseDict: {
  [key in TriggerActorCause]: (actorSubEntity: ActorSubEntity) => boolean;
} = {
  [TriggerActorCause.AgentGroupMapping]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.AgentGroupMapping;
  },
  [TriggerActorCause.AssignmentRule]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.AssignmentRule;
  },
  [TriggerActorCause.AutoResolve]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.AutoResolve;
  },
  [TriggerActorCause.ChannelGroupMapping]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.ChannelGroupMapping;
  },
  [TriggerActorCause.Freddy]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.FreddyBot;
  },
  [TriggerActorCause.IntelliAssign]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.Intelliassign;
  },
  [TriggerActorCause.PublicAPI]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.HallwayBot;
  },
  [TriggerActorCause.User]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.UserMessage;
  },
};

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.Bot;
  let isActorCauseMatch = true;

  if (triggerActor.cause && productEventData.actor.sub_entity && actorCauseDict[triggerActor.cause]) {
    isActorCauseMatch = actorCauseDict[triggerActor.cause](productEventData.actor.sub_entity);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
