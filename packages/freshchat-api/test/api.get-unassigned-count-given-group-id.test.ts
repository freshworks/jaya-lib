import Freshchat, { DashboardHistorical } from '../src/index';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.get-unassigned-count-given-group-id', () => {
  const freshchat = new Freshchat('https://test.freshchat.com', 'TEST API TOKEN');

  describe('getUnassignedCountGivenGroupId', () => {
    let res: DashboardHistorical;

    beforeEach(() => {
      // SET UP expected request
      res = {
        aggregator: 'avg',
        data: [
          {
            groupings: [
              {
                key: 'group',
                value: 'null',
              },
            ],
            series: [
              {
                values: [
                  {
                    key: 'count',
                    value: '71',
                  },
                ],
              },
            ],
          },
        ],
        end: '2020-05-04T10:00:00.000Z',
        filters: {
          metric_filters: [],
        },
        interval: '',
        metrics: ['conversation_metrics.created_x_mins_ago_and_unassigned'],
        start: '2020-04-04T10:00:00.000Z',
      };

      nock('https://test.freshchat.com')
        .get(/\/metrics\/historical.*/)
        .reply(200, res);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent GET reqeust to /metrics/historical', () => {
      expect(freshchat.getUnassignedCountGivenGroupId('null', 30)).to.be.eventually.equal(71);
    });

    it('should sent GET reqeust to /metrics/historical invalid groupId', () => {
      expect(freshchat.getUnassignedCountGivenGroupId('invalid-group-id', 30)).to.be.eventually.equal(0);
    });
  });
});
