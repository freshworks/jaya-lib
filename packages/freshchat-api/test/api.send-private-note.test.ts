import Freshchat, { Message, ActorType, MessageType, MessageSource } from '../src/index';
import { Agent } from '../src/interfaces/Agent';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.message-create', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('sendPrivateNote', () => {
    let messageCreateResponse: Message;
    let getAgentsResponse: Agent[];

    beforeEach(() => {
      // SET UP expected request
      messageCreateResponse = {
        actor_id: '<service-account-id>',
        actor_type: ActorType.Agent,
        app_id: '<test-app-id>',
        channel_id: '<test-channel-id>',
        conversation_id: '1',
        created_time: 'sometime',
        id: '<some message id>',
        message_parts: [
          {
            text: {
              content: 'Hello',
            },
          },
        ],
        message_source: MessageSource.Web,
        message_type: MessageType.Private,
        reply_parts: [],
      };

      getAgentsResponse = [
        {
          email: 'some-agent-email',
          first_name: 'Agent',
          groups: [],
          id: 'some-agent-id',
          last_name: 'Name',
        },
      ];

      nock('https://test.freshchat.com').post('/conversations/1').reply(200, messageCreateResponse);

      nock('https://test.freshchat.com').get('/agents').query({ items_per_page: '1' }).reply(200, {
        agents: getAgentsResponse,
      });

      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should add a private note to a conversation', () => {
      expect(freshchat.sendPrivateNote('1', 'Hello')).to.be.eventually.equal(messageCreateResponse);
    });
  });

  describe('sendPrivateNote as specific agent', () => {
    let messageCreateResponse: Message;

    beforeEach(() => {
      // SET UP expected request
      messageCreateResponse = {
        actor_id: '<some-agent-id>',
        actor_type: ActorType.Agent,
        app_id: '<test-app-id>',
        channel_id: '<test-channel-id>',
        conversation_id: '1',
        created_time: 'sometime',
        id: '<some message id>',
        message_parts: [
          {
            text: {
              content: 'Hello',
            },
          },
        ],
        message_source: MessageSource.Web,
        message_type: MessageType.Private,
        reply_parts: [],
      };

      nock('https://test.freshchat.com').post('/conversations/1').reply(200, messageCreateResponse);

      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should add a private note to a conversation', () => {
      expect(freshchat.sendPrivateNote('1', 'Hello', '<some-agent-id>')).to.be.eventually.equal(messageCreateResponse);
    });
  });
});
