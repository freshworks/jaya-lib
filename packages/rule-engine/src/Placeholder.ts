import { ProductEventData, User, Agent, ActorType } from '@jaya-app/marketplace-models';

export class Placeholder {
  /**
   * Replaces all occurrences of a string within a string with another string.
   */
  public static replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  /**
   * Finds and replaces userFields and userPoperties.
   */
  public static findAndReplaceStaticPlaceholders(
    message: string,
    user: User,
    agent: Agent
  ): string {
    const placeholderMap: { [key: string]: string | undefined } = {
      '{agent.email}': agent.email,
      '{agent.first_name}': agent.first_name,
      '{agent.id}': agent.id,
      '{agent.last_name}': agent.last_name,
      '{user.email}': user.email,
      '{user.first_name}': user.first_name,
      '{user.id}': user.id,
      '{user.last_name}': user.last_name,
      '{user.phone}': user.phone,
    };
    const matches = message.match(
      /(?:\{user\.(?:first_name|last_name|email|phone|id)\}|\{agent\.(?:first_name|last_name|email|id)\})/gm
    );
    let result = message;

    if (Array.isArray(matches)) {
      result = matches.reduce((replacedString, match) => {
        const value = placeholderMap[match];

        if (value) {
          return this.replaceAll(replacedString, match, value);
        }
        return replacedString;
      }, result);
    }

    return result;
  }

  /**
   * Find and replace dynamic placeholders.
   */
  public static findAndReplaceDynamicPlaceholders(
    message: string,
    user: User
  ): string {
    const matches = message.match(
      /(?<={user\.properties\.)[a-zA-Z0-9-_]+(?=\})/gm
    );
    let result = message;

    if (Array.isArray(matches) && Array.isArray(user.properties)) {
      result = matches.reduce((replacedString, match) => {
        const userProperty = user.properties && user.properties.find(
          property => property.name === match
        );

        if (userProperty) {
          return this.replaceAll(
            replacedString,
            `{user.properties.${match}}`,
            userProperty.value
          );
        }

        return replacedString;
      }, result);
    }

    return result;
  }

  /**
   * Replaces all placeholders with corresponding values.
   */
  public static findAndReplacePlaceholders(
    productEventData: ProductEventData,
    message: string
  ): string {
    let result = message;

    result = this.findAndReplaceStaticPlaceholders(
      result,
      productEventData.associations.user || ({} as User),
      productEventData.associations.agent ||
        (productEventData.actor.type === ActorType.Agent
          ? productEventData.actor
          : null) ||
        ({} as Agent)
    );

    result = this.findAndReplaceDynamicPlaceholders(
      result,
      productEventData.associations.user
    );

    return result;
  }
}
