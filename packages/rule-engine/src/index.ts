import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import {
  RuleEngineOptions,
  Integrations,
  RuleEngineExternalEventPayload,
  KairosCredentials,
} from './models/rule-engine';

import { AnyJson, Api, CustomPlaceholdersMap, Rule } from './models/rule';
import { RulePlugin } from './models/plugin';
import { RuleProcessor } from './RuleProcessor';
import { ActionExecutor } from './ActionExecutor';
import { TimerRuleEngine } from './TimerRuleEngine';
import ruleConfig from './RuleConfig';
import recommendedPlugins from './recommended/index';
import { Utils } from './Utils';
import { ErrorCodes } from './models/error-codes';
import { LogSeverity } from './services/GoogleCloudLogging';

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
    if (options.isSchedulerEnabled && kairosCredentials) {
      try {
        // Invalidate exising schedules
        await TimerRuleEngine.invalidateTimers(payload, rules, externalEventUrl, kairosCredentials, integrations);

        // Process all timer rules.
        await TimerRuleEngine.triggerTimers(payload, rules, externalEventUrl, kairosCredentials, integrations, options);
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
      );
      // Perform all actions sequentially in order.
      if (firstMatchingRule.actions && firstMatchingRule.actions.length) {
        const ruleAlias = firstMatchingRule.ruleAlias || '';

        await ActionExecutor.handleActions(
          integrations,
          firstMatchingRule.actions,
          payload,
          apis,
          customPlaceholders,
          options,
          ruleAlias,
        );
      }
    } catch (err) {
      if (err !== 'no matching rule' || (options.enableLogger && err === 'no matching rule')) {
        Utils.log(
          payload,
          integrations,
          ErrorCodes.FreshchatAction,
          {
            error: err as AnyJson,
          },
          LogSeverity.ALERT,
        );
      }
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
