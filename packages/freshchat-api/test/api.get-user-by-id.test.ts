import Freshchat from '../src/index';
import { User } from '../src/interfaces/User';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.get-user-by-id', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('getUserById', () => {
    let res: User;

    beforeEach(() => {
      // SET UP expected request
      res = {
        avatar: {},
        created_time: '2020-05-15T06:20:09.846Z',
        first_name: 'Sudhir',
        id: '1',
        properties: [
          {
            name: 'fc_user_timezone',
            value: 'Asia/Calcutta',
          },
          {
            name: 'plan',
            value: 'estate',
          },
        ],
      };

      nock('https://test.freshchat.com').get('/users/1').reply(200, res);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent GET reqeust to /users/1', () => {
      expect(freshchat.getUserById('1')).to.be.eventually.equal(res);
    });
  });
});
