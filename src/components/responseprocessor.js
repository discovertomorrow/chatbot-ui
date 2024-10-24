/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import { createSmoothScrollDownFunction } from "../utils/scroll.js";
import { Message, MessageItem } from "../components/message";
import { Document } from "../components/document";
import {
  MessageItemResponseType,
  MessageItemResponseChunk,
  MessageItemResponse,
  DocumentResponse,
} from "../models/messageitemtypes";
import {
  DeleteMessageItemSignal,
  HideMessageItemSignal,
} from "../models/signaltypes";

export class ResponseProcessor {
  /**
   * Creates an instance of the ResponseProcessor.
   *
   * @param {HTMLDivElement} messageContainer - The container for the messages.
   * @param {function(Document): void} documentCallback - The callback function to handle documents.
   */
  constructor(messageContainer, documentCallback) {
    this.messageContainer = messageContainer;
    this.documentCallback = documentCallback;
    this.scrollDown = createSmoothScrollDownFunction(
      messageContainer,
      messageContainer.parentElement,
    );
  }

  /**
   * Processes a user message and adds it to the message container.
   *
   * @param {string} message - The user message.
   */
  processUserMessage(message) {
    const userMessage = new Message("user");
    userMessage.addMessageItem(new MessageItem("text").withPlaintext(message));
    this.messageContainer.appendChild(userMessage.getElement());
  }

  /**
   * Processes the response stream and updates the message container.
   *
   * @param {AsyncIterable<MessageItemResponse | MessageItemResponseChunk | DocumentResponse>} generator - The generator to process.
   */
  async process(generator) {
    const chatMessage = new Message("assistant");
    this.messageContainer.appendChild(chatMessage.getElement());
    this.scrollDown();
    try {
      await this.#handle(chatMessage, generator);
    } catch (e) {
      const item = new MessageItem("error", "text", false);
      item.setMarkdown("*Error with response. Please try again later.*");
      chatMessage.addMessageItem(item);
      this.#finalize(chatMessage);
      throw e;
    }
    this.#finalize(chatMessage);
  }

  /**
   * Finalizes the chat message by setting all items to inactive and scrolling down.
   *
   * @param {Message} chatMessage - The chat message to finalize.
   */
  #finalize(chatMessage) {
    chatMessage.getMessageItems().forEach((item) => {
      item.setActive(false);
    });
    setTimeout(() => this.scrollDown(), 500);
  }

  /**
   * Handles the response stream and updates the chat message with new items or content.
   *
   * @param {Message} chatMessage - The chat message being updated.
   * @param {AsyncIterable<MessageItemResponse | MessageItemResponseChunk | DocumentResponse>} generator - The generator providing the response stream.
   * @private
   */
  async #handle(chatMessage, generator) {
    let currentItem = null;
    let content = "";
    for await (const data of generator) {
      switch (data.constructor) {
        case MessageItemResponse: {
          if (chatMessage.getMessageItem(data.messageItemID)) {
            throw new Error("Item already exists");
          }
        }
        case MessageItemResponseChunk: {
          const name =
            data.type === MessageItemResponseType.TOOL
              ? (data.name ?? "N/A")
              : undefined;
          let item = chatMessage.getMessageItem(data.messageItemID);
          if (!item) {
            item = new MessageItem(data.messageItemID, data.type, true, name);
            item.setSelected(true);
            content = "";
            if (currentItem) {
              currentItem.setActive(false);
            }
            currentItem = item;
            chatMessage.addMessageItem(item);
          }
          content += data.content;
          item.setMarkdown(content);
          break;
        }
        case DocumentResponse: {
          const doc = new Document(
            chatMessage.getMessageID(),
            data.content,
            data.icon,
            data.title,
          );
          this.documentCallback(doc);
          break;
        }
        case DeleteMessageItemSignal: {
          chatMessage.deleteMessageItem(data.messageItemID);
        }
        case HideMessageItemSignal: {
          chatMessage.hideMessageItem(data.messageItemID);
        }
        default:
          console.warn("Unknown data type received:", data);
      }
      this.scrollDown();
    }
  }
}

