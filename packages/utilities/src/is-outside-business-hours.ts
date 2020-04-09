import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { findTimeZone, getZonedTime } from 'timezone-support';
import { formatZonedTime } from 'timezone-support/dist/parse-format';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type DateInput = Date | number;

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
    try {
      const timeZoneData = findTimeZone(preferredTimeZone);
      const convertedTime = getZonedTime(timeStamp, timeZoneData);
      const format = 'YYYY-MM-DD HH:mm:ss';

      return formatZonedTime(convertedTime, format);
    } catch (err) {
      return '';
    }
  }
  return '';
};

/**
 * Returns true if outsideBusinessHours else false
 */
export const isOutsideBusinessHours = (businessHour: any): boolean => {
  let isAway = true,
    agentTime,
    workingHoursArr,
    agentDayOfWeek;
  const operatingHours = businessHour;
  const currentTimeInMillis = new Date().getTime();
  if (!operatingHours) {
    isAway = false;
  } else if (!operatingHours.enabled) {
    isAway = false;
  } else {
    agentTime = dayjs(toTimeZone(currentTimeInMillis, operatingHours.timezone.replace(' - ', '/')));
    if (agentTime) {
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
  }
  return isAway;
};
