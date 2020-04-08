// Simple library to process the rules
import { Event } from '@freshworks-jaya/marketplace-models';
import { ActorType, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Block, Condition, MatchType, Rule, Trigger, TriggerAction, TriggerActor } from './models/rule';

import ruleConfig from './RuleConfig';

export class RuleProcessor {
  /**
   * Checks if the given condition is satisfied by the payload.
   */
  public static isConditionMatching(productEventData: ProductEventData, condition: Condition): boolean {
    const conditionFunc = ruleConfig.conditions && ruleConfig.conditions[condition.key];

    if (conditionFunc) {
      return conditionFunc(condition, productEventData);
    }
    throw new Error('Invalid condition key');
  }

  /**
   * Checks if all the conditions in the block are matching.
   */
  public static blockMatchAll(productEventData: ProductEventData, conditions: Condition[]): boolean {
    for (let i = 0; conditions && i < conditions.length; i += 1) {
      const condition = conditions[i];
      const conditionMatchResult: boolean = this.isConditionMatching(productEventData, condition);

      if (!conditionMatchResult) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if any of the conditions in a block are matching.
   */
  public static blockMatchAny(productEventData: ProductEventData, conditions: Condition[]): boolean {
    for (let i = 0; conditions && i < conditions.length; i += 1) {
      const condition = conditions[i];
      const conditionMatchResult: boolean = this.isConditionMatching(productEventData, condition);

      if (conditionMatchResult) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if all the conditions in block are matching.
   */
  public static isBlockMatching(productEventData: ProductEventData, block: Block): boolean {
    // Block is matching when there are no block conditions
    if (!block || !block.conditions || !block.conditions.length) {
      return true;
    }

    switch (block.matchType) {
      case MatchType.All:
        return this.blockMatchAll(productEventData, block.conditions);
      case MatchType.Any:
        return this.blockMatchAny(productEventData, block.conditions);
      default:
        throw new Error('Invalid conditions matchType');
    }
  }

  /**
   * Checks if the given actor matches for the actor received from payload.
   */
  public static isTriggerActorMatch(actor: TriggerActor, productEventData: ProductEventData): boolean {
    return (
      (actor === TriggerActor.Agent && productEventData.actor.type === ActorType.Agent) ||
      (actor === TriggerActor.User && productEventData.actor.type === ActorType.User) ||
      (actor === TriggerActor.System && productEventData.actor.type === ActorType.System)
    );
  }

  /**
   * Checks if the given action matches for the action received from payload.
   */
  public static isTriggerActionMatch(action: TriggerAction, event: Event, productEventData: ProductEventData): boolean {
    const triggerActionFunc = ruleConfig.triggerActions && ruleConfig.triggerActions[action];

    if (triggerActionFunc) {
      return triggerActionFunc(event, productEventData);
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
   * Returns true if all blocks in a rule are matching; false otherwise.
   */
  public static ruleMatchAll(productEventData: ProductEventData, blocks: Block[]): boolean {
    for (let i = 0; blocks && i < blocks.length; i += 1) {
      const block = blocks[i];
      const blockMatchResult: boolean = this.isBlockMatching(productEventData, block);

      if (!blockMatchResult) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns true if any block in a rule is matching; false if none are matching.
   */
  public static ruleMatchAny(productEventData: ProductEventData, blocks: Block[]): boolean {
    for (let i = 0; blocks && i < blocks.length; i += 1) {
      const block = blocks[i];
      const blockMatchResult: boolean = this.isBlockMatching(productEventData, block);

      if (blockMatchResult) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if all blocks in a rule are matching.
   */
  public static isRuleBlocksMatching(productEventData: ProductEventData, rule: Rule): boolean {
    // Rule is matching if there are no blocks
    if (!rule.blocks || !rule.blocks.length) {
      return true;
    }

    switch (rule.matchType) {
      case MatchType.All:
        return this.ruleMatchAll(productEventData, rule.blocks);
      case MatchType.Any:
        return this.ruleMatchAny(productEventData, rule.blocks);
      default:
        throw new Error('Invalid blocks matchType');
    }
  }

  /**
   * Checks if trigger conditions are matching and then checks if property conditions are matching.
   */
  public static isRuleMatching(event: Event, productEventData: ProductEventData, rule: Rule): boolean {
    const isTriggerConditionMatch: boolean = this.isTriggerConditionMatching(event, productEventData, rule.triggers);

    // Rule does not match if trigger conditions don't match
    if (!isTriggerConditionMatch) {
      return false;
    }

    return this.isRuleBlocksMatching(productEventData, rule);
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
  public static getFirstMatchingRule(event: Event, productEventData: ProductEventData, rules: Rule[]): Rule | null {
    let firstMatchingRule: Rule | null = null;

    for (let i = 0; rules && i < rules.length; i += 1) {
      const currentRule = rules[i];

      if (this.isEnabledNonTimerRule(currentRule) && this.isRuleMatching(event, productEventData, currentRule)) {
        firstMatchingRule = currentRule;
        break;
      }
    }

    return firstMatchingRule;
  }
}
