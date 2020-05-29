import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import Helpers from 'handlebars-helpers';

import { Message, ActorType, MessageType, FilterMessagesOptions, MessageSource } from './interfaces/Message';
import { Agent } from './interfaces/Agent';
import { User } from './interfaces/User';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const helperDate = require('helper-date');

Handlebars.registerHelper(Helpers(['comparison', 'string', 'array']));
Handlebars.registerHelper('date', helperDate);

export class Utils {
  public static filterMessages = (messages: Message[], filterMessagesOptions?: FilterMessagesOptions): Message[] => {
    if (!filterMessagesOptions) {
      return messages;
    }

    return messages.filter((message) => {
      if (filterMessagesOptions.isExcludePrivate && message.message_type === MessageType.Private) {
        return false;
      }

      if (
        filterMessagesOptions.isExcludeSystem &&
        message.message_source === MessageSource.System &&
        message.meta_data
      ) {
        return false;
      }

      if (
        filterMessagesOptions.isExcludeNormal &&
        (message.message_source !== MessageSource.System || !message.meta_data) &&
        message.message_type !== MessageType.Private
      ) {
        return false;
      }

      return true;
    });
  };

  public static extractAgentIds = (messages: Message[]): string[] => {
    const actorIds = messages
      .filter((message) => message.actor_type === ActorType.Agent)
      .map((message) => message.actor_id);
    return Array.from(new Set(actorIds));
  };

  public static extractUserId = (messages: Message[]): string | undefined => {
    const userMessage = messages.find((message) => message.actor_type === ActorType.User);

    return userMessage && userMessage.actor_id;
  };

  public static generateConversationHtml = (messages: Message[], agents: Agent[], user: User): string => {
    const agentsMap: { [key: string]: Agent } = {};
    agents.forEach((agent) => {
      agentsMap[agent.id] = agent;
    });

    const data = fs.readFileSync(path.resolve(__dirname, 'conversation.hbs'), 'utf-8');
    const template = Handlebars.compile(data);
    const html = template({ agents: agentsMap, messages, user });

    // fs.writeFileSync(path.resolve(__dirname, '../lib/conversation.html'), html, 'utf-8');
    return html;
  };
}
