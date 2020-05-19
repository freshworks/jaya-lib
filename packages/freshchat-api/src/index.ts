/* eslint-disable no-console */
import axios, { AxiosPromise } from 'axios';
import { Message, GetMessagesResponse } from './interfaces/Message';
import { Conversation, ConversationStatus } from './interfaces/Conversation';
import { DashboardHistorical } from './interfaces/DashboardHistorical';
import { ReplyPart } from './interfaces/ReplyPart';
import { User } from './interfaces/User';
import { Agent } from './interfaces/Agent';
import { Utils } from './Utils';

export * from './interfaces/Conversation';
export * from './interfaces/Message';
export * from './interfaces/DashboardHistorical';
export * from './interfaces/User';

export interface GetConversationMessagesOptions {
  fetchUntilLastResolve?: boolean;
}

export default class Freshchat {
  private get headers(): {
    Authorization: string;
    'Content-Type': string;
  } {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  constructor(private apiUrl: string, private apiToken: string) {}

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
  ): AxiosPromise<Message> {
    const postMessageApiUrl = `${this.apiUrl}/conversations/${conversationId}/messages`;

    return axios.post(
      postMessageApiUrl,
      JSON.stringify({
        actor_id: actorId,
        actor_type: actorType || 'bot',
        message_parts: [
          {
            text: {
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
          options &&
          options.fetchUntilLastResolve &&
          result.length &&
          currentMessage.meta_data &&
          currentMessage.meta_data.isResolved
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
      return Promise.reject('Error in fetching conversations');
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
    status: 'assigned' | 'new' | 'resolved',
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
   * Send a Private Note.
   */
  sendPrivateNote(conversationId: string, message: string, agentId?: string): AxiosPromise<Message> {
    const getAgentApiUrl = `${this.apiUrl}/agents?items_per_page=1`;

    if (agentId) {
      return this.postMessage(conversationId, message, 'private', 'agent', agentId);
    } else {
      return axios
        .get(getAgentApiUrl, { headers: this.headers })
        .then((response) => {
          const accountOwnerId = response.data.agents[0].id;
          return this.postMessage(conversationId, message, 'private', 'agent', accountOwnerId);
        })
        .catch((err) => {
          return err;
        });
    }
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
  sendNormalReplyText(conversationId: string, message: string, agentId?: string): AxiosPromise<Message> {
    return this.postMessage(conversationId, message, 'normal', agentId ? 'agent' : 'bot', agentId);
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

  getAgentById(agentId: string): Promise<Agent> {
    const getAgentApiUrl = `${this.apiUrl}/agents/${agentId}`;

    return axios.get(getAgentApiUrl, { headers: this.headers }).then((response) => response.data);
  }

  getAgentsById(agentIds: string[]): Promise<Agent[]> {
    return Promise.all(agentIds.map((agentId) => this.getAgentById(agentId)));
  }

  async getConversationHtml(conversationId: string, options?: GetConversationMessagesOptions): Promise<string> {
    try {
      // Step 1: Get conversation messages
      const messages = await this.getConversationMessages(conversationId, options);

      // Step 2: Extract list of agentIds
      const agentIds = Utils.extractAgentIds(messages);

      // Step 3: Get agents by id
      const agents = await this.getAgentsById(agentIds);

      // Step 4: Extract userId
      const userId = Utils.extractUserId(messages);

      // Step 5: Get user by id
      const user = await this.getUserById(userId as string);

      // Step 6: Generate conversation html
      return Promise.resolve(Utils.generateConversationHtml(messages, agents, user));
    } catch (err) {
      return Promise.reject('Error fetching conversationHtml');
    }
  }
}
