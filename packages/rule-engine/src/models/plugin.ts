import { Event, ProductEventData } from "@jaya-app/marketplace-models";
import { Condition } from "./rule";
import { Integrations } from './rule-engine';

export type PluginActions = {
  [key: string]: (
    integrations: Integrations,
    payload: ProductEventData,
    actionValue: any
  ) => Promise<any>
};

export type PluginOperators = {
  [key: string]: (op1: string, op2: string) => boolean;
};

export type PluginTriggerActions = {
  [key: string]: (productEvent: Event, productEventData: ProductEventData) => boolean;
}

export type PluginConditions = {
  [key: string]: (condition: Condition, productEventData: ProductEventData) => boolean;
}

export interface RulePlugin {
  actions?: PluginActions;
  operators?: PluginOperators;
  triggerActions?: PluginTriggerActions;
  conditions?: PluginConditions;
}