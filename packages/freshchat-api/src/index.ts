import axios, { AxiosPromise } from 'axios';
import { Message } from './interfaces/Message';
import { Conversation } from './interfaces/Conversation';
import { BusinessHour } from './interfaces/BusinessHour';

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
   * Calls Freshchat Conversation API to assign a conversation to agent/group.
   */
  conversationAssign(
    conversationId: string,
    resourceId: string,
    assignTo: 'agent' | 'group',
  ): AxiosPromise<Conversation> {
    const conversationAssignApiUrl = `${this.apiUrl}/conversations/${conversationId}`;
    const data: {
      assigned_agent_id?: string;
      assigned_group_id?: string;
      status: string;
    } = {
      status: 'assigned',
    };

    switch (assignTo) {
      case 'agent':
        data.assigned_agent_id = resourceId;
        break;
      case 'group':
        data.status = 'new';
        data.assigned_group_id = resourceId;
        break;
      default:
        break;
    }

    return axios.put(conversationAssignApiUrl, JSON.stringify(data), {
      headers: this.headers,
    });
  }

  /**
   * Calls Freshchat conversation API to create message.
   */
  postMessage(conversationId: string, message: string, messageType: 'normal' | 'private'): AxiosPromise<Message> {
    const postMessageApiUrl = `${this.apiUrl}/conversations/${conversationId}/messages`;

    return axios.post(
      postMessageApiUrl,
      JSON.stringify({
        actor_type: 'bot',
        message_parts: [
          {
            text: {
              content: message,
            },
          },
        ],
        message_type: messageType,
      }),
      { headers: this.headers },
    );
  }

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
   * Calls Freshchat Business hours API to get the Business Hours for the account
   */
  getBusinessHours(): AxiosPromise<BusinessHour[]> {
    const businessHoursApiUrl = `${this.apiUrl}/operating_hours_v2`;
    let headers = this.headers;
    headers.Authorization = this.apiToken;
    return axios.get(
      businessHoursApiUrl,
      { headers: headers },
    );
  }
}
