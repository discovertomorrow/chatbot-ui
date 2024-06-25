/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import { ChatbotUI } from "./chatbotui";
import { ChatFilesButton } from "./components/files";
import {
  MessageItemResponseType,
  MessageItemResponse,
  MessageItemResponseChunk,
  DocumentResponse,
} from "./models/messageitemtypes";
import { setupFileDropZone } from "./utils/filedropper";
import { addSerializer, fileSerializer } from "./utils/serialize";

/**
 * Class representing a chatbot UI with file handling capabilities.
 * @extends ChatbotUI
 */
class ChatbotUIWithFiles extends ChatbotUI {
  /**
   * Creates an instance of ChatbotUIWithFiles.
   *
   * @param {function(string): Promise<AsyncGenerator<string>>} stream - The stream function to be used for streaming responses.
   * @param {function(File): Promise<string>} attachFileToInput - The function to attach a file to the input, which takes a File object as a parameter and returns a Promise that resolves with the fileID when the file is successfully attached, and throws an error on failure.
   * @param {function(string): Promise<void>} detachFileFromInput - The function to detach a file from the input, which takes a fileID as a parameter. It returns a Promise that resolves when the file is successfully detached, and throws an error on failure.
   */
  constructor(stream, attachFileToInput, detachFileFromInput) {
    super(stream);
    addSerializer(fileSerializer);
    this.attachFileToInput = attachFileToInput;
    this.detachFileFromInput = detachFileFromInput;
  }

  /**
   * Builds the chat bar and sets up file handling components.
   * @private
   * @param {HTMLElement} messageContainer - The container element for messages.
   */
  _buildChatbar() {
    super._buildChatbar();
    this.chatFilesButton = new ChatFilesButton(this.attachFileToInput, (msg) =>
      this.notifyError(msg),
    );
    setupFileDropZone(this.chatBar.getElement(), (file) => {
      this.chatFilesButton.attachFile(file);
    });
    this.chatBar
      .getElement()
      .insertBefore(
        this.chatFilesButton.getElement(),
        this.chatBar
          .getElement()
          .querySelector('div[data-chatbotui-type="ChatInput"]'),
      );
  }
}

export {
  ChatbotUIWithFiles,
  DocumentResponse,
  MessageItemResponse,
  MessageItemResponseChunk,
  MessageItemResponseType,
};

