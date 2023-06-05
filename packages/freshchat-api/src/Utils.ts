import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import Helpers from 'handlebars-helpers';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import { htmlToText } from 'html-to-text';

dayjs.extend(utc);
dayjs.extend(advancedFormat);

import {
  Message,
  ActorType,
  MessageType,
  FilterMessagesOptions,
  GetConversationMessagesOptions,
} from './interfaces/Message';
import { Agent } from './interfaces/Agent';
import { User } from './interfaces/User';

Handlebars.registerHelper(
  'date',
  function (context: string, block: { hash: { format: string | undefined; offset: number } }) {
    return dayjs(context).utcOffset(block.hash.offset).format(block.hash.format);
  },
);

Handlebars.registerHelper('htmlToText', function (context: string) {
  return htmlToText(context, {
    preserveNewlines: true,
  });
});

Handlebars.registerHelper('nl2br', function (text: string) {
  if (typeof text !== 'string') {
    return '';
  }

  return text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
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

  public static extractSystemUserIds = (messages: Message[]): string[] => {
    const actorIds = messages
      .filter((message) => message.actor_id && message.actor_type === undefined)
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
    systemUsers: Agent[],
    user: User,
    options?: GetConversationMessagesOptions,
  ): string => {
    const agentsMap: { [key: string]: Agent } = {};
    agents.forEach((agent) => {
      agentsMap[agent.id] = agent;
    });

    // Mapping system user as agents
    systemUsers.forEach((user) => {
      agentsMap[user.id] = user;
    });

    let hbsData = '';
    if (options && options.output === 'text') {
      hbsData = fs.readFileSync(path.resolve(__dirname, 'conversation-text.hbs'), 'utf-8');
    } else if (options && options.output === 'paytm_html') {
      hbsData = fs.readFileSync(path.resolve(__dirname, 'conversation-html-paytm.hbs'), 'utf-8');
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

    // fs.writeFileSync(path.resolve(__dirname, '../lib/conversation.html'), transcript, 'utf-8');
    return transcript;
  };
}
