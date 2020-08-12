import { ProductEventData, ActorType, ActorSubEntity } from '@freshworks-jaya/marketplace-models';
import { TriggerActor, TriggerActorCauseBot } from '../../models/rule';

const actorCauseDict: {
  [key in TriggerActorCauseBot]: (actorSubEntity: ActorSubEntity) => boolean;
} = {
  [TriggerActorCauseBot.FreddyBot]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.FreddyBot;
  },
  [TriggerActorCauseBot.HallwayBot]: (actorSubEntity: ActorSubEntity): boolean => {
    return actorSubEntity === ActorSubEntity.HallwayBot;
  },
};

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  const isActorTypeMatch = productEventData.actor.type === ActorType.Bot;
  let isActorCauseMatch = true;

  if (
    triggerActor.cause &&
    productEventData.actor.sub_entity &&
    actorCauseDict[(triggerActor.cause as unknown) as TriggerActorCauseBot]
  ) {
    isActorCauseMatch = actorCauseDict[(triggerActor.cause as unknown) as TriggerActorCauseBot](
      productEventData.actor.sub_entity,
    );
  }

  return isActorTypeMatch && isActorCauseMatch;
};
