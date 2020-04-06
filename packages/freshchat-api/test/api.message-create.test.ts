import Freshchat, { Message, ConversationStatus, ActorType, MessageType } from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('api.message-create', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('messageCreate', () => {
    let res: Message;

    beforeEach(() => {
      // SET UP expected request
      res = {
        actor_id: '<service-account-id>',
        actor_type: ActorType.System,
        app_id: '<test-app-id>',
        channel_id: '<test-channel-id>',
        conversation_id: '1',
        created_time: 'sometime',
        id: '<some message id>',
        message_parts: [
          {
            text: {
              content: 'Hello'
            }
          }
        ],
        message_type: MessageType.Normal,
        reply_parts: []
      };

      nock('https://test.freshchat.com').post('/conversations/1').reply(200, res);
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent POST reqeust to /conversations/1', () => {
      expect(freshchat.postMessage('1', 'Hello', MessageType.Normal)).to.be.eventually.equal(res);
    });
  });
});
