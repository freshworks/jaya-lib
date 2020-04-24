import axios, { AxiosPromise } from 'axios';
import { Message } from './interfaces/Message';
import { Conversation, ConversationStatus } from './interfaces/Conversation';

export * from './interfaces/Conversation';
export * from './interfaces/Message';

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
      }),
      { headers: this.headers },
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
   * Send Normal Reply.
   */
  sendNormalReplyText(conversationId: string, message: string, agentId?: string): AxiosPromise<Message> {
    return this.postMessage(conversationId, message, 'normal', agentId ? 'agent' : 'bot', agentId);
  }
}
