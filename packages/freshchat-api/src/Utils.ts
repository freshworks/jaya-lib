import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import Helpers from 'handlebars-helpers';

import { Message, ActorType, MessageType } from './interfaces/Message';
import { Agent } from './interfaces/Agent';
import { User } from './interfaces/User';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const helperDate = require('helper-date');

Handlebars.registerHelper(Helpers(['comparison', 'string', 'array']));
Handlebars.registerHelper('date', helperDate);

export class Utils {
  public static extractAgentIds = (messages: Message[]): string[] => {
    const actorIds = messages
      .filter((message) => message.actor_type === ActorType.Agent && message.message_type === MessageType.Normal)
      .map((message) => message.actor_id);
    return Array.from(new Set(actorIds));
  };

  public static extractUserId = (messages: Message[]): string | undefined => {
    const userMessage = messages.find(
      (message) => message.actor_type === ActorType.User && message.message_type === MessageType.Normal,
    );

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
