/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Represents a document with an ID, icon, title, and content.
 */
class Document {
  /**
   * Creates a new Document.
   * @param {number} messageID - The unique identifier of the message this documents belongs to.
   * @param {string} [icon] - The icon representing the document (UTF-8 character).
   * @param {string} [title] - The title of the document.
   * @param {string} content - The content of the document.
   */
  constructor(messageID, content, icon = "", title = "") {
    /**
     * @type {number}
     */
    this.messageID = messageID;
    /**
     * @type {string}
     */
    this.icon = icon;
    /**
     * @type {string}
     */
    this.title = title;
    /**
     * @type {string}
     */
    this.content = content;
  }
}

export { Document };

