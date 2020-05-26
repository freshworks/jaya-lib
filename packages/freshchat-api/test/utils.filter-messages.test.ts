import { ActorType, MessageSource, MessageType, Message } from '../src/interfaces/Message';
import { Utils } from '../src/Utils';
import 'mocha';
import chai from 'chai';
const { assert } = chai;

describe('utils', () => {
  describe('filterMessages with various combinations', () => {
    const messages: Message[] = [
      // Normal message
      {
        actor_id: '8f6d3642-4d4d-4206-84ab-f6df3331713a',
        actor_type: ActorType.User,
        app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
        channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
        conversation_id: '1389644d-c961-4dc7-9e93-ae95bd6ca3b0',
        created_time: '2020-05-25T06:34:25.501Z',
        id: 'b8b75687-4a41-4e61-a3cb-583fa9043dea',
        message_parts: [
          {
            text: {
              content: 'hello',
            },
          },
        ],
        message_source: MessageSource.Web,
        message_type: MessageType.Normal,
      },
      // System message
      ({
        actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
        actor_type: ActorType.Agent,
        app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
        channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
        conversation_id: '1389644d-c961-4dc7-9e93-ae95bd6ca3b0',
        created_time: '2020-05-25T06:34:38.651Z',
        id: '45ef044d-74da-4b76-95f0-daada546d8c6',
        message_parts: [
          {
            text: {
              content: 'Conversation was marked resolved by Arrun Rajkummar',
            },
          },
        ],
        message_source: MessageSource.System,
        meta_data: {
          isResolved: true,
        },
      } as unknown) as Message,
      // Private message
      {
        actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
        actor_type: ActorType.Agent,
        app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
        channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
        conversation_id: '1389644d-c961-4dc7-9e93-ae95bd6ca3b0',
        created_time: '2020-05-25T12:29:39.571Z',
        id: 'd6913ed2-b81f-4baa-a121-5ee3b3f70e13',
        message_parts: [
          {
            text: {
              content: 'Private note by agent here',
            },
          },
        ],
        message_source: MessageSource.Web,
        message_type: MessageType.Private,
      },
    ];

    it('should filter out the normal message', () => {
      assert.equal(
        Utils.filterMessages(messages, {
          isExcludeNormal: true,
        }).length,
        2,
      );
    });

    it('should filter out the system message', () => {
      assert.equal(
        Utils.filterMessages(messages, {
          isExcludeSystem: true,
        }).length,
        2,
      );
    });

    it('should filter out the private message', () => {
      assert.equal(
        Utils.filterMessages(messages, {
          isExcludePrivate: true,
        }).length,
        2,
      );
    });
  });
});
