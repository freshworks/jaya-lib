import { BusinessHour, isOutsideBusinessHours } from './is-outside-business-hours';
import usernameVerbs from './constants/username-verbs';
import usernameNouns from './constants/username-nouns';
export interface PlaceholdersMap {
  [key: string]: string | unknown;
}

const capitalize = (word: string | undefined): string => {
  if (!word || typeof word !== 'string') {
    return '';
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
};

const capitalizeAll = (sentence: string | undefined): string => {
  if (!sentence || typeof sentence !== 'string') {
    return '';
  }

  const words = sentence.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    words[i] = capitalize(words[i]);
  }

  return words.join(' ');
};

/**
 * Returns true if username is generated
 */
const isUsernameGenerated = (username: string): boolean => {
  const split = username.split(/\s+/);

  if (split.length !== 2) {
    return false;
  }

  const [verb, noun] = split;
  return !!(usernameVerbs[verb] && usernameNouns[noun]);
};

const replaceAll = (str: string, find: string, replace: string): string => {
  return str.replace(new RegExp(find, 'g'), replace);
};

const findMatchingKeys = (message: string, placeholdersMap: { [key: string]: unknown }): null | string[] => {
  // Construct regex string with placeholders like so.
  // agent\\.first_name|agent\\.last_name|agent\\.id
  const placeholdersRegExpString = Object.keys(placeholdersMap)
    .map((placeholder) => {
      return placeholder.replace('.', '\\.');
    })
    .join('|');

  // Regex to find all placeholder keys in a given string with the format:
  // {<placeholder>|<altValue}
  // Eg. {metrics.average_wait_time}
  const regExpString = `(?<=\\{)(${placeholdersRegExpString})(?=(?:\\|[\\w\\s]+)?\\})`;
  const placeholdersRegExp = new RegExp(regExpString, 'gm');

  return message.match(placeholdersRegExp);
};

const findMatchingPlaceholders = (message: string, placeholdersMap: { [key: string]: unknown }): null | string[] => {
  // Construct regex string with placeholders like so.
  // agent\\.first_name|agent\\.last_name|agent\\.id
  const placeholdersRegExpString = Object.keys(placeholdersMap)
    .map((placeholder) => {
      return placeholder.replace('.', '\\.');
    })
    .join('|');

  // Regex to find all placeholders in a given string with the format.
  // {<placeholder>|<alValue>}
  // Eg. {user.first_name|there}
  const regExpString = `(?:(?<=\\{)(?:${placeholdersRegExpString})(?:\\|[\\w\\s]+)?(?=\\}))`;
  const placeholdersRegExp = new RegExp(regExpString, 'gm');

  // Find matches in the given message for above regexp.
  // Eg. ['user.first_name|there', 'agent.id']
  return message.match(placeholdersRegExp);
};

const findAndReplacePlaceholders = (message: string, placeholdersMap: PlaceholdersMap): string => {
  let result = message;

  // Get the matching placeholders from message
  const matches = findMatchingPlaceholders(message, placeholdersMap);

  // Replace placeholder with value for each match
  if (Array.isArray(matches)) {
    result = matches.reduce((replacedString, match) => {
      // Each match is of the format `field|altValue`
      const [field, altValue] = match.split('|');

      // Construct regex to replace all occurrences of match.
      // Use value for placeholder from
      // If not available, use altValue.
      // Even if that is not available, use an empty string.
      // Constructed replacement regex string will look like so.
      // Eg. \\{user\\.first_name(\\|there)?\\}
      const value = (placeholdersMap && placeholdersMap[field]) || altValue || '';
      const regExpReplaceString = `\\{${field.replace('.', '\\.')}(?:\\|${altValue})?\\}`;

      // Replace all occurrences of placeholder with value.
      if (typeof value === 'string') {
        return replaceAll(replacedString, regExpReplaceString, value);
      }
      return replacedString;
    }, result);
  }

  return result;
};

export {
  findAndReplacePlaceholders,
  findMatchingPlaceholders,
  findMatchingKeys,
  BusinessHour,
  isOutsideBusinessHours,
  isUsernameGenerated,
  capitalize,
  capitalizeAll,
};
