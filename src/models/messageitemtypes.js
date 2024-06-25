/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Enum for message item response types.
 * @readonly
 * @enum {string}
 */
const MessageItemResponseType = Object.freeze({
  TEXT: "text",
  TOOL: "tool",
  B64IMAGE: "b64image",
});

/**
 * Class representing a message item response.
 */
class MessageItemResponse {
  /**
   * Create a message item response.
   * @param {string} type - The type of the message item.
   * @param {string} content - The content of the message item.
   * @param {number} [messageItemID=-1] - The ID of the message item.
   * @param {string} [name="N/A"] - The name of the message item, ignored if type is "text".
   */
  constructor(type, content, messageItemID = -1, name = "N/A") {
    this.type = type;
    this.content = content;
    this.messageItemID = messageItemID;
    if (this.type !== MessageItemResponseType.TEXT) {
      this.name = name;
    }
  }

  /**
   * Create a MessageItemResponse instance from a JSON object.
   * @param {Object} json - The JSON object.
   * @param {string} json.type - The type of the message item.
   * @param {string} json.content - The content of the message item.
   * @param {number} [json.messageItemID=-1] - The ID of the message item.
   * @param {string} [json.name="N/A"] - The name of the message item.
   * @returns {MessageItemResponse} The instance of MessageItemResponse.
   */
  static fromJSON(json) {
    const { content, messageItemID, type, name } = json;
    return new MessageItemResponse(type, content, messageItemID, name);
  }
}

/**
 * Class representing a message item response chunk.
 */
class MessageItemResponseChunk {
  /**
   * Create a message item response chunk.
   * @param {string} content - The content of the message item chunk.
   * @param {number} messageItemID - The ID of the message item.
   * @param {string} [type=MessageItemResponseType.TEXT] - The type of the message item chunk.
   * @param {string} [name=""] - The name of the message item, ignored if type is "text".
   */
  constructor(
    content,
    messageItemID,
    type = MessageItemResponseType.TEXT,
    name = "",
  ) {
    this.content = content;
    this.messageItemID = messageItemID;
    this.type = type;
    if (this.type !== MessageItemResponseType.TEXT) {
      this.name = name;
    }
  }

  /**
   * Create a MessageItemResponseChunk instance from a JSON object.
   * @param {Object} json - The JSON object.
   * @param {string} json.type - The type of the message item chunk.
   * @param {string} json.content - The content of the message item chunk.
   * @param {number} json.messageItemID - The ID of the message item.
   * @param {string} [json.name=""] - The name of the message item chunk.
   * @returns {MessageItemResponseChunk} The instance of MessageItemResponseChunk.
   */
  static fromJSON(json) {
    const { type, content, messageItemID, name } = json;
    return new MessageItemResponseChunk(content, messageItemID, type, name);
  }
}

/**
 * Class representing a document response.
 */
class DocumentResponse {
  /**
   * Create a document response.
   * @param {string} title - The title of the document.
   * @param {string} content - The content of the document.
   * @param {string} icon - The icon of the document.
   */
  constructor(title, content, icon) {
    this.title = title;
    this.content = content;
    this.icon = icon;
  }

  /**
   * Create a DocumentResponse instance from a JSON object.
   * @param {Object} json - The JSON object.
   * @param {string} json.title - The title of the document.
   * @param {string} json.content - The content of the document.
   * @param {string} json.icon - The icon of the document.
   * @returns {DocumentResponse} The instance of DocumentResponse.
   */
  static fromJSON(json) {
    const { title, content, icon } = json;
    return new DocumentResponse(title, content, icon);
  }
}

export {
  MessageItemResponseChunk,
  MessageItemResponse,
  MessageItemResponseType,
  DocumentResponse,
};

