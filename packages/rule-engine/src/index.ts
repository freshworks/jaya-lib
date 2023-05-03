import {  ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import {
  RuleEngineOptions,
  Integrations,
  RuleEngineExternalEventPayload,
  KairosCredentials,
} from './models/rule-engine';

import { Api, CustomPlaceholdersMap, JsonMap, Rule } from './models/rule';
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
        Utils.log(
          payload,
          integrations,
          ErrorCodes.INVALIDATE_TIMER_ERROR,
          {
            err: err as JsonMap,
          },
          LogSeverity.ALERT,
        );

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

        const resp = await ActionExecutor.handleActions(
          integrations,
          firstMatchingRule.actions,
          payload,
          apis,
          customPlaceholders,
          options,
          ruleAlias,
        );

        Utils.infolog(
          payload,
          integrations,
          ErrorCodes.INVALIDATE_TIMER_ERROR,
          {
            resp: resp as unknown as JsonMap,
          },
          LogSeverity.ALERT,
        );
      }
    } catch (err) {
      Utils.infolog(
        payload,
        integrations,
        ErrorCodes.INVALIDATE_TIMER_ERROR,
        {
          err: err as JsonMap,
        },
        LogSeverity.ALERT,
      );

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, ...rest } = payload;
        const resp = rest as ProductEventPayload;

        Utils.infolog(
          resp,
          integrations,
          ErrorCodes.PROCESS_EXTERNAL_EVENT_ERROR,
          {
            err: err as JsonMap,
          },
          LogSeverity.ALERT,
        );

        return Promise.reject(err);
      }
    }

    return Promise.resolve();
  };
}
