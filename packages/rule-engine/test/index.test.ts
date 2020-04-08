import { RuleEngine, Rule } from '../src/index';
import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import 'mocha';
import { assert } from 'chai';
import { Integrations } from '../src/models/rule-engine';

describe('RuleEngine test', () => {
  const productEventPayload = {
    data: {
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
      },
    },
    region: 'US',
    domain: 'web.freshchat.com',
    event: 'onMessageCreate',
    version: '1.0.0',
    account_id: 'some-marketplace-account-id',
    timestamp: 1586149300632,
  };

  const integrations = {
    freshchatv2: {
      url: 'https://api.freshchat.com/v2',
    },
    freshchatv1: {
      url: 'https://api.freshchat.com/app/services/app/v1',
    },
  };

  const rules = [
    {
      blocks: [
        {
          conditions: [
            {
              operator: 'NOT_EQUALS',
              value: 'some-channel-id',
              key: 'CHANNEL',
            },
          ],
          matchType: 'ANY',
        },
      ],
      name: 'When agent says hi',
      isTimer: false,
      actions: [
        {
          type: 'SEND_MESSAGE',
          value: 'hello',
        },
      ],
      timerValue: 5,
      triggers: [
        {
          action: 'MESSAGE_CREATE',
          actor: 'AGENT',
        },
      ],
      matchType: 'ANY',
      invalidators: null,
      isEnabled: true,
    },
  ];

  describe('invokes RuleEngine constructor with plugins', () => {
    const ruleEngine = new RuleEngine([
      {
        placeholders: {
          'user.first_name': 'some-name',
        },
      },
    ]);

    assert.ok(ruleEngine);
  });

  describe('processProductEvent', () => {
    it('triggers processProductEvent function with params', () => {
      const ruleEngine = new RuleEngine();
      ruleEngine.processProductEvent(
        (productEventPayload as any) as ProductEventPayload,
        (rules as any) as Rule[],
        {
          isSchedulerEnabled: false,
        },
        'some-external-event-url',        
        integrations as any as Integrations);
    });
  });
});
