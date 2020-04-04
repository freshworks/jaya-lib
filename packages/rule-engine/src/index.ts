import {
  RuleEngineOptions,
  Integrations,
  RuleEngineExternalEventPayload,
  KairosCredentials,
} from './models/rule-engine';

import {
  ProductEventPayload,
} from '@jaya-app/marketplace-models';

import { Rule, Action } from './models/rule';
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
  };

  processProductEvent(
    payload: ProductEventPayload,
    rules: Rule[],
    options: RuleEngineOptions,
    integrations: Integrations,
    kairosCredentials?: KairosCredentials,
  ): void {
    if (options.isSchedulerEnabled && kairosCredentials) {
      // Invalidate exising schedules
      TimerRuleEngine.invalidateTimers(
        payload,
        rules,
        kairosCredentials
      );
  
      // Process all timer rules.
      TimerRuleEngine.triggerTimers(
        payload,
        kairosCredentials
      );
    }

    // Process regular rules and get the actions of the first matching rule.
    const matchingRuleActions: Action[] = RuleProcessor.processRules(
      payload.event,
      payload.data,
      rules
    );

    // Perform all actions sequentially in order.
    if (matchingRuleActions && matchingRuleActions.length) {
      ActionExecutor.handleActions(
        integrations,
        matchingRuleActions,
        payload.data
      );
    }
  }

  processExternalEvent(
    payload: RuleEngineExternalEventPayload,
    rules: Rule[],
    options: RuleEngineOptions,
    integrations: Integrations,
    kairosCredentials?: KairosCredentials,
  ): void {
    if (options.isSchedulerEnabled && kairosCredentials) {
      TimerRuleEngine.executeTimerActions(
        payload,
        rules,
        kairosCredentials,
        integrations
      );
    }
  }
}