// Simple library to handle the actions to be performed
import { Action } from './models/rule';
import {
  ProductEventData,
} from '@jaya-app/marketplace-models';
import { FreshchatCredentials } from './models/rule-engine';
import ruleConfig from './RuleConfig';

export class ActionExecutor {
  /**
   * Calls the appropriate method to perform the action.
   */
  public static handleAction(
    apiUrl: string,
    apiToken: string,
    action: Action,
    productEventData: ProductEventData
  ): Promise<object> {
    const actionFunc = ruleConfig.actions && ruleConfig.actions[action.type];

    if (actionFunc) {
      return actionFunc(apiUrl, apiToken, productEventData, action.value);
    }

    throw new Error('Invalid action type');
  }

  /**
   * Iterates through all the actions and performs each one as configured.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static async handleActions(
    freshchatCredentials: FreshchatCredentials,
    actions: Action[],
    productEventData: ProductEventData
  ) {
    for (let i = 0; actions && i < actions.length; i += 1) {
      try {
        const action = actions[i];
        await this.handleAction(
          freshchatCredentials.url,
          freshchatCredentials.token,
          action,
          productEventData
        );
      } catch (err) {
        throw new Error('Error processing action');
      }
    }
  }
}
