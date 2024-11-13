import { expect } from 'chai';
import { Event, ProductEventData, ActorType, ResponseDueType, ConversationStatus, MessageSource,MessageType, ConversationSource, ChangedStatus } from '@freshworks-jaya/marketplace-models';
import updateConversationProperty from '../src/recommended/trigger-actions/update-conversation-property';
import { TriggerAction } from '../src/models/rule';

const productEventPayload: unknown = {
    actor: {
      last_name: 'Doe',
      first_name: 'John',
      email: 'some-agent-email',
      type: 'agent',
      avatar: {
        url: 'some-avatar-url',
      },
      id: 'some-agent-id',
      phone: 'some-agent-phone',
    },
    message: {
      created_time: '2020-04-03T08:26:55.782Z',
      conversation_id: 'some-conv-id',
      response_due_type: 'NO_RESPONSE_DUE',
      user_id: 'some-user-id',
      channel_id: 'some-channel-id',
      reopened_time: '2020-04-05T16:58:52.806Z',
      app_id: 'some-app-id',
      status: 'new',
      messages: [
        {
          created_time: '2020-04-06T05:01:40.601Z',
          conversation_id: 'some-conv-id',
          id: 'some-message-id',
          user_id: 'some-user-id',
          message_source: 'web',
          message_type: 'normal',
          message_parts: [
            {
              text: {
                content: 'hi',
              },
            },
          ],
          app_id: 'some-app-id',
        },
      ],
    },
    associations: {
      channel: {
        public: true,
        name: 'Inbox',
        welcome_message: {
          message_parts: [
            {
              text: {
                content: 'Hello there!',
              },
            },
          ],
          message_type: 'normal',
          message_source: 'system',
        },
        updated_time: '2020-04-03T08:05:43.028Z',
        id: 'some-channel-id',
        tags: [],
        icon: {},
        locale: '',
        enabled: true,
      },
      user: {
        last_name: 'some-user-last-name',
        properties: [
          {
            name: 'fc_user_timezone',
            value: 'Asia/Calcutta',
          },
        ],
        first_name: 'some-user-first-name',
        created_time: '2020-04-03T08:26:55.409Z',
        avatar: {},
        id: 'some-user-id',
      },
    }
};

describe('updateConversationProperty', () => {
  it('should return true for valid conversation update with model changes', () => {
    const productEvent = Event.ConversationUpdate;
    const productEventData = productEventPayload as ProductEventData;
    
    productEventData.actor.actor_source = 'USER';
    productEventData.changes = {
      model_changes : {
        "assigned_agent_id": ['agent_123', 'agent_456'],
      }
    } as any;
    const triggerAction: TriggerAction =  { type: 'action' } as any;

    const result = updateConversationProperty(productEvent, productEventData, triggerAction);
    expect(result).to.be.true;
  });

  it('should return false if actor source is API', () => {
    const productEvent = Event.ConversationUpdate;
    const productEventData = productEventPayload as ProductEventData;
    
    productEventData.actor.actor_source = 'API'
    const triggerAction: TriggerAction = { type: 'action' } as any;

    const result = updateConversationProperty(productEvent, productEventData, triggerAction);
    expect(result).to.be.false;
  });

  it('should return false if model changes are empty', () => {
    const productEvent = Event.ConversationUpdate;
    const productEventData = productEventPayload as ProductEventData;
    
    productEventData.actor.actor_source = 'USER';
    productEventData.changes = {model_changes : {} } as any;
    const triggerAction: TriggerAction =  { type: 'action' } as any;


    const result = updateConversationProperty(productEvent, productEventData, triggerAction);
    expect(result).to.be.false;
  });

  it('should return true if custom field matches the pattern', () => {
    const productEvent = Event.ConversationUpdate;
    const productEventData = productEventPayload as ProductEventData;
    
    productEventData.actor.actor_source = 'USER';
    productEventData.changes = { 
      model_changes :{
        "cf_custom_filed": ['agent_123', 'agent_456'],
      }
    } as any;
    const triggerAction: TriggerAction =  { type: 'action' } as any;


    const result = updateConversationProperty(productEvent, productEventData, triggerAction);
    expect(result).to.be.true;
  });

  it('should return false for non-conversation update events', () => {
    const productEvent = Event.MessageCreate;
    const productEventData = productEventPayload as ProductEventData;
    
    productEventData.actor.actor_source = 'AGENT';
    const triggerAction: TriggerAction = { type: 'action' } as any;


    const result = updateConversationProperty(productEvent, productEventData, triggerAction);
    expect(result).to.be.false;
  });
});