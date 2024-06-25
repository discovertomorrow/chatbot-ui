/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import { setRender } from "./components/message";
import { ChatBar } from "./components/chatbar";
import { CallbackHandler } from "./utils/callback";
import {
  MessageItemResponseType,
  MessageItemResponse,
  MessageItemResponseChunk,
  DocumentResponse,
} from "./models/messageitemtypes";
import { addSerializer, baseSerializer } from "./utils/serialize";
import { ResponseProcessor } from "./components/responseprocessor";

/**
 * Class representing the Chatbot UI.
 */
class ChatbotUI {
  static singleton = null;

  /**
   * Creates an instance of ChatbotUI.
   * @param {function(string): Promise<AsyncGenerator<string>>} stream - The stream function to be used for streaming responses.
   */
  constructor(stream) {
    this.setStreamFunction(stream);
    this.documentCallbackHandler = new CallbackHandler();
    this.errorCallbackHandler = new CallbackHandler();
    addSerializer(baseSerializer);
    ChatbotUI.singleton = this;
  }

  /**
   * Sets the render function for messages.
   * @param {function(string): string} render - A function that takes a string and returns a string.
   */
  setRender(render) {
    setRender(render);
  }

  /**
   * Sets the render function and returns the ChatbotUI instance.
   * @param {function(string): string} render - A function that takes a string and returns a string.
   * @returns {ChatbotUI} The ChatbotUI instance.
   */
  withRender(render) {
    this.setRender(render);
    return this;
  }

  /**
   * Sets the session ID and returns the ChatbotUI instance.
   * @param {string} sessionID - The session ID to set.
   * @returns {ChatbotUI} The ChatbotUI instance.
   */
  withSessionID(sessionID) {
    this.sessionID = sessionID;
    return this;
  }

  /**
   * Sets the stream function and returns the ChatbotUI instance.
   * @param {function(Object): Promise<Response>} stream - The stream function to set.
   * @returns {ChatbotUI} The ChatbotUI instance.
   */
  withStreamFunction(stream) {
    this.streamFunction = stream;
    return this;
  }

  /**
   * Sets the stream function.
   * @param {function(Object): Promise<Response>} stream - The stream function to set.
   */
  setStreamFunction(stream) {
    this.streamFunction = stream;
  }

  /**
   * Registers a callback function for new documents and returns the ChatbotUI instance.
   * @param {Function} callback - The callback function to register.
   * @throws {Error} Throws an error if the callback is not a function.
   * @returns {ChatbotUI} The ChatbotUI instance.
   */
  withDocumentCallback(callback) {
    this.documentCallbackHandler.register(callback);
    return this;
  }

  /**
   * Registers a callback function for errors and returns the ChatbotUI instance.
   * @param {Function} callback - The callback function to register.
   * @throws {Error} Throws an error if the callback is not a function.
   * @returns {ChatbotUI} The ChatbotUI instance.
   */
  withErrorCallback(callback) {
    this.errorCallbackHandler.register(callback);
    return this;
  }

  /**
   * Notifies about an error.
   * @param {string} msg - The error message.
   */
  notifyError(msg) {
    this.errorCallbackHandler.callback(msg);
  }

  /**
   * Builds the ChatBar.
   * @param {HTMLDivElement} messageContainer - The container for the messages.
   * @private
   */
  _buildChatbar() {
    this.chatBar = new ChatBar(
      (msg) => this.notifyError(msg),
      this.streamFunction,
      new ResponseProcessor(this.messageContainer, (...args) =>
        this.documentCallbackHandler.callback(...args),
      ),
    );
  }

  /**
   * Attaches the ChatbotUI to the given containers.
   * @param {HTMLDivElement} messageContainer - The container for the messages.
   * @param {HTMLDivElement} chatbarContainer - The container for the chat input bar.
   * @returns {ChatbotUI} The ChatbotUI instance.
   */
  attachTo(messageContainer, chatbarContainer) {
    this.messageContainer = messageContainer;
    this.chatbarContainer = chatbarContainer;
    this._buildChatbar();
    this.#copyChatbotUIAttributes();
    chatbarContainer.appendChild(this.chatBar.getElement());
    return this;
  }

  /**
   * Sets the focus to the ChatInput instance.
   */
  focus() {
    this.chatBar.getChatInput().getElement().focus();
  }

  /**
   * Copies specific data attributes starting with 'data-chatbotui' from chatbarContainer
   * to components.
   */
  #copyChatbotUIAttributes() {
    const inputPlaceholder =
      this.chatbarContainer.dataset.chatbotuiInputPlaceholder;
    if (inputPlaceholder) {
      this.chatBar
        .getChatInput()
        .getElement().dataset.chatbotuiInputPlaceholder = inputPlaceholder;
    }
  }
}

export {
  ChatbotUI,
  DocumentResponse,
  MessageItemResponse,
  MessageItemResponseChunk,
  MessageItemResponseType,
};

