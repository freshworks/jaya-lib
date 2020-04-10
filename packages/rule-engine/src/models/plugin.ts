import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Condition } from './rule';
import { Integrations } from './rule-engine';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';

export type PluginActions = {
  [key: string]: (integrations: Integrations, payload: ProductEventData, actionValue: unknown) => Promise<unknown>;
};

export type PluginOperators = {
  [key: string]: (op1: string, op2: string, integrations: Integrations) => Promise<boolean>;
};

export type PluginTriggerActions = {
  [key: string]: (productEvent: Event, productEventData: ProductEventData) => boolean;
};

export type PluginConditions = {
  [key: string]: (
    condition: Condition,
    productEventData: ProductEventData,
    integrations: Integrations,
  ) => Promise<boolean>;
};

export interface RulePlugin {
  actions?: PluginActions;
  conditions?: PluginConditions;
  operators?: PluginOperators;
  placeholders?: PlaceholdersMap;
  triggerActions?: PluginTriggerActions;
}
