import { Event, ProductEventData, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { Api, Condition } from './rule';
import { Integrations, RuleEngineOptions } from './rule-engine';
import { TriggerAction, TriggerActor } from './rule';
import { BusinessHour, PlaceholdersMap } from '@freshworks-jaya/utilities';

export interface RuleMatchCache {
  businessHours: BusinessHour[];
  unassignedCount: number;
}

export interface RuleMatchResponse {
  data: Partial<RuleMatchCache>;
  result: boolean;
}

export type PluginActions = {
  [key: string]: (
    integrations: Integrations,
    payload: ProductEventPayload,
    actionValue: unknown,
    placeholders: PlaceholdersMap,
    apis: Api[],
    options: RuleEngineOptions,
  ) => Promise<PlaceholdersMap>;
};

export type PluginOperators = {
  [key: string]: (
    op1: string,
    op2: string,
    integrations: Integrations,
    options: RuleEngineOptions,
    ruleMatchCache: Partial<RuleMatchCache>,
  ) => Promise<RuleMatchResponse>;
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
    options: RuleEngineOptions,
    ruleMatchCache: Partial<RuleMatchCache>,
  ) => Promise<RuleMatchResponse>;
};

export type PluginDynamicPlaceholders = {
  [key: string]: (
    productEventPayload: ProductEventPayload,
    integrations: Integrations,
    options: RuleEngineOptions,
  ) => Promise<string>;
};

export interface RulePlugin {
  actions?: PluginActions;
  conditions?: PluginConditions;
  dynamicPlaceholders?: PluginDynamicPlaceholders;
  operators?: PluginOperators;
  triggerActions?: PluginTriggerActions;
  triggerActors?: PluginTriggerActors;
}
