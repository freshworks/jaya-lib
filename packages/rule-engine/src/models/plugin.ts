import { Event, ProductEventData } from "@freshworks-jaya/marketplace-models";
import { Condition } from "./rule";
import { Integrations } from './rule-engine';

export type PluginActions = {
  [key: string]: (
    integrations: Integrations,
    payload: ProductEventData,
    actionValue: unknown,
  ) => Promise<unknown>;
};

export type PluginOperators = {
  [key: string]: (op1: string, op2: string, integrations: Integrations) => boolean;
};

export type PluginTriggerActions = {
  [key: string]: (productEvent: Event, productEventData: ProductEventData) => boolean;
};

export type PluginConditions = {
  [key: string]: (condition: Condition, productEventData: ProductEventData, integrations: Integrations) => boolean;
}

export type PluginPlaceholders = {
  [key: string]: string;
};

export interface RulePlugin {
  actions?: PluginActions;
  conditions?: PluginConditions;
  operators?: PluginOperators;
  placeholders?: PluginPlaceholders;
  triggerActions?: PluginTriggerActions;
}
