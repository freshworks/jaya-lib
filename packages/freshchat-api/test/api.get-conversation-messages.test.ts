import Freshchat, { GetMessagesResponse, ActorType, MessageSource, MessageType } from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
const { assert } = chai;

describe('api.get-conversation-messages', () => {
  const freshchat = new Freshchat('https://test.freshchat.com/v2', 'TEST API TOKEN');

  // Test Case 1: 1 normal message without link
  /**
   * Test Case 2: 1 normal message without link
   *   isFetchUntilLastResolve: false
   */
  // Test Case 3: 2 normal messages with items_per_page 1.
  /**
   * Test Case 4: isFetchUntilLastResolve: true
   *   2 messages in first page containing a link
   *   1st message is normal; 2nd message is resolve
   */
  /** Test Case 5: only system messages in conversation */

  describe('getConversationMessages message without link', () => {
    let res: GetMessagesResponse;

    beforeEach(() => {
      res = {
        messages: [
          {
            actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
            actor_type: ('agent' as any) as ActorType,
            app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
            channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
            conversation_id: 'bac6d33f-e4ea-433e-8e57-687070daf0de',
            created_time: '2020-05-13T10:20:43.063Z',
            id: '87f200ac-b8e0-41a4-be3f-d217b80d09f5',
            message_parts: [
              {
                text: {
                  content: 'hi there',
                },
              },
            ],
            message_source: MessageSource.Web,
            message_type: MessageType.Normal,
          },
        ],
      };

      nock('https://test.freshchat.com/v2')
        .get(/\/conversations\/1\/messages\?page=1.*/)
        .reply(200, res);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    // Test Case 1
    it('should sent GET reqeust to /conversations/1/messages', () => {
      freshchat.getConversationMessages('1').then((messages) => {
        assert.equal(messages[0].id, res.messages[0].id);
      });
    });

    // Test Case 2
    it('should sent GET reqeust to /conversations/1/messages with fetchUntilLastResolve:false', () => {
      freshchat.getConversationMessages('1', { isFetchUntilLastResolve: false }).then((messages) => {
        assert.equal(messages[0].id, res.messages[0].id);
      });
    });
  });

  describe('getConversationMessages 2 normal messages with items_per_page 1', () => {
    let res1: GetMessagesResponse;
    let res2: GetMessagesResponse;

    beforeEach(() => {
      res1 = {
        link: {
          href: '/v2/conversations/1/messages?page=1&items_per_page=1&from_time=2020-05-13T10:20:32.700Z',
        },
        messages: [
          {
            actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
            actor_type: ('agent' as any) as ActorType,
            app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
            channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
            conversation_id: 'bac6d33f-e4ea-433e-8e57-687070daf0de',
            created_time: '2020-05-13T10:20:43.063Z',
            id: 'message-id-1',
            message_parts: [
              {
                text: {
                  content: 'hi there',
                },
              },
            ],
            message_source: MessageSource.Web,
            message_type: MessageType.Normal,
          },
        ],
      };

      res2 = {
        messages: [
          {
            actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
            actor_type: ('agent' as any) as ActorType,
            app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
            channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
            conversation_id: 'bac6d33f-e4ea-433e-8e57-687070daf0de',
            created_time: '2020-05-13T10:20:43.063Z',
            id: 'message-id-2',
            message_parts: [
              {
                text: {
                  content: 'hi there, second message here.',
                },
              },
            ],
            message_source: MessageSource.Web,
            message_type: MessageType.Normal,
          },
        ],
      };

      nock('https://test.freshchat.com/v2')
        .get(/\/conversations\/1\/messages\?page=1.*/)
        .reply(200, res1);
      nock('https://test.freshchat.com/v2')
        .get(/\/conversations\/1\/messages\?page=2.*/)
        .reply(200, res2);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    // Test Case 3
    it('should sent GET reqeust to /conversations/1/messages', () => {
      freshchat.getConversationMessages('1').then((messages) => {
        assert.equal(messages[0].id, res1.messages[0].id);
        assert.equal(messages[1].id, res2.messages[0].id);
      });
    });
  });

  describe('getConversationMessages message without link', () => {
    let res: GetMessagesResponse;

    beforeEach(() => {
      res = {
        link: {
          href: '/v2/conversations/1/messages?page=1&items_per_page=1&from_time=2020-05-13T10:20:32.700Z',
        },
        messages: [
          {
            actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
            actor_type: ('agent' as any) as ActorType,
            app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
            channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
            conversation_id: 'bac6d33f-e4ea-433e-8e57-687070daf0de',
            created_time: '2020-05-13T10:20:43.063Z',
            id: '87f200ac-b8e0-41a4-be3f-d217b80d09f5',
            message_parts: [
              {
                text: {
                  content: 'hi there',
                },
              },
            ],
            message_source: MessageSource.Web,
            message_type: MessageType.Normal,
          },
          {
            actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
            actor_type: ('agent' as any) as ActorType,
            app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
            channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
            conversation_id: 'bac6d33f-e4ea-433e-8e57-687070daf0de',
            created_time: '2020-05-13T10:20:43.063Z',
            id: 'message-id-2',
            message_parts: [
              {
                text: {
                  content: 'Conversation was resolved by agent.',
                },
              },
            ],
            message_source: MessageSource.System,
            message_type: MessageType.Normal,
            meta_data: {
              isResolved: true,
            },
          },
        ],
      };

      nock('https://test.freshchat.com/v2')
        .get(/\/conversations\/1\/messages\?page=1.*/)
        .reply(200, res);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    // Test Case 4
    it('should sent GET reqeust to /conversations/1/messages', () => {
      freshchat.getConversationMessages('1', { isFetchUntilLastResolve: true }).then((messages) => {
        assert.equal(messages[0].id, res.messages[0].id);
        assert.equal(messages.length, 1);
      });
    });
  });
});
