// Simple library to process the rules
import { Event, ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { AnyJson, Block, Condition, MatchType, Rule, Trigger, TriggerAction, TriggerActor } from './models/rule';
import { Integrations, RuleEngineOptions } from './models/rule-engine';
import { Promise } from 'bluebird';
import ruleConfig from './RuleConfig';
import { Utils } from './Utils';
import { APITraceCodes } from './models/error-codes';
import { LogSeverity } from './services/GoogleCloudLogging';

export class RuleProcessor {
  /**
   * Checks if the given condition is satisfied by the payload.
   */
  public static isConditionMatching(
    productEventData: ProductEventData,
    condition: Condition,
    integrations: Integrations,
    options: RuleEngineOptions,
    rule: Rule,
  ): Promise<void> {
    const conditionFunc = ruleConfig.conditions && ruleConfig.conditions[condition.key];

    if (conditionFunc) {
      const ruleAlias = rule.ruleAlias || '';
      return conditionFunc(condition, productEventData, integrations, options, ruleAlias);
    }
    throw new Error('Invalid condition key');
  }

  /**
   * Check if all the conditions in block are matching.
   */
  public static isBlockMatching(
    productEventData: ProductEventData,
    block: Block,
    integrations: Integrations,
    options: RuleEngineOptions,
    rule: Rule,
  ): Promise<void> {
    // Block is matching when there are no block conditions
    if (!block || !block.conditions || !block.conditions.length) {
      return Promise.resolve();
    }

    switch (block.matchType) {
      case MatchType.All:
        return Promise.all(
          block.conditions.map((condition) => {
            return this.isConditionMatching(productEventData, condition, integrations, options, rule);
          }),
        )
          .then(() => {
            return Promise.resolve();
          })
          .catch(() => {
            return Promise.reject('Some conditions did not match');
          });
      case MatchType.Any:
        return Promise.any(
          block.conditions.map((condition) => {
            return this.isConditionMatching(productEventData, condition, integrations, options, rule);
          }),
        );
      default:
        throw new Error('Invalid conditions matchType');
    }
  }

  /**
   * Checks if the given actor matches for the actor received from payload.
   */
  public static isTriggerActorMatch(actor: TriggerActor, productEventData: ProductEventData): boolean {
    const triggerActorFunc = ruleConfig.triggerActors && ruleConfig.triggerActors[actor.type];

    try {
      if (triggerActorFunc) {
        return triggerActorFunc(productEventData, actor);
      }
    } catch (error) {
      throw new Error('Invalid trigger actor : ' + JSON.stringify(actor));
    }

    throw new Error('Invalid trigger actor');
  }

  /**
   * Checks if the given action matches for the action received from payload.
   */
  public static isTriggerActionMatch(action: TriggerAction, event: Event, productEventData: ProductEventData): boolean {
    const triggerActionFunc = ruleConfig.triggerActions && ruleConfig.triggerActions[action.type];

    try {
      if (triggerActionFunc) {
        return triggerActionFunc(event, productEventData, action);
      }
    } catch (error) {
      throw new Error('Invalid trigger action : ' + action.type);
    }

    throw new Error('Invalid trigger action');
  }

  /**
   * Checks if actor and action match for each of the trigger conditions.
   */
  public static isTriggerConditionMatching(
    event: Event,
    productEventData: ProductEventData,
    triggers: Trigger[],
  ): boolean {
    let isMatch = false;

    for (let i = 0; triggers && i < triggers.length; i += 1) {
      const currentTrigger = triggers[i];

      if (
        this.isTriggerActorMatch(currentTrigger.actor, productEventData) &&
        this.isTriggerActionMatch(currentTrigger.action, event, productEventData)
      ) {
        isMatch = true;
        break;
      }
    }
    return isMatch;
  }

  /**
   * Check if all blocks in a rule are matching.
   */
  public static isRuleBlocksMatching(
    productEventData: ProductEventData,
    rule: Rule,
    integrations: Integrations,
    options: RuleEngineOptions,
  ): Promise<void> {
    // Rule is matching if there are no blocks
    if (!rule.blocks || !rule.blocks.length) {
      return Promise.resolve();
    }

    switch (rule.matchType) {
      case MatchType.All:
        return Promise.all(
          rule.blocks.map((block) => {
            return this.isBlockMatching(productEventData, block, integrations, options, rule);
          }),
        )
          .then(() => {
            return Promise.resolve();
          })
          .catch(() => {
            return Promise.reject('Some blocks did not match');
          });
      case MatchType.Any:
        return Promise.any(
          rule.blocks.map((block) => {
            return this.isBlockMatching(productEventData, block, integrations, options, rule);
          }),
        );
      default:
        throw new Error('Invalid blocks matchType');
    }
  }

  /**
   * Checks if trigger conditions are matching and then checks if property conditions are matching.
   */
  public static isRuleMatching(
    event: Event,
    productEventData: ProductEventData,
    rule: Rule,
    integrations: Integrations,
    options: RuleEngineOptions,
  ): Promise<void> {
    const isTriggerConditionMatch: boolean = this.isTriggerConditionMatching(event, productEventData, rule.triggers);
    // Rule does not match if trigger conditions don't match
    if (!isTriggerConditionMatch) {
      return Promise.reject('noTriggerConditionMatch');
    }

    return this.isRuleBlocksMatching(productEventData, rule, integrations, options);
  }

  /**
   * Checks if the rule is not a timer rule and is enabled.
   */
  public static isEnabledNonTimerRule(rule: Rule): boolean {
    return !rule.isTimer && rule.isEnabled;
  }

  /**
   * Iterates through each rule and return the actions of the first matching rule.
   */
  public static async getFirstMatchingRule(
    event: Event,
    productEventData: ProductEventData,
    rules: Rule[],
    integrations: Integrations,
    options: RuleEngineOptions,
  ): Promise<Rule> {
    let firstMatchingRule: Rule | null = null;

    for (let i = 0; rules && i < rules.length; i += 1) {
      const currentRule = rules[i];
      if (this.isEnabledNonTimerRule(currentRule)) {
        try {
          await this.isRuleMatching(event, productEventData, currentRule, integrations, options);
          firstMatchingRule = currentRule;
          break;
        } catch (err) {
          if (options.enableLogger) {
            Utils.log(
              productEventData as unknown as ProductEventPayload,
              integrations,
              APITraceCodes.FIRST_MATCHING_RULE,
              err as AnyJson,
              LogSeverity.NOTICE,
            );
          }
        }
      }
    }
    return firstMatchingRule ? Promise.resolve(firstMatchingRule) : Promise.reject('no matching rule');
  }
}
