import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import {
  RuleEngineOptions,
  Integrations,
  RuleEngineExternalEventPayload,
  KairosCredentials,
} from './models/rule-engine';

import { Api, CustomPlaceholdersMap, Rule } from './models/rule';
import { RuleMatchCache, RulePlugin } from './models/plugin';
import { RuleProcessor } from './RuleProcessor';
import { ActionExecutor } from './ActionExecutor';
import { TimerRuleEngine } from './TimerRuleEngine';
import ruleConfig from './RuleConfig';
import recommendedPlugins from './recommended/index';

export * from './models/rule';
export * from './models/rule-engine';
export * from './models/plugin';
export * from './TimerRuleEngine';
export * from './services/GoogleCloudLogging';
export * from './services/GoogleServiceAccount';

export class RuleEngine {
  constructor(private plugins?: RulePlugin[]) {
    if (plugins) {
      ruleConfig.registerPlugins([...recommendedPlugins, ...plugins]);
    } else {
      ruleConfig.registerPlugins(recommendedPlugins);
    }
  }

  registerPlugins = ruleConfig.registerPlugins;

  getFirstMatchingRule = RuleProcessor.getFirstMatchingRule;

  executeActions = ActionExecutor.handleActions;

  processProductEvent = async (
    payload: ProductEventPayload,
    rules: Rule[],
    apis: Api[],
    customPlaceholders: CustomPlaceholdersMap,
    options: RuleEngineOptions,
    externalEventUrl: string,
    integrations: Integrations,
    kairosCredentials?: KairosCredentials,
  ): Promise<void> => {
    let ruleMatchCache: Partial<RuleMatchCache> = {};

    if (options.isSchedulerEnabled && kairosCredentials) {
      try {
        // Invalidate exising schedules
        await TimerRuleEngine.invalidateTimers(payload, rules, externalEventUrl, kairosCredentials, integrations);

        // Process all timer rules.
        ruleMatchCache = await TimerRuleEngine.triggerTimers(
          payload,
          rules,
          externalEventUrl,
          kairosCredentials,
          integrations,
          options,
          {},
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }

    try {
      // Process regular rules and get the actions of the first matching rule.
      const firstMatchingRule = await RuleProcessor.getFirstMatchingRule(
        payload.event,
        payload.data,
        rules,
        integrations,
        options,
        ruleMatchCache,
      );
      // Perform all actions sequentially in order.
      if (firstMatchingRule.actions && firstMatchingRule.actions.length) {
        await ActionExecutor.handleActions(
          integrations,
          firstMatchingRule.actions,
          payload,
          apis,
          customPlaceholders,
          options,
        );
      }
    } catch (err) {
      return Promise.reject(err);
    }

    return Promise.resolve();
  };

  processExternalEvent = async (
    payload: RuleEngineExternalEventPayload,
    rules: Rule[],
    apis: Api[],
    customPlaceholders: CustomPlaceholdersMap,
    options: RuleEngineOptions,
    integrations: Integrations,
    kairosCredentials?: KairosCredentials,
  ): Promise<void> => {
    if (options.isSchedulerEnabled && kairosCredentials) {
      try {
        await TimerRuleEngine.executeTimerActions(
          payload,
          rules,
          kairosCredentials,
          integrations,
          apis,
          customPlaceholders,
          options,
        );
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.resolve();
  };
}
