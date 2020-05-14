import Freshchat, { Message, ActorType, MessageType, MessageSource } from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.send-quickreply', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('sendQuickreply', () => {
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
              content: 'Hello',
            },
          },
        ],
        message_source: MessageSource.Web,
        message_type: MessageType.Normal,
        reply_parts: [
          {
            collection: {
              sub_parts: [
                {
                  quick_reply_button: {
                    label: 'Yes',
                  },
                },
                {
                  quick_reply_button: {
                    label: 'No',
                  },
                },
              ],
            },
          },
        ],
      };

      nock('https://test.freshchat.com').post('/conversations/1').reply(200, res);
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent POST reqeust to /conversations/1', () => {
      expect(freshchat.sendQuickreply('1', 'Hello', ['Yes', 'No'])).to.be.eventually.equal(res);
    });
  });
});
