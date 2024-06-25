/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import { serialize } from "../utils/serialize";
import { BaseComponent } from "./base";

/**
 * Represents a ChatBar.
 */
export class ChatBar extends BaseComponent {
  /**
   * Creates a ChatBar.
   * @param {function(string): void} notifyError - The function to notify about an error.
   * @param {function(string): Promise<AsyncIterable<MessageItemResponse | MessageItemResponseChunk | DocumentResponse>>} createGenerator - Function to create a generator from an input.
   * @param {ResponseProcessor} processor - The response processor.
   */
  constructor(notifyError, createGenerator, processor) {
    super("div");
    this.element.dataset.chatbotuiType = "ChatBar";
    const sendInput = async () => {
      if (this.isEnabled() && !this.isRunning()) {
        const content = this.getChatInput().element.innerText.trim();
        if (content !== "") {
          this.setRunning(true);
          const input = this.getInputData();
          document.dispatchEvent(new CustomEvent("chatbotuiMessageSendEvent"));
          await this.send(input);
          this.setRunning(false);
          this.checkEnabled();
        }
      }
    };
    this.chatInput = new ChatInput(sendInput);
    this.chatSendButton = new ChatSendButton(sendInput);
    this.element.appendChild(this.chatInput.getElement());
    this.element.appendChild(this.chatSendButton.getElement());
    this.notifyError = notifyError;
    this.createGenerator = createGenerator;
    this.processor = processor;
    this.setupChatInputObserver();
    this.setRunning(false);
    this.setEnabled(false);
  }

  /**
   * Sends a message.
   * @param {Object} input - The input data.
   */
  async send(input) {
    let generator;
    try {
      generator = await this.createGenerator(input);
    } catch (error) {
      console.error(error);
      this.notifyError("Failed to send message.");
      return;
    }
    const content = input["chat-input"];
    this.processor.processUserMessage(content);
    try {
      await this.processor.process(generator);
    } catch (error) {
      console.error(error);
      this.notifyError("Failure during message processing.");
      return;
    }
  }

  /**
   * Get the ChatInput component.
   * @returns {ChatInput} The ChatInput component.
   */
  getChatInput() {
    return this.chatInput;
  }

  /**
   * Set the running state of the ChatBar.
   * @param {boolean} running - The running state.
   */
  setRunning(running) {
    this.getElement().dataset.chatbotuiRunning = running;
  }

  /**
   * Check if the ChatBar is running.
   * @returns {boolean} True if running, otherwise false.
   */
  isRunning() {
    return this.getElement().dataset.chatbotuiRunning === "true";
  }

  /**
   * Get the ChatSendButton component.
   * @returns {ChatSendButton} The ChatSendButton component.
   */
  getChatSendButton() {
    return this.chatSendButton;
  }

  /**
   * Set the enabled state of the ChatBar.
   * @param {boolean} enabled - The enabled state.
   */
  setEnabled(enabled) {
    this.getChatSendButton().getElement().disabled = !enabled;
  }

  /**
   * Check if the ChatBar is enabled.
   * @returns {boolean} True if enabled, otherwise false.
   */
  isEnabled() {
    return !this.getChatSendButton().getElement().disabled;
  }

  /**
   * Check if the ChatBar should be enabled based on its state.
   */
  checkEnabled() {
    const ready = !this.isRunning();
    const content = this.getChatInput().getElement().innerText.trim() !== "";
    this.setEnabled(ready && content);
  }

  /**
   * Set up an observer to monitor changes in the ChatInput.
   */
  setupChatInputObserver() {
    const handle = () => this.checkEnabled();
    const observer = new MutationObserver(handle);
    observer.observe(this.getChatInput().getElement(), {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  /**
   * Get the HTML element representing the ChatBar.
   * @returns {HTMLElement} The HTML element representing the ChatBar.
   */
  getElement() {
    return this.element;
  }

  /**
   * Get the input data from the ChatBar.
   * @returns {Object} The input data.
   */
  getInputData() {
    const input = {};
    for (const element of this.element.querySelectorAll(
      "[data-chatbotui-type]",
    )) {
      const serialized = serialize(element);
      if (serialized) {
        input[
          element.dataset.chatbotuiType
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .toLowerCase()
        ] = serialized;
      }
    }
    return input;
  }
}

/**
 * Represents a ChatInput.
 */
class ChatInput extends BaseComponent {
  /**
   * Create a ChatInput.
   * @param {function(): Promise<void>} send - The function to be called when the Enter key is pressed.
   */
  constructor(send) {
    super("div");
    this.element.onkeydown = (e) => {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    };
    document.addEventListener("chatbotuiMessageSendEvent", () => {
      this.clear();
    });
    this.element.contentEditable = true;
    // line break behavior
    new MutationObserver(() => {
      if (
        !this.element.innerHTML.endsWith("<br><br>") &&
        this.element.innerHTML.endsWith("<br>")
      ) {
        // Remove the trailing "<br>"
        this.element.innerHTML = this.element.innerHTML.slice(0, -4);
        this.#jumpToEnd();
      }
    }).observe(this.element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    // clipboard
    this.element.addEventListener("paste", (e) => {
      e.preventDefault();
      const clipboardData = e.clipboardData || window.clipboardData;
      if (clipboardData) {
        const text = clipboardData.getData("text/plain");
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    this.element.dataset.chatbotuiType = "ChatInput";
  }

  /**
   * Clear the input field.
   */
  clear() {
    this.element.innerHTML = "";
  }

  /**
   * Move the cursor to the end of the input field.
   * @private
   */
  #jumpToEnd() {
    this.element.focus();
    const range = this.element.ownerDocument.createRange();
    range.selectNodeContents(this.element);
    range.collapse(false);
    const selection = this.element.ownerDocument.defaultView.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Get the HTML element representing the ChatInput.
   * @returns {HTMLElement} The HTML element representing the ChatInput.
   */
  getElement() {
    return this.element;
  }
}

/**
 * Represents a ChatSendButton.
 */
class ChatSendButton extends BaseComponent {
  /**
   * Create a ChatSendButton.
   * @param {function(): void} send - The function to be called when the button is clicked.
   */
  constructor(send) {
    super("button");
    this.element.innerHTML = "send";
    this.element.dataset.chatbotuiType = "ChatSendButton";
    this.element.onclick = send;
  }

  /**
   * Get the HTML element representing the ChatSendButton.
   * @returns {HTMLElement} The HTML element representing the ChatSendButton.
   */
  getElement() {
    return this.element;
  }
}

