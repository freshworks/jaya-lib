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
  [TriggerActorCauseNew.AgentGroupMapping]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.AgentGroupMapping;
  },
  [TriggerActorCauseNew.AssignmentRule]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.AssignmentRule;
  },
  [TriggerActorCauseNew.AutoResolve]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.AutoResolve;
  },
  [TriggerActorCauseNew.ChannelGroupMapping]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.ChannelGroupMapping;
  },
  [TriggerActorCauseNew.IntelliAssign]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.Intelliassign;
  },
  [TriggerActorCauseNew.User]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.UserMessage;
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
