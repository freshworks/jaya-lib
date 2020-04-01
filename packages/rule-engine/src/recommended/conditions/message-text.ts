import { Condition } from "../../models/rule";
import { ProductEventData, MessagePart } from "@jaya-app/marketplace-models";
import { Utils } from '../../Utils';

/**
 * Gets a concatenated string of messageParts with type 'text'.
 */
function getMessagePartsTextContent(
  messageParts: MessagePart[]
): string {
  let messageContent = '';

  if (messageParts && messageParts.length) {
    messageContent = messageParts
      .filter(messagePart => messagePart.text)
      .map(messagePart => {
        return messagePart.text && messagePart.text.content;
      })
      .join(' ');
  }

  return messageContent;
}

export default (condition: Condition, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return Utils.evaluateCondition(
    condition.operator,
    getMessagePartsTextContent(
      modelProperties.messages[0].message_parts
    ),
    condition.value as string
  );
}