export interface PlaceholdersMap {
  [key: string]: string;
}

const replaceAll = (str: string, find: string, replace: string): string => {
  return str.replace(new RegExp(find, 'g'), replace);
};

const findAndReplacePlaceholders = (message: string, placeholders: PlaceholdersMap): string => {
  let result = message;

  // Construct regex string with placeholders like so.
  // agent\\.first_name|agent\\.last_name|agent\\.id
  const placeholdersRegExpString = Object.keys(placeholders)
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
  const matches = message.match(placeholdersRegExp);

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
      const value = (placeholders && placeholders[field]) || altValue || '';
      const regExpReplaceString = `\\{${field.replace('.', '\\.')}(\\|${altValue})?\\}`;

      // Replace all occurrences of placeholder with value.
      return replaceAll(replacedString, regExpReplaceString, value.trim());
    }, result);
  }

  return result;
};

export default findAndReplacePlaceholders;
