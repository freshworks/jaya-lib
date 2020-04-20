import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition, TriggerActor, TriggerAction } from './rule';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';

export type PluginActions = {
  [key: string]: (
    freshchatApiUrl: string,
    freshchatApiToken: string,
    payload: ProductEventData,
    actionValue: unknown,
  ) => Promise<unknown>;
};

export type PluginOperators = {
  [key: string]: (op1: string, op2: string) => boolean;
};

export type PluginTriggerActions = {
  [key: string]: (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction) => boolean;
};

export type PluginTriggerActors = {
  [key: string]: (productEventData: ProductEventData, triggerActor: TriggerActor) => boolean;
};

export type PluginConditions = {
  [key: string]: (condition: Condition, productEventData: ProductEventData) => boolean;
};

export interface RulePlugin {
  actions?: PluginActions;
  conditions?: PluginConditions;
  operators?: PluginOperators;
  placeholders?: PlaceholdersMap;
  triggerActions?: PluginTriggerActions;
  triggerActors?: PluginTriggerActors;
}
