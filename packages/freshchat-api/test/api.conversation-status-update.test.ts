import Freshchat, { Conversation, ConversationStatus } from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('api.conversation-status-update', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('conversationStatusUpdate reopen', () => {
    let res: Conversation;

    beforeEach(() => {
      // SET UP expected request
      res = {
        conversation_id: '1',
        app_id: '<test-app-id>',
        status: ConversationStatus.New,
        channel_id: '<test-channel-id>',
      };

      nock('https://test.freshchat.com').put('/conversations/1').reply(200, res);
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent PUT reqeust to /conversations/1', () => {
      expect(freshchat.conversationStatusUpdate('1', 'new')).to.be.eventually.equal(res);
    });
  });
});
