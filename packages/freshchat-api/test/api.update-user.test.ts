import Freshchat from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.message-create', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('messageCreate', () => {
    const res = '';

    beforeEach(() => {
      nock('https://test.freshchat.com').post('/users/1').reply(200, res);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent POST reqeust to /conversations/1', () => {
      expect(
        freshchat.updateUser('1', {
          first_name: 'some-first-name',
        }),
      ).to.be.eventually.equal(res);
    });
  });
});
