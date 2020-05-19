import Freshchat from '../src/index';
import { Agent } from '../src/interfaces/Agent';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.get-agent-by-id', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('getAgentById', () => {
    let res: Agent;

    beforeEach(() => {
      // SET UP expected request
      res = {
        avatar: {
          url: 'random-url',
        },
        email: 'arun.rajkumar+appathon@freshworks.com',
        first_name: 'Arrun',
        groups: ['e90e2b42-4054-487a-a615-bb29fe216f53'],
        id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
        is_deactivated: false,
        last_name: 'Rajkummar',
        role_id: 'OWNER',
        skill_id: '437cee42-2958-4485-9239-70fdfd2c770a',
        social_profiles: [],
      };

      nock('https://test.freshchat.com').get('/agents/1').reply(200, res);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent GET reqeust to /agents/1', () => {
      expect(freshchat.getAgentById('1')).to.be.eventually.equal(res);
    });
  });
});
