import Freshchat, { Conversation, ConversationStatus } from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.conversation-assign', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('conversationAssign agent', () => {
    let res: Conversation;

    beforeEach(() => {
      // SET UP expected request
      res = {
        app_id: '<test-app-id>',
        assigned_agent_id: '<asigned-agent-id>',
        channel_id: '<test-channel-id>',
        conversation_id: '1',
        status: ConversationStatus.Assigned,
      };

      nock('https://test.freshchat.com').put('/conversations/1').reply(200, res);
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent PUT reqeust to /conversations/1', () => {
      expect(
        freshchat.conversationAssign('1', '<assigned-agent-id>', 'agent', ConversationStatus.Assigned),
      ).to.be.eventually.equal(res);
    });
  });

  describe('conversationAssign group', () => {
    let res: Conversation;

    beforeEach(() => {
      // SET UP expected request
      res = {
        app_id: '<test-app-id>',
        assigned_group_id: '<asigned-group-id>',
        channel_id: '<test-channel-id>',
        conversation_id: '1',
        status: ConversationStatus.Assigned,
      };

      nock('https://test.freshchat.com').put('/conversations/1').reply(200, res);
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent PUT reqeust to /conversations/1', () => {
      expect(
        freshchat.conversationAssign('1', '<assigned-agent-id>', 'group', ConversationStatus.Assigned),
      ).to.be.eventually.equal(res);
    });
  });
});
