import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import {
  RuleEngineOptions,
  Integrations,
  RuleEngineExternalEventPayload,
  KairosCredentials,
} from './models/rule-engine';

import { Rule } from './models/rule';
import { RulePlugin } from './models/plugin';
import { RuleProcessor } from './RuleProcessor';
import { ActionExecutor } from './ActionExecutor';
import { TimerRuleEngine } from './TimerRuleEngine';
import ruleConfig from './RuleConfig';
import recommendedPlugins from './recommended/index';

export * from './models/rule';
export * from './models/rule-engine';
export * from './models/plugin';

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

  processProductEvent = (
    payload: ProductEventPayload,
    rules: Rule[],
    options: RuleEngineOptions,
    externalEventUrl: string,
    integrations: Integrations,
    kairosCredentials?: KairosCredentials,
  ): void => {
    if (options.isSchedulerEnabled && kairosCredentials) {
      // Invalidate exising schedules
      TimerRuleEngine.invalidateTimers(payload, rules, kairosCredentials);

      // Process all timer rules.
      TimerRuleEngine.triggerTimers(payload, rules, externalEventUrl, kairosCredentials, integrations);
    }

    // Process regular rules and get the actions of the first matching rule.
    const firstMatchingRule: Rule | null = RuleProcessor.getFirstMatchingRule(
      payload.event,
      payload.data,
      rules,
      integrations,
    );

    // Perform all actions sequentially in order.
    if (firstMatchingRule && firstMatchingRule.actions && firstMatchingRule.actions.length) {
      ActionExecutor.handleActions(integrations, firstMatchingRule.actions, payload.data);
    }
  };

  processExternalEvent = (
    payload: RuleEngineExternalEventPayload,
    rules: Rule[],
    options: RuleEngineOptions,
    integrations: Integrations,
    kairosCredentials?: KairosCredentials,
  ): void => {
    if (options.isSchedulerEnabled && kairosCredentials) {
      TimerRuleEngine.executeTimerActions(payload, rules, kairosCredentials, integrations);
    }
  };
}
