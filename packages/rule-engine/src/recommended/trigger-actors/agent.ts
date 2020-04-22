import { ProductEventData, ActorType } from '@freshworks-jaya/marketplace-models';
import { TriggerActor } from '../../models/rule';

export default (productEventData: ProductEventData, triggerActor: TriggerActor): boolean => {
  return productEventData.actor.type === ActorType.Agent;
};
