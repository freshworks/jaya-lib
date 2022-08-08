import { assert } from 'chai';
import 'mocha';
import { isOutsideBusinessHours } from '../src/is-outside-business-hours';
import moment from 'moment-timezone';

describe('Utils test', () => {
  const businessHour = {
    appId: 123,
    created: '2020-04-08T12:51:20.654Z',
    days: {
      //8-12pm, 2-4pm and 4-6pm UTC working hours
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
    holidays: [{}],
    name: 'test business hours',
    operatingHoursId: 1234,
    timezone: 'Asia/Kolkata',
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
  describe('isOutsideBusinessHours', () => {
    it('should return false when business hour is not enabled', () => {
      businessHour.enabled = false;
      assert.equal(false, isOutsideBusinessHours(businessHour, new Date().getTime()));
    });
    it('should return false when business hour is enabled and holiday list is not passed', () => {
      assert.equal(false, isOutsideBusinessHours(businessHour, new Date().getTime()));
    });
    it('should return true when business hour is enabled and day is a holiday', () => {
      businessHour.enabled = true;
      businessHour.holidays = [
        {
          date: moment(new Date()).tz(businessHour.timezone).format('MMM DD'), // current date
          name: 'Test holiday',
        },
      ];
      assert.equal(true, isOutsideBusinessHours(businessHour, new Date().getTime()));
    });
    it('should return true if holiday is in format MMM D', () => {
      businessHour.enabled = true;
      businessHour.holidays = [
        {
          date: 'Aug 8',
          name: 'Test holiday',
        },
      ];
      assert.equal(true, isOutsideBusinessHours(businessHour, 1659960366763));
    });
    it('should return false when business hour is enabled and day is a not a holiday', () => {
      businessHour['holidays'] = [
        {
          date: 'invalid date', // current date
          name: 'Test holiday',
        },
      ];
      assert.equal(false, isOutsideBusinessHours(businessHour, new Date().getTime()));
    });
    it('should return false when agent is within business hour', () => {
      businessHour.enabled = true;
      // 11:10 AM in UTC
      const agentTime = 1586430600201;
      businessHour.working = {
        '0': 'true',
        '1': 'true',
        '2': 'true',
        '3': 'true',
        '4': 'true',
        '5': 'true',
        '6': 'true',
      };
      assert.equal(false, isOutsideBusinessHours(businessHour, agentTime));
    });
    it('should return true when agent is outside business hour but working on that week', () => {
      businessHour.enabled = true;
      // 01:10 PM in UTC
      const agentTime = 1586437800201;
      assert.equal(true, isOutsideBusinessHours(businessHour, agentTime));
    });
    it('should return true when agent is inside business hour but not working that day', () => {
      businessHour.enabled = true;
      businessHour.working = {
        '0': 'false',
        '1': 'false',
        '2': 'false',
        '3': 'false',
        '4': 'false',
        '5': 'false',
        '6': 'false',
      };
      // 11:10 AM in UTC
      const agentTime = 1586430600201;
      assert.equal(true, isOutsideBusinessHours(businessHour, agentTime));
    });
    it('should return true when no agentTime is passed', () => {
      businessHour.enabled = true;
      assert.equal(true, isOutsideBusinessHours(businessHour, 0));
    });
    it('should return true when wrong timezone is passed', () => {
      businessHour.enabled = true;
      businessHour.timezone = 'test';
      const agentTime = 1586437800201;
      assert.equal(true, isOutsideBusinessHours(businessHour, agentTime));
    });
    it('should go to the error block when wrong timestamp is provided', () => {
      businessHour.enabled = true;
      assert.equal(true, isOutsideBusinessHours(businessHour, 'agentTime' as unknown as number));
    });
  });
});
