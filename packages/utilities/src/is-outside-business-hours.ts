import moment from 'moment-timezone';

type DateInput = Date | number;

interface BusinessHour {
  appId: number;
  days: {
    [key: string]: string;
  };
  defaultBhr: boolean;
  enabled: boolean;
  name: string;
  operatingHoursId: number;
  timezone: string;
  working: {
    [key: string]: string;
  };
  workingDaily: boolean;
}
/**
 * Returns working hours as an array
 */
const getWorkingHours = (data: string): string[][] => {
  const dataStr = data.substr(0, data.length - 1),
    arrayData = dataStr.split(';');
  const timeArray = arrayData.reduce((all: string[][], one: string, i: number) => {
    const ch = Math.floor(i / 2);
    const fromHrs = all[ch] || [];
    all[ch] = fromHrs.concat(one);
    return all;
  }, []);

  return timeArray;
};

/**
 * Converts the given timestamp to the provided timezone.
 * If the timezone passed is valid, then performs the conversion.
 * Else, returns the passed timeStamp
 * @param {DateInput} timeStamp
 * @param {String} preferredTimeZone
 * @returns {String} - If at least one of the params passed are valid
 */
const toTimeZone = (timeStamp: DateInput, preferredTimeZone: string): string => {
  if (timeStamp && preferredTimeZone) {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const convertedTime = moment(timeStamp).tz(preferredTimeZone);
    return convertedTime.isValid() ? convertedTime.format(format) : '';
  }
  return '';
};

/**
 * Returns true if outsideBusinessHours else false
 */
const isOutsideBusinessHours = (businessHour: BusinessHour, currentTimeInMillis: number): boolean => {
  let isAway = true,
    agentTime,
    workingHoursArr,
    agentDayOfWeek;
  const operatingHours = businessHour;
  if (!operatingHours.enabled) {
    isAway = false;
  } else {
    agentTime = moment(toTimeZone(currentTimeInMillis, operatingHours.timezone.replace(' - ', '/')));
    agentDayOfWeek = (agentTime.day() + 6) % 7;
    if (operatingHours.working[agentDayOfWeek] !== 'true') {
      isAway = true;
    } else {
      workingHoursArr = getWorkingHours(operatingHours.days[agentDayOfWeek]);
      for (let i = 0, iLen = workingHoursArr.length; i < iLen; i++) {
        const fromToArr = workingHoursArr[i],
          fromTimeSeconds = parseInt(fromToArr[0], 10),
          toTimeSeconds = parseInt(fromToArr[1], 10),
          agentTimeFrom = agentTime.clone().startOf('day').add(fromTimeSeconds, 's'),
          agentTimeTo = agentTime.clone().startOf('day').add(toTimeSeconds, 's');

        if (agentTime.isAfter(agentTimeFrom) && agentTime.isBefore(agentTimeTo)) {
          isAway = false;
          break;
        }
      }
    }
  }
  return isAway;
};

export { isOutsideBusinessHours, BusinessHour };
