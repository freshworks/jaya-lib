import {
  ProductEventData,
  ActorType,
  ActorSubTypeDeprecated,
  ActorSubEntity,
} from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCauseDeprecated, TriggerActorCauseNew } from '../../models/rule';

const actorCauseDictDeprecated: {
  [key in TriggerActorCauseDeprecated]: (actorSubType: ActorSubTypeDeprecated) => boolean;
} = {
  [TriggerActorCauseDeprecated.Agent]: (actorSubType: ActorSubTypeDeprecated): boolean => {
    return actorSubType === ActorSubTypeDeprecated.Agent;
  },
  [TriggerActorCauseDeprecated.AgentGroupMapping]: (actorSubType: ActorSubTypeDeprecated): boolean => {
    return actorSubType === ActorSubTypeDeprecated.AgentGroupMapping;
  },
  [TriggerActorCauseDeprecated.AssignmentRule]: (actorSubType: ActorSubTypeDeprecated): boolean => {
    return actorSubType === ActorSubTypeDeprecated.AssignmentRule;
  },
  [TriggerActorCauseDeprecated.AutoResolve]: (actorSubType: ActorSubTypeDeprecated): boolean => {
    return actorSubType === ActorSubTypeDeprecated.AutoResolve;
  },
  [TriggerActorCauseDeprecated.IntelliAssign]: (actorSubType: ActorSubTypeDeprecated): boolean => {
    return actorSubType === ActorSubTypeDeprecated.Intelliassign;
  },
  [TriggerActorCauseDeprecated.User]: (actorSubType: ActorSubTypeDeprecated): boolean => {
    return actorSubType === ActorSubTypeDeprecated.User;
  },
};

const actorCauseDict: {
  [key in TriggerActorCauseNew]: (actorSubEntity: ActorSubEntity) => boolean;
} = {
  [TriggerActorCauseNew.Agent]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.Agent;
  },
  [TriggerActorCauseNew.AgentGroupMapping]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.AgentGroupMapping;
  },
  [TriggerActorCauseNew.AssignmentRule]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.AssignmentRule;
  },
  [TriggerActorCauseNew.AutoResolve]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.AutoResolve;
  },
  [TriggerActorCauseNew.ChannelGroupMapping]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.ChannelGroupMapping;
  },
  [TriggerActorCauseNew.IntelliAssign]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.Intelliassign;
  },
  [TriggerActorCauseNew.User]: (actorSubType: ActorSubEntity): boolean => {
    return actorSubType === ActorSubEntity.UserMessage;
  },
};

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.System;
  let isActorCauseMatch = true;

  if (
    triggerActor.cause &&
    productEventData.actor.sub_type &&
    actorCauseDictDeprecated[triggerActor.cause as TriggerActorCauseDeprecated]
  ) {
    isActorCauseMatch = actorCauseDictDeprecated[triggerActor.cause as TriggerActorCauseDeprecated](
      productEventData.actor.sub_type,
    );
  } else if (triggerActor.cause && productEventData.actor.sub_entity && actorCauseDict[triggerActor.cause]) {
    isActorCauseMatch = actorCauseDict[triggerActor.cause](productEventData.actor.sub_entity);
  }

  return isActorTypeMatch && isActorCauseMatch;
};
