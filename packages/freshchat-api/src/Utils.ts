import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import Helpers from 'handlebars-helpers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import {
  Message,
  ActorType,
  MessageType,
  FilterMessagesOptions,
  GetConversationMessagesOptions,
} from './interfaces/Message';
import { Agent } from './interfaces/Agent';
import { User } from './interfaces/User';

Handlebars.registerHelper('date', function (context, block) {
  return dayjs(context).utcOffset(block.hash.offset).format(block.hash.format);
});

Handlebars.registerHelper(Helpers(['comparison', 'string', 'array']));

export class Utils {
  public static filterMessages = (messages: Message[], filterMessagesOptions?: FilterMessagesOptions): Message[] => {
    if (!filterMessagesOptions) {
      return messages;
    }

    return messages.filter((message) => {
      if (filterMessagesOptions.isExcludePrivate && message.message_type === MessageType.Private) {
        return false;
      }

      if (filterMessagesOptions.isExcludeSystem && (message.meta_data || message.message_type === 'system')) {
        return false;
      }

      if (filterMessagesOptions.isExcludeNormal && !message.meta_data && message.message_type !== MessageType.Private) {
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

  public static generateConversationTranscript = (
    baseUrl: string,
    accountId: string,
    conversationId: string,
    messages: Message[],
    agents: Agent[],
    user: User,
    options?: GetConversationMessagesOptions,
  ): string => {
    const agentsMap: { [key: string]: Agent } = {};
    agents.forEach((agent) => {
      agentsMap[agent.id] = agent;
    });

    let hbsData = '';
    if (options && options.output === 'text') {
      hbsData = fs.readFileSync(path.resolve(__dirname, 'conversation-text.hbs'), 'utf-8');
    } else {
      hbsData = fs.readFileSync(path.resolve(__dirname, 'conversation-html.hbs'), 'utf-8');
    }

    const timezoneOffset = options && options.timezoneOffset ? options.timezoneOffset : 0;

    const conversationUrl = `${baseUrl}/a/${accountId}/open/conversation/${conversationId}`;

    const template = Handlebars.compile(hbsData);
    const transcript = template({
      agents: agentsMap,
      conversationUrl,
      isIncludeFreshchatLink: options && options.isIncludeFreshchatLink,
      messages,
      timezone: dayjs().utcOffset(timezoneOffset).format('Z'),
      timezoneOffset,
      user,
    });

    fs.writeFileSync(path.resolve(__dirname, '../lib/conversation.html'), transcript, 'utf-8');
    return transcript;
  };
}
