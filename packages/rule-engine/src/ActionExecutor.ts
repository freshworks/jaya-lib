// Simple library to handle the actions to be performed
import {
  ProductEventData,
  User,
  ActorType,
  Agent,
  Group,
  ProductEventPayload,
} from '@freshworks-jaya/marketplace-models';
import { Action } from './models/rule';
import { Integrations } from './models/rule-engine';
import ruleConfig from './RuleConfig';
import { isUsernameGenerated, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Utils } from './Utils';

export class ActionExecutor {
  /**
   * Calls the appropriate method to perform the action.
   */
  public static handleAction(
    integrations: Integrations,
    action: Action,
    productEventPayload: ProductEventPayload,
    placeholders: PlaceholdersMap,
  ): Promise<PlaceholdersMap> {
    const actionFunc = ruleConfig.actions && ruleConfig.actions[action.type];

    if (actionFunc) {
      return actionFunc(integrations, productEventPayload.data, action.value, productEventPayload.domain, placeholders);
    }
    return Promise.reject('Invalid action type');
  }

  /**
   *
   * Sets up placeholders for productEventData
   */
  public static getPlaceholders(productEventData: ProductEventData): PlaceholdersMap {
    const user = productEventData.associations.user || ({} as User);
    const agent =
      productEventData.associations.agent ||
      (productEventData.actor.type === ActorType.Agent ? productEventData.actor : ({} as Agent));
    const { channel } = productEventData.associations;
    const group = productEventData.associations.group || ({} as Group);
    const conversation = productEventData.conversation || productEventData.message;
    const messageText =
      conversation.messages && Utils.getMessagePartsTextContent(conversation.messages[0].message_parts);

    // Register static placeholders
    const placeholders = {
      'agent.email': agent.email,
      'agent.first_name': agent.first_name,
      'agent.id': agent.id,
      'agent.last_name': agent.last_name,
      'channel.id': channel.id,
      'channel.name': channel.name,
      'conversation.app_id': conversation.app_id,
      'conversation.assigned_agent_id': conversation.assigned_group_id,
      'conversation.assigned_group_id': conversation.assigned_group_id,
      'conversation.id': conversation.conversation_id,
      'conversation.status': conversation.status,
      'group.description': group.description,
      'group.id': group.id,
      'group.name': group.name,
      'message.text': messageText,
      'user.email': user.email,
      'user.first_name': user.first_name,
      'user.id': user.id,
      'user.last_name': user.last_name,
      'user.phone': user.phone,
    } as PlaceholdersMap;

    if (isUsernameGenerated(user.first_name || '')) {
      placeholders['user.first_name'] = '';
    }

    // Register dynamic placeholders
    const dynamicPlaceholders: PlaceholdersMap = {};
    user.properties &&
      user.properties.forEach((userProperty) => {
        const placeholderKey = `user.properties.${userProperty.name}`;
        dynamicPlaceholders[placeholderKey] = userProperty.value;
      });

    return { ...placeholders, ...dynamicPlaceholders };
  }

  /**
   * Iterates through all the actions and performs each one as configured.
   */
  public static async handleActions(
    integrations: Integrations,
    actions: Action[],
    productEventPayload: ProductEventPayload,
  ): Promise<void> {
    let placeholders = this.getPlaceholders(productEventPayload.data);

    for (let i = 0; actions && i < actions.length; i += 1) {
      try {
        const action = actions[i];
        const placeholdersFromAction = await this.handleAction(integrations, action, productEventPayload, placeholders);

        placeholders = { ...placeholders, ...placeholdersFromAction };
      } catch (err) {
        // Error while executing an action
        // Queietly suppressing it so that next action can be executed
        // So, doing nothing here
      }
    }

    return Promise.resolve();
  }
}
