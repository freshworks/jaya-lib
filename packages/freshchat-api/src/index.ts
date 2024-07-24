import axios, { AxiosPromise } from 'axios';
import {
  Message,
  GetMessagesResponse,
  GetConversationMessagesOptions,
  FilterMessagesOptions,
} from './interfaces/Message';
import { Conversation, ConversationStatus } from './interfaces/Conversation';
import { DashboardHistorical } from './interfaces/DashboardHistorical';
import { ReplyPart } from './interfaces/ReplyPart';
import { User } from './interfaces/User';
import { Agent } from './interfaces/Agent';
import { Utils } from './Utils';
import { isUsernameGenerated } from '@freshworks-jaya/utilities';
import { ReportType } from './interfaces/Report';
import { MessagePart } from './interfaces/MessagePart';
import { Headers } from './interfaces/Headers';

export * from './interfaces/Conversation';
export * from './interfaces/Message';
export * from './interfaces/DashboardHistorical';
export * from './interfaces/User';
export * from './interfaces/Report';

export default class Freshchat {
  private get headers(): Headers {
    const activeHeaders: Headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'x-service': 'advanced_automation',
    };

    if (this.ruleAlias) {
      activeHeaders['x-automation-rule-alias'] = this.ruleAlias;
    }
    return activeHeaders;
  }

  constructor(private apiUrl: string, private apiToken: string, private ruleAlias?: string) {}

  /**
   * Calls Freshchat Dashboard Historical API to fetch average wait time.
   */
  getAverageWaitTimeGivenGroupId(groupId: string, durationInHours: number): Promise<number> {
    const dashboardMetricsApiUrl = `${this.apiUrl}/metrics/historical`;

    const today = new Date();
    const pastDate = new Date();
    pastDate.setTime(today.getTime() - durationInHours * 60 * 60 * 1000);

    return axios
      .get(dashboardMetricsApiUrl, {
        headers: this.headers,
        params: {
          aggregator: 'avg',
          end: today.toISOString(),
          group_by: 'group',
          metric: 'conversation_metrics.wait_time',
          start: pastDate.toISOString(),
        },
      })
      .then((response: { data: DashboardHistorical }) => {
        const matchingGroupData = response.data.data.find((grouping) => {
          return grouping.groupings[0].value === groupId;
        });

        if (matchingGroupData) {
          return parseInt(matchingGroupData.series[0].values[0].value, 10);
        } else {
          return 0;
        }
      });
  }

  /**
   * Calls Freshchat Dashboard Historical API to fetch unassigned count.
   */
  getUnassignedCountGivenGroupId(groupId: string, unassignedDuration: number): Promise<number> {
    const dashboardMetricsApiUrl = `${this.apiUrl}/metrics/historical`;

    return axios
      .get(dashboardMetricsApiUrl, {
        headers: this.headers,
        params: {
          end: new Date().toISOString(),
          group_by: 'group',
          metric: 'conversation_metrics.created_x_mins_ago_and_unassigned',
          start: new Date().toISOString(),
          x_time: unassignedDuration,
        },
      })
      .then((response: { data: DashboardHistorical }) => {
        const matchingGroupData = response.data.data.find((grouping) => {
          return grouping.groupings[0].value === groupId;
        });

        if (matchingGroupData) {
          return parseInt(matchingGroupData.series[0].values[0].value, 10);
        } else {
          return 0;
        }
      });
  }

  /**
   * Calls Freshchat Conversation API to assign a conversation to agent/group.
   */
  conversationAssign(
    conversationId: string,
    resourceId: string,
    assignTo: 'agent' | 'group',
    status: ConversationStatus,
  ): AxiosPromise<Conversation> {
    const conversationAssignApiUrl = `${this.apiUrl}/conversations/${conversationId}`;
    const data: {
      assigned_agent_id?: string;
      assigned_group_id?: string;
      status: string;
    } = {
      status,
    };

    if (assignTo === 'agent') {
      data.assigned_agent_id = resourceId;
    }
    if (assignTo === 'group') {
      data.assigned_group_id = resourceId;
    }

    return axios.put(conversationAssignApiUrl, JSON.stringify(data), {
      headers: this.headers,
    });
  }

  /**
   * Calls Freshchat conversation API to create message.
   */
  postMessage(
    conversationId: string,
    message: string,
    messageType: 'normal' | 'private',
    actorType?: 'agent' | 'bot',
    actorId?: string,
    replyParts?: ReplyPart[],
    isEmailConversation?: boolean
  ): AxiosPromise<Message> {
    const postMessageApiUrl = `${this.apiUrl}/conversations/${conversationId}/messages`;
    const messagePartType = isEmailConversation ? 'email' : 'text';

    return axios.post(
      postMessageApiUrl,
      JSON.stringify({
        actor_id: actorId,
        actor_type: actorType || 'bot',
        message_parts: [
          {
            [messagePartType]: {
              content: message,
            },
          },
        ],
        message_type: messageType,
        reply_parts: replyParts,
      }),
      { headers: this.headers },
    );
  }

  sendReply(
    conversationId: string,
    messageType: 'normal' | 'private',
    actorType: 'agent' | 'bot',
    messageParts: MessagePart[],
    replyParts?: ReplyPart[],
    actorId?: string,
  ): AxiosPromise<Message> {
    const postMessageApiUrl = `${this.apiUrl}/conversations/${conversationId}/messages`;

    return axios.post(
      postMessageApiUrl,
      JSON.stringify({
        actor_id: actorId,
        actor_type: actorType || 'bot',
        message_parts: messageParts,
        message_type: messageType,
        reply_parts: replyParts,
      }),
      { headers: this.headers },
    );
  }

  // eslint-disable-next-line complexity
  private async _getConversationMessagesByUrl(
    urlPath: string,
    result: Message[],
    options?: GetConversationMessagesOptions,
  ): Promise<Message[]> {
    // this.apiUrl for US is https://api.freshchat.com/v2
    // We want to truncate the last 3 characters so that we are left with https://api.freshchat.com
    const apiUrlDomain = this.apiUrl.slice(0, -3);

    try {
      const { data }: { data: GetMessagesResponse } = await axios.get(`${apiUrlDomain}${urlPath}`, {
        headers: this.headers,
      });

      let isStopFurtherFetch = false;

      for (let i = 0, messagesLen = data.messages.length; i < messagesLen; i++) {
        const currentMessage = data.messages[i];

        if (
          (options &&
            options.isFetchUntilLastResolve &&
            result.length &&
            currentMessage.meta_data &&
            currentMessage.meta_data.isResolved) ||
          (options && options.messagesLimit && result.length >= options.messagesLimit)
        ) {
          isStopFurtherFetch = true;
          break;
        }

        result.push(currentMessage);
      }

      if (data.link && !isStopFurtherFetch) {
        return this._getConversationMessagesByUrl(data.link.href, result, options);
      } else {
        return Promise.resolve(result);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        return Promise.reject(err.response.data);
      } else {
        return Promise.reject('Error fetching conversation');
      }
    }
  }

  /**
   * Calls Freshchat conversation api to fetch all messages in a particular conversation.
   */
  getConversationMessages(conversationId: string, options?: GetConversationMessagesOptions): Promise<Message[]> {
    return this._getConversationMessagesByUrl(
      `/v2/conversations/${conversationId}/messages?page=1&items_per_page=50`,
      [] as Message[],
      options,
    );
  }

  /**
   * Calls Freshchat conversation API to create message.
   */
  // sendNormalMessage

  /**
   * Calls Freshchat Conversation API to resolve/reopen a conversation.
   */
  conversationStatusUpdate(
    conversationId: string,
    status: 'assigned' | 'new' | 'resolved' | 'waiting on customer' | 'waiting on internal team',
  ): AxiosPromise<Conversation> {
    const conversationStatusUpdateApiUrl = `${this.apiUrl}/conversations/${conversationId}`;

    return axios.put(
      conversationStatusUpdateApiUrl,
      JSON.stringify({
        status,
      }),
      { headers: this.headers },
    );
  }

  /**
   * Send a quickreply message
   */
  sendQuickreply(conversationId: string, message: string, responses: string[]): AxiosPromise<Message> {
    const quickReplyParts = responses.map((response) => {
      return {
        quick_reply_button: {
          label: response,
        },
      };
    });

    return this.postMessage(conversationId, message, 'normal', 'bot', '', [
      {
        collection: {
          sub_parts: quickReplyParts,
        },
      },
    ]);
  }

  /**
   * Send Normal Reply.
   */
  sendNormalReplyText(conversationId: string, message: string, agentId?: string, isEmailConversation: boolean = false): AxiosPromise<Message> {
    return this.postMessage(conversationId, message, 'normal', agentId ? 'agent' : 'bot', agentId, undefined, isEmailConversation);
  }

  /** Update User API */
  updateUser(
    userId: string,
    properties: {
      email?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      properties?: {
        name: string;
        value: string;
      }[];
    },
  ): AxiosPromise<''> {
    const updateUserApiUrl = `${this.apiUrl}/users/${userId}`;

    return axios.put(updateUserApiUrl, JSON.stringify(properties), { headers: this.headers });
  }

  getUserById(userId: string): Promise<User> {
    const getUserApiUrl = `${this.apiUrl}/users/${userId}`;

    return axios.get(getUserApiUrl, { headers: this.headers }).then((response) => response.data);
  }

  async getSystemUserById(userId: string): Promise<Agent> {
    const getUserApiUrl = `${this.apiUrl}/users/${userId}?system_user=true`;

    return axios.get(getUserApiUrl, { headers: this.headers }).then((response) => response.data);
  }

  getAgentById(agentId: string): Promise<Agent> {
    const getAgentApiUrl = `${this.apiUrl}/agents/${agentId}`;

    return axios.get(getAgentApiUrl, { headers: this.headers }).then((response) => response.data);
  }

  getAgentsById(agentIds: string[]): Promise<Agent[]> {
    return Promise.all(agentIds.map((agentId) => this.getAgentById(agentId)));
  }

  getSystemUsersById(userIds: string[]): Promise<Agent[]> {
    return Promise.all(userIds.map((userId) => this.getSystemUserById(userId)));
  }

  async getConversationTranscript(
    baseUrl: string,
    accountId: string,
    conversationId: string,
    options?: GetConversationMessagesOptions,
    filterMessagesOptions?: FilterMessagesOptions,
  ): Promise<string> {
    try {
      // Step 1: Get conversation messages
      const messages = await this.getConversationMessages(conversationId, options);

      // Step 2: Filter messages
      const filteredMessages = Utils.filterMessages(messages, filterMessagesOptions);

      if (!filteredMessages.length) {
        throw 'Empty conversation';
      }

      // Step 2: Extract list of agentIds
      const agentIds = Utils.extractAgentIds(filteredMessages);

      // Step 3: Get agents by id
      const agents = await this.getAgentsById(agentIds);

      // Step 4: Extract userId
      const userId = Utils.extractUserId(filteredMessages);

      // Step 5: Get user by id
      let user: User | null = null;
      if (userId) {
        user = await this.getUserById(userId);
        if (isUsernameGenerated(user.first_name || '')) {
          user.first_name = '';
        }
      }

      const systemUserIds = Utils.extractSystemUserIds(filteredMessages);
      const systemUsers = await this.getSystemUsersById(systemUserIds);

      // Step 6: Generate conversation html
      return Promise.resolve(
        Utils.generateConversationTranscript(
          baseUrl,
          accountId,
          conversationId,
          filteredMessages,
          agents,
          systemUsers as Agent[],
          user as User,
          options,
        ),
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  triggerRawReports(
    startTime: string,
    endTime: string,
    eventType: ReportType,
    isExcludePii: boolean,
  ): Promise<{
    id: string;
    link: {
      href: string;
      rel: string;
    };
  }> {
    const rawReportsApiUrl = `${this.apiUrl}/reports/raw`;

    return axios
      .post(
        rawReportsApiUrl,
        JSON.stringify({
          end: endTime,
          event: eventType,
          format: 'csv',
          should_exclude_pii: isExcludePii,
          start: startTime,
        }),
        { headers: this.headers },
      )
      .then((response) => Promise.resolve(response.data));
  }

  retrieveRawReports(requestId: string): Promise<{
    id: string;
    interval: string;
    links: {
      from: string;
      link: {
        href: string;
        rel: string;
      };
      status: string;
      to: string;
    }[];
    status: 'COMPLETED' | string;
  }> {
    const rawReportsApiUrl = `${this.apiUrl}/reports/raw/${requestId}`;

    return axios.get(rawReportsApiUrl, { headers: this.headers }).then((response) => response.data);
  }

  /**
   * Calls Freshchat Conversation API to update Conversation Properties.
   */
  conversationPropertiesUpdate(
    conversationId: string,
    status: string,
    properties: unknown,
    assigned_agent_id: string,
  ): AxiosPromise<Conversation> {
    const conversationPropsUpdateApiUrl = `${this.apiUrl}/conversations/${conversationId}`;
    let requiredProperties = JSON.stringify({
        properties,
        status,
      });

    return axios.put(conversationPropsUpdateApiUrl, requiredProperties, { headers: this.headers });
  }

  /**
   * Calls Freshchat Conversation API to get Conversation Properties Fields.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getConversationPropertyFields(): Promise<{ data?: any; error?: any }> {
    try {
      const conversationPropsUpdateApiUrl = `${this.apiUrl}/conversations/fields`;
      const response = await axios.get(conversationPropsUpdateApiUrl, { headers: this.headers });
      return Promise.resolve({ data: response });
    } catch (error) {
      return Promise.resolve({ error });
    }
  }
}
