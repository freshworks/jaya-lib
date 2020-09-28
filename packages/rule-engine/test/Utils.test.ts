import chai, { assert } from 'chai';
import { Utils } from '../src/Utils';
import 'mocha';
import ruleConfig from '../src/RuleConfig';
import { ConditionOperator } from '../src/models/rule';
import { Integrations } from '../src/models/rule-engine';
import { BusinessHour } from '@freshworks-jaya/utilities';
import nock from 'nock';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { expect } = chai;

describe('Utils test', () => {
  const integrations = {
    freshchatv2: {
      url: 'https://test.freshchat.com/v2',
      token: 'testToken',
    },
    freshchatv1: {
      url: 'https://test.freshchat.com/v1',
      token: 'testToken',
    },
    timezoneOffset: -330,
  };

  describe('convertOperand', () => {
    it('should trim the string', () => {
      assert.equal('one', Utils.convertOperand('one '));
      assert.equal('one', Utils.convertOperand(' one'));
      assert.equal('one', Utils.convertOperand(' one '));
      assert.equal('one', Utils.convertOperand('one'));
    });

    it('should return an empty string when param is not string', () => {
      assert.equal('', Utils.convertOperand((undefined as any) as string));
    });
  });

  describe('evaluateCondition', () => {
    beforeEach(() => {
      ruleConfig.registerPlugins([
        {
          operators: {
            EQUALS: (op1: string, op2: string): Promise<void> => {
              return Utils.promisify(op1 === op2);
            },
          },
        },
      ]);
    });

    afterEach(() => {
      ruleConfig.reset();
    });

    it('should evaluate EQUALS condition', async () => {
      Utils.evaluateCondition('EQUALS' as ConditionOperator, 'a', 'a', (integrations as any) as Integrations).then(
        () => {
          assert.ok('a is equal a');
        },
      );
      Utils.evaluateCondition('EQUALS' as ConditionOperator, 'a', 'b', (integrations as any) as Integrations).catch(
        () => {
          assert.ok('a is not equal b');
        },
      );
    });

    it('should handle the condition when operator is not available', () => {
      try {
        Utils.evaluateCondition('NOT_EQUALS' as ConditionOperator, 'a', 'b', (integrations as any) as Integrations);
      } catch (err) {
        assert('threw an exception when operator was not available');
      }
    });
  });

  describe('getBusinessHour', () => {
    let businessHour: BusinessHour;
    beforeEach(() => {
      // SET UP expected request
      businessHour = {
        appId: 123,
        days: {
          //8-12am, 2-4pm and 4-6pm UTC working hours
          '0': '28800;43200;50400;57600;57600;64800;',
          '1': '28800;43200;50400;57600;57600;64800;',
          '2': '28800;43200;50400;57600;57600;64800;',
          '3': '28800;43200;50400;57600;57600;64800;',
          '4': '28800;43200;50400;57600;57600;64800;',
          '5': '28800;43200;50400;57600;57600;64800;',
          '6': '28800;43200;50400;57600;57600;64800;',
        },
        defaultBhr: false,
        enabled: true,
        name: 'test business hours',
        operatingHoursId: 1234,
        timezone: 'UTC',
        working: {
          '0': 'true',
          '1': 'true',
          '2': 'true',
          '3': 'true',
          '4': 'true',
          '5': 'true',
          '6': 'true',
        },
        workingDaily: true,
      };

      nock('https://test.freshchat.com/v1')
        .get('/operating_hours_v2')
        .reply(200, { operatingHours: [businessHour] });
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should sent POST reqeust to /operating_hours_v2', () => {
      expect(Utils.getBusinessHour('1234', integrations)).to.be.eventually.equal(businessHour);
    });
  });
});
