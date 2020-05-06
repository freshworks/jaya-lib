import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from './rule';
import { Integrations } from './rule-engine';
import { TriggerAction, TriggerActor } from './rule';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';

export type PluginActions = {
  [key: string]: (integrations: Integrations, payload: ProductEventData, actionValue: unknown) => Promise<unknown>;
};

export type PluginOperators = {
  [key: string]: (op1: string, op2: string, integrations: Integrations) => Promise<void>;
};

export type PluginTriggerActions = {
  [key: string]: (productEvent: Event, productEventData: ProductEventData, triggerAction: TriggerAction) => boolean;
};

export type PluginTriggerActors = {
  [key: string]: (productEventData: ProductEventData, triggerActor: TriggerActor) => boolean;
};

export type PluginConditions = {
  [key: string]: (
    condition: Condition,
    productEventData: ProductEventData,
    integrations: Integrations,
  ) => Promise<void>;
};

export type PluginDynamicPlaceholders = {
  [key: string]: (productEventData: ProductEventData, integrations: Integrations) => Promise<string>;
};

export interface RulePlugin {
  actions?: PluginActions;
  conditions?: PluginConditions;
  dynamicPlaceholders?: PluginDynamicPlaceholders;
  operators?: PluginOperators;
  placeholders?: PlaceholdersMap;
  triggerActions?: PluginTriggerActions;
  triggerActors?: PluginTriggerActors;
}
