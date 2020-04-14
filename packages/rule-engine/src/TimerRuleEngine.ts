import Kairos, { KairosSchedule, KairosScheduleOptions } from '@freshworks-jaya/kairos-api';
import { Event, ProductEventPayload, ProductEventData, ModelProperties } from '@freshworks-jaya/marketplace-models';
import { ActionExecutor } from './ActionExecutor';
import { Rule } from './models/rule';
import { RuleProcessor } from './RuleProcessor';
import { KairosCredentials, RuleEngineExternalEventPayload, FreshchatCredentials } from './models/rule-engine';
import { Utils } from './Utils';

export class TimerRuleEngine {
  /**
   * Add minutes to date object.
   */
  public static addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
  }

  /**
   * Checks if the rule is a timer rule and is enabled.
   */
  public static isMatchingTimerRule(event: Event, productEventData: ProductEventData, rule: Rule): boolean {
    return rule.isTimer && rule.isEnabled && RuleProcessor.isRuleMatching(event, productEventData, rule);
  }

  /**
   * Gets the model for either conversation or message.
   */
  public static getModelProperties(productEventData: ProductEventData): ModelProperties {
    return productEventData.conversation || productEventData.message;
  }

  /**
   * Trigger creation of timers for incoming event.
   */
  public static async triggerTimers(
    payload: ProductEventPayload,
    rules: Rule[],
    externalEventUrl: string,
    kairosCredentials: KairosCredentials,
  ): Promise<void> {
    let schedulesToCreate: KairosScheduleOptions[] = [];
    const scheduler = new Kairos(kairosCredentials);

    // Iterate through each rule
    for (let ruleIndex = 0, len = rules.length; ruleIndex < len; ruleIndex += 1) {
      const rule = rules[ruleIndex];

      const modelProperties = this.getModelProperties(payload.data);

      // Check for timer rules that are enabled and are matching the trigger conditions.
      if (this.isMatchingTimerRule(payload.event, payload.data, rule)) {
        const jobId = `${modelProperties.app_id}_${modelProperties.conversation_id}_${ruleIndex}`;

        // Fetch an existing schedule for the same current rule,
        let existingSchedule;
        try {
          existingSchedule = (await scheduler.fetchSchedule(jobId)) as KairosSchedule;
        } catch (err) {}

        // If there are no existing schedules, create schedule object
        // and push it into the schedules array for bulk scheduling later.
        if (!existingSchedule) {
          schedulesToCreate = [
            ...schedulesToCreate,
            {
              jobId,
              payload: {
                jobId,
                originalPayload: payload,
                ruleIndex,
              },
              scheduledTime: this.addSeconds(new Date(), rule.timerValue).toISOString(),
              webhookUrl: externalEventUrl,
            },
          ];
        }
      }
    }

    if (schedulesToCreate.length) {
      try {
        await scheduler.bulkCreateSchedules(schedulesToCreate);
      } catch (err) {
        throw new Error('Error creating bulk schedules');
      }
    }

    return Promise.resolve();
  }

  /**
   * Execute actions on completion of timer.
   */
  public static async executeTimerActions(
    externalEventPayload: RuleEngineExternalEventPayload,
    rules: Rule[],
    kairosCredentials: KairosCredentials,
    freshchatCredentials: FreshchatCredentials,
  ): Promise<void> {
    const scheduler = new Kairos(kairosCredentials);

    // Delete schedule for given jobId
    try {
      await scheduler.deleteSchedule(externalEventPayload.data.jobId);
    } catch (err) {
      throw new Error('Error deleting kairos schedule before execution');
    }

    // Get actions from rules
    const timerRule = rules[externalEventPayload.data.ruleIndex];

    // Execute actions
    if (timerRule && Array.isArray(timerRule.actions)) {
      ActionExecutor.handleActions(
        freshchatCredentials,
        timerRule.actions,
        externalEventPayload.data.originalPayload.data,
      );
    }
  }

  /**
   * Invalidate rules with timers that match the trigger conditions.
   */
  public static async invalidateTimers(
    payload: ProductEventPayload,
    rules: Rule[],
    kairosCredentials: KairosCredentials,
    invalidationDelayMillis: number,
  ): Promise<void> {
    const modelProperties = payload.data.conversation || payload.data.message;

    const jobsToDelete = rules.reduce((jobIds: string[], rule, ruleIndex) => {
      let isMatch = false;

      if (rule.isEnabled && rule.isTimer && rule.invalidators) {
        isMatch = RuleProcessor.isTriggerConditionMatching(payload.event, payload.data, rule.invalidators);
      }

      if (isMatch) {
        jobIds.push(`${modelProperties.app_id}_${modelProperties.conversation_id}_${ruleIndex}`);
      }
      return jobIds;
    }, []);

    if (jobsToDelete && jobsToDelete.length) {
      try {
        await Utils.sleep(invalidationDelayMillis);
        const scheduler = new Kairos(kairosCredentials);
        await scheduler.bulkDeleteSchedules(jobsToDelete);
      } catch (err) {
        throw new Error('Bulk delete of schedules failed');
      }
    }

    return Promise.resolve();
  }
}
