/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import { BaseComponent } from "./base";

let render = (content) => content;

/**
 * Set renderer.
 * @param {function(string): string} r - A function that takes a string and returns a string.
 */
export function setRender(r) {
  render = r;
}

/**
 * Class representing a Message.
 * @extends BaseComponent
 */
export class Message extends BaseComponent {
  static _messageCounter = 0;

  /**
   * Create a message.
   * @param {string} role - The role of the message (e.g., 'user', 'bot').
   * @param {Date} [timestamp=new Date()] - The timestamp of the message.
   */
  constructor(role, timestamp = new Date()) {
    super("div", timestamp);
    this.#setMessageID(Message._messageCounter++);
    this.element.dataset.chatbotuiType = "Message";
    this.setRole(role);
  }

  /**
   * Get a message item by ID.
   * @param {number} id - The ID of the message item.
   * @returns {MessageItem|undefined} The message item if found, otherwise undefined.
   */
  getMessageItem(id) {
    const item = this.element.querySelector(
      `[data-chatbotui-message-item-id="${id}"]`,
    );
    if (item) {
      return new MessageItem(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        item,
      );
    }
    return undefined;
  }

  /**
   * Get all message items.
   * @returns {MessageItem[]} An array of MessageItem instances.
   */
  getMessageItems() {
    return Array.from(
      this.element.querySelectorAll('[data-chatbotui-type="MessageItem"]'),
    ).map(
      (item) =>
        new MessageItem(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          item,
        ),
    );
  }

  /**
   * Set the ID of the message.
   * @private
   * @param {number} id - The ID to set.
   */
  #setMessageID(id) {
    this.element.dataset.chatbotuiMessageId = id;
  }

  /**
   * Get the message ID.
   * @returns {number} The ID of the message.
   */
  getMessageID() {
    return parseInt(this.element.dataset.chatbotuiMessageId, 10);
  }

  /**
   * Set the role of the message.
   * @param {string} role - The role of the message (e.g., 'user', 'bot').
   */
  setRole(role) {
    this.element.dataset.chatbotuiMessageRole = role;
  }

  /**
   * Get the HTML element representing the message.
   * @returns {HTMLElement} The HTML element representing the message.
   */
  getElement() {
    return this.element;
  }

  /**
   * Adds a new MessageItem to the Message.
   * @param {MessageItem} item - The item to add.
   */
  addMessageItem(item) {
    this.element.appendChild(item.getElement());
  }
}

/**
 * Class representing an item of a Message.
 * @extends BaseComponent
 */
export class MessageItem extends BaseComponent {
  /**
   * Create a MessageItem.
   * @param {number} id - The id of the item (unique for the message).
   * @param {string} type - The type of the item (e.g., 'text', 'tool').
   * @param {boolean} [active=false] - The active state of the message item.
   * @param {string} [name] - The name of the item (e.g., 'Lookup-Tool', 'tool').
   * @param {Date} [timestamp=new Date()] - The timestamp of the message item.
   * @param {HTMLElement} [element] - The existing HTML element representing the message item.
   */
  constructor(id, type, active = false, name, timestamp = new Date(), element) {
    super("div", timestamp, element);
    if (element) return;

    this.#setMessageItemID(id);
    this.element.dataset.chatbotuiType = "MessageItem";
    this.setType(type);
    if (name) {
      this.setName(name);
    }
    this.setActive(active);
  }

  /**
   * Set the ID of the message item.
   * @private
   * @param {number} id - The ID to set.
   */
  #setMessageItemID(id) {
    this.id = id;
    this.getElement().dataset.chatbotuiMessageItemId = id;
  }

  /**
   * Sets or unsets the dataset entry `chatbotuiMessageItemActive` on the element.
   * @param {boolean} [active=true] - If true, sets the dataset entry to true.
   *                                  If false, completely unsets the dataset entry.
   */
  setActive(active = true) {
    if (active) {
      this.getElement().dataset.chatbotuiMessageItemActive = active;
    } else {
      delete this.getElement().dataset.chatbotuiMessageItemActive;
    }
  }

  /**
   * Get the HTML element representing the message item.
   * @returns {HTMLElement} The HTML element representing the message item.
   */
  getElement() {
    return this.element;
  }

  /**
   * Set the type of the message item.
   * @param {string} type - The type of the item (e.g., 'text', 'tool').
   */
  setType(type) {
    this.element.dataset.chatbotuiMessageItemType = type;
  }

  /**
   * Set the name of the message item.
   * @param {string} name - The name of the item (e.g., 'Lookup-Tool', 'tool').
   */
  setName(name) {
    this.element.dataset.chatbotuiMessageItemName = name;
  }

  /**
   * Set the HTML content of the message item.
   * @param {string} content - The HTML content of the message item.
   */
  setHTML(content) {
    this.element.innerHTML = content;
  }

  /**
   * Set the Markdown content of the message item.
   * @param {string} content - The Markdown content of the message item.
   */
  setMarkdown(content) {
    this.setHTML(render(content));
  }

  /**
   * Set the Markdown content of the message item and return the instance.
   * @param {string} content - The Markdown content of the message item.
   * @returns {MessageItem} The instance of the MessageItem.
   */
  withMarkdown(content) {
    this.setHTML(render(content));
    return this;
  }

  /**
   * Set the plaintext content of the message item.
   * @param {string} content - The plaintext content of the message item.
   */
  setPlaintext(content) {
    this.element.innerText = content;
  }

  /**
   * Set the plaintext content of the message item and return the instance.
   * @param {string} content - The plaintext content of the message item.
   * @returns {MessageItem} The instance of the MessageItem.
   */
  withPlaintext(content) {
    this.setPlaintext(content);
    return this;
  }
}

