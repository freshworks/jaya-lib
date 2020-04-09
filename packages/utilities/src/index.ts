export interface PlaceholdersMap {
  [key: string]: string;
}

export * from './is-outside-business-hours';

const replaceAll = (str: string, find: string, replace: string): string => {
  return str.replace(new RegExp(find, 'g'), replace);
};

const findMatchingPlaceholders = (message: string, placeholdersMap: PlaceholdersMap): null | string[] => {
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
      const regExpReplaceString = `\\{${field.replace('.', '\\.')}(\\|${altValue})?\\}`;

      // Replace all occurrences of placeholder with value.
      return replaceAll(replacedString, regExpReplaceString, value);
    }, result);
  }

  return result;
};

export { findAndReplacePlaceholders, findMatchingPlaceholders };
