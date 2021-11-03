/* eslint-disable complexity */
// Simple library to process the rules
import { Event } from '@freshworks-jaya/marketplace-models';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Block, Condition, MatchType, Rule, Trigger, TriggerAction, TriggerActor } from './models/rule';
import { Integrations, RuleEngineOptions } from './models/rule-engine';
import { Promise } from 'bluebird';
import ruleConfig from './RuleConfig';
import { RuleMatchCache, RuleMatchResponse } from './models/plugin';

export class RuleProcessor {
  /**
   * Checks if the given condition is satisfied by the payload.
   */
  public static isConditionMatching(
    productEventData: ProductEventData,
    condition: Condition,
    integrations: Integrations,
    options: RuleEngineOptions,
    ruleMatchCache: Partial<RuleMatchCache>,
  ): Promise<RuleMatchResponse> {
    const conditionFunc = ruleConfig.conditions && ruleConfig.conditions[condition.key];

    if (conditionFunc) {
      return conditionFunc(condition, productEventData, integrations, options, ruleMatchCache);
    }
    throw new Error('Invalid condition key');
  }

  /**
   * Check if all the conditions in block are matching.
   */
  public static async isBlockMatching(
    productEventData: ProductEventData,
    block: Block,
    integrations: Integrations,
    options: RuleEngineOptions,
    ruleMatchCache: Partial<RuleMatchCache>,
  ): Promise<RuleMatchResponse> {
    // Block is matching when there are no block conditions
    if (!block || !block.conditions || !block.conditions.length) {
      return Promise.resolve({
        data: ruleMatchCache,
        result: true,
      });
    }

    let conditionMatchCache = { ...ruleMatchCache };
    let result: boolean;

    switch (block.matchType) {
      case MatchType.All:
        result = true;

        for (let i = 0; i < block.conditions.length; i++) {
          const condition = block.conditions[i];

          try {
            const conditionMatchResponse = await this.isConditionMatching(
              productEventData,
              condition,
              integrations,
              options,
              conditionMatchCache,
            );

            conditionMatchCache = {
              ...conditionMatchCache,
              ...conditionMatchResponse.data,
            };

            // Even if one condition does not match, result is false
            if (!conditionMatchResponse.result) {
              result = false;
              break;
            }
          } catch (err) {
            result = false;
            break;
          }
        }

        // result is true when all the conditions match
        return Promise.resolve({
          data: conditionMatchCache,
          result,
        });
      case MatchType.Any:
        result = false;

        for (let i = 0; i < block.conditions.length; i++) {
          const condition = block.conditions[i];

          try {
            const conditionMatchResponse = await this.isConditionMatching(
              productEventData,
              condition,
              integrations,
              options,
              conditionMatchCache,
            );

            conditionMatchCache = {
              ...conditionMatchCache,
              ...conditionMatchResponse.data,
            };

            // result is true when just one condition matches
            if (conditionMatchResponse.result) {
              result = true;
              break;
            }
          } catch (err) {
            result = false;
            break;
          }
        }

        // result is false when none of the conditions match
        return Promise.resolve({
          data: conditionMatchCache,
          result,
        });
      default:
        throw new Error('Invalid conditions matchType');
    }
  }

  /**
   * Checks if the given actor matches for the actor received from payload.
   */
  public static isTriggerActorMatch(actor: TriggerActor, productEventData: ProductEventData): boolean {
    const triggerActorFunc = ruleConfig.triggerActors && ruleConfig.triggerActors[actor.type];

    if (triggerActorFunc) {
      return triggerActorFunc(productEventData, actor);
    }
    throw new Error('Invalid trigger actor');
  }

  /**
   * Checks if the given action matches for the action received from payload.
   */
  public static isTriggerActionMatch(action: TriggerAction, event: Event, productEventData: ProductEventData): boolean {
    const triggerActionFunc = ruleConfig.triggerActions && ruleConfig.triggerActions[action.type];

    if (triggerActionFunc) {
      return triggerActionFunc(event, productEventData, action);
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
  public static async isRuleBlocksMatching(
    productEventData: ProductEventData,
    rule: Rule,
    integrations: Integrations,
    options: RuleEngineOptions,
    ruleMatchCache: Partial<RuleMatchCache>,
  ): Promise<RuleMatchResponse> {
    // Rule is matching if there are no blocks
    if (!rule.blocks || !rule.blocks.length) {
      return Promise.resolve({
        data: ruleMatchCache,
        result: true,
      });
    }

    let blockMatchCache = { ...ruleMatchCache };
    let result: boolean;

    switch (rule.matchType) {
      case MatchType.All:
        result = true;

        for (let i = 0; i < rule.blocks.length; i++) {
          const block = rule.blocks[i];

          try {
            const blockMatchResponse = await this.isBlockMatching(
              productEventData,
              block,
              integrations,
              options,
              blockMatchCache,
            );

            blockMatchCache = {
              ...blockMatchCache,
              ...blockMatchResponse.data,
            };

            // Even if one condition does not match, result is false
            if (!blockMatchResponse.result) {
              result = false;
              break;
            }
          } catch (err) {
            result = false;
          }
        }

        // result is true when all the conditions match
        return Promise.resolve({
          data: blockMatchCache,
          result,
        });
      case MatchType.Any:
        result = false;

        for (let i = 0; i < rule.blocks.length; i++) {
          const block = rule.blocks[i];

          try {
            const blockMatchResponse = await this.isBlockMatching(
              productEventData,
              block,
              integrations,
              options,
              blockMatchCache,
            );

            blockMatchCache = {
              ...blockMatchCache,
              ...blockMatchResponse.data,
            };

            // Result is true when just one condition matches
            if (blockMatchResponse.result) {
              result = true;
              break;
            }
          } catch (err) {
            result = false;
          }
        }

        // result is false when none of the conditions match
        return Promise.resolve({
          data: blockMatchCache,
          result,
        });
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
    ruleMatchCache: Partial<RuleMatchCache>,
  ): Promise<RuleMatchResponse> {
    const isTriggerConditionMatch: boolean = this.isTriggerConditionMatching(event, productEventData, rule.triggers);
    // Rule does not match if trigger conditions don't match
    if (!isTriggerConditionMatch) {
      return Promise.resolve({
        data: ruleMatchCache,
        result: false,
      });
    }

    return this.isRuleBlocksMatching(productEventData, rule, integrations, options, ruleMatchCache);
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
    ruleMatchCache: Partial<RuleMatchCache>,
  ): Promise<Rule> {
    let firstMatchingRule: Rule | null = null;
    let cache = { ...ruleMatchCache };

    for (let i = 0; rules && i < rules.length; i += 1) {
      const currentRule = rules[i];
      if (this.isEnabledNonTimerRule(currentRule)) {
        try {
          const ruleMatchResponse = await this.isRuleMatching(
            event,
            productEventData,
            currentRule,
            integrations,
            options,
            cache,
          );

          cache = {
            ...cache,
            ...ruleMatchResponse.data,
          };

          if (ruleMatchResponse.result) {
            firstMatchingRule = currentRule;
            break;
          }
        } catch (err) {}
      }
    }
    return firstMatchingRule ? Promise.resolve(firstMatchingRule) : Promise.reject('no matching rule');
  }
}
