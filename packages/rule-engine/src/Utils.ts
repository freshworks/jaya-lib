import { ConditionOperator } from './index';
import ruleConfig from './RuleConfig';
import usernameVerbs from './constants/username-verbs';
import usernameNouns from './constants/username-nouns';
import { Integrations, BusinessHour } from './models/rule-engine';
import axios from 'axios';
// import dayjs from 'dayjs';
// import advancedFormat from 'dayjs/plugin/advancedFormat';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import localizedFormat from 'dayjs/plugin/localizedFormat';
// import { findTimeZone, getZonedTime } from 'timezone-support';
// import { formatZonedTime } from 'timezone-support/dist/parse-format';

// dayjs.extend(advancedFormat);
// dayjs.extend(relativeTime);
// dayjs.extend(localizedFormat);

type DateInput = Date | number;
export class Utils {
  /**
   * Returns true if username is generated
   */
  public static isUsernameGenerated(username: string): boolean {
    const split = username.split(/\s+/);

    if (split.length !== 2) {
      return false;
    }

    const [verb, noun] = split;
    return !!(usernameVerbs[verb] && usernameNouns[noun]);
  }

  /**
   * Converts operand to string.
   */
  public static convertOperand(operand: string): string {
    let retVal: string = operand && operand.toString().trim().toLowerCase();

    retVal = typeof retVal === 'string' ? retVal : '';
    return retVal;
  }

  /**
   * Performs operation defined by 'operator' on operands operand1 and operand2.
   */
  public static evaluateCondition(
    operator: ConditionOperator,
    operand1: string,
    operand2: string,
    integrations: Integrations,
  ): boolean {
    const sanitizedOperand1 = this.convertOperand(operand1);
    const sanitizedOperand2 = this.convertOperand(operand2);

    const operatorFunc = ruleConfig.operators && ruleConfig.operators[operator];

    if (operatorFunc) {
      return operatorFunc(sanitizedOperand1, sanitizedOperand2, integrations);
    }

    throw new Error('no matching condition');
  }

  /**
   * Returns working hours as an array
   */
  // public static getWorkingHours(data: string): string[][] {
  //   const dataStr = data.substr(0, data.length - 1),
  //     arrayData = dataStr.split(';');
  //   const timeArray = arrayData.reduce((all: string[][], one: string, i: number) => {
  //     const ch = Math.floor(i / 2);
  //     const fromHrs = all[ch] || [];
  //     all[ch] = fromHrs.concat(one);
  //     return all;
  //   }, []);

  //   return timeArray;
  // }

  /**
   * Returns true if isWithinBusinessHours
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isWithinBusinessHours(businessHour: any): boolean {
    return !this.outsideBusinessHours(businessHour);
  }

  /**
   * Returns true if outsideBusinessHours
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static outsideBusinessHours(businessHour: any): boolean {
    // let isAway = true,
    //   agentTime,
    //   workingHoursArr,
    //   agentDayOfWeek;
    // const operatingHours = businessHour;
    // const currentTimeInMillis = new Date().getTime();
    // if (!operatingHours) {
    //   isAway = false;
    // } else if (!operatingHours.enabled) {
    //   isAway = false;
    // } else {
    //   agentTime = dayjs(this.toTimeZone(currentTimeInMillis, operatingHours.timezone.replace(' - ', '/')));
    //   if (agentTime) {
    //     agentDayOfWeek = (agentTime.day() + 6) % 7;
    //     if (operatingHours.working[agentDayOfWeek] !== 'true') {
    //       isAway = true;
    //     } else {
    //       workingHoursArr = this.getWorkingHours(operatingHours.days[agentDayOfWeek]);
    //       for (let i = 0, iLen = workingHoursArr.length; i < iLen; i++) {
    //         const fromToArr = workingHoursArr[i],
    //           fromTimeSeconds = parseInt(fromToArr[0], 10),
    //           toTimeSeconds = parseInt(fromToArr[1], 10),
    //           agentTimeFrom = agentTime.clone().startOf('day').add(fromTimeSeconds, 's'),
    //           agentTimeTo = agentTime.clone().startOf('day').add(toTimeSeconds, 's');
    //         if (agentTime.isAfter(agentTimeFrom) && agentTime.isBefore(agentTimeTo)) {
    //           isAway = false;
    //           break;
    //         }
    //       }
    //     }
    //   }
    // }
    businessHour && businessHour;
    return true; // return isAway
  }

  /**
   * Converts the given timestamp to the provided timezone.
   * If the timezone passed is valid, then performs the conversion.
   * Else, returns the passed timeStamp
   * @param {DateInput} timeStamp
   * @param {String} preferredTimeZone
   * @returns {String} - If at least one of the params passed are valid
   */
  // public static toTimeZone(timeStamp: DateInput, preferredTimeZone: string): string {
  //   if (timeStamp && preferredTimeZone) {
  //     try {
  //       const timeZoneData = findTimeZone(preferredTimeZone);
  //       const convertedTime = getZonedTime(timeStamp, timeZoneData);
  //       const format = 'YYYY-MM-DD HH:mm:ss';

  //       return formatZonedTime(convertedTime, format);
  //     } catch (err) {
  //       return '';
  //     }
  //   }
  //   return '';
  // }

  /**
   * Gets business hour for an account based on businessHourId provided.
   */
  public static getBusinessHour = async (businessHourId: string, integrations: Integrations): Promise<BusinessHour> => {
    const freshchatApiUrl = integrations.freshchatv1.url;
    const freshchatApiToken = integrations.freshchatv1.token;
    try {
      const businessHours = await axios.get(freshchatApiUrl, {
        headers: {
          Authorization: freshchatApiToken,
        },
      });
      const conditionBusinessHour = businessHours.data.filterBy('operatingHoursId', parseInt(businessHourId, 10));
      return conditionBusinessHour && conditionBusinessHour[0];
    } catch (err) {
      throw new Error('Error getting BusinessHours');
    }
  };
}
