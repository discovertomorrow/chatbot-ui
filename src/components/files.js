/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import { BaseComponent } from "./base";
import { promptFileUpload } from "../utils/fileupload";

/**
 * Class representing an input file.
 * @extends BaseComponent
 */
export class InputFile extends BaseComponent {
  /**
   * Create an input file component.
   * @param {string} name - The name of the file.
   * @param {HTMLElement} [element] - The existing HTML element representing the input file.
   */
  constructor(name, element) {
    super("div", undefined, element);
    if (element) return;
    this.element.dataset.chatbotuiType = "InputFile";
    this.setName(name);
    this.element.onclick = (e) => {
      e.stopPropagation();
      if (this.element.dataset.chatbotuiInputFileId) {
        this.element.remove();
      }
    };
  }

  /**
   * Set the name of the input file.
   * @param {string} name - The name of the file.
   */
  setName(name) {
    this.element.dataset.chatbotuiInputFileName = name;
  }

  /**
   * Set the ID of the input file.
   * @param {string} fileID - The ID of the file.
   */
  setID(fileID) {
    this.element.dataset.chatbotuiInputFileId = fileID;
  }
}

/**
 * Class representing an input file area.
 * @extends BaseComponent
 */
export class InputFileArea extends BaseComponent {
  /**
   * Create an input file area component.
   */
  constructor() {
    super("div");
    this.element.dataset.chatbotuiType = "InputFileArea";
    document.addEventListener("chatbotuiMessageSendEvent", () => {
      this.clear();
    });
  }

  /**
   * Clear the input file area.
   */
  clear() {
    this.element.innerHTML = "";
  }
}

/**
 * Class representing a chat files button.
 * @extends BaseComponent
 */
export class ChatFilesButton extends BaseComponent {
  /**
   * Create a ChatFilesButton.
   * @param {function(File): Promise<string>} attachFileToInput - The function to attach a file to the input, which takes a File object as a parameter and returns a Promise that resolves with the fileID when the file is successfully attached, and throws an error on failure.
   * @param {function(string): void} notifyError - The function to notify about an error.
   */
  constructor(attachFileToInput, notifyError) {
    super("button");
    this.notifyError = notifyError;
    this.element.innerHTML = "upload";
    this.element.dataset.chatbotuiType = "ChatFilesButton";
    this.attachFileToInput = attachFileToInput;
    this.inputFileArea = new InputFileArea();
    this.element.appendChild(this.inputFileArea.element);
    this.element.onclick = () => {
      promptFileUpload(".csv").then((file) => {
        this.attachFile(file);
      });
    };
  }

  /**
   * Attaches a file.
   *
   * @param {File} file - The file to be attached.
   * @returns {Promise<void>} A promise that resolves when the file is attached.
   */
  async attachFile(file) {
    const inputFile = new InputFile(file.name);
    this.inputFileArea.element.appendChild(inputFile.element);
    try {
      const fileID = await this.attachFileToInput(file);
      inputFile.setID(fileID);
    } catch (error) {
      inputFile.element.remove();
      this.notifyError("Failed to attach file.");
    }
  }

  /**
   * Get the HTML element representing the chat files button.
   * @returns {HTMLElement} The HTML element representing the chat files button.
   */
  getElement() {
    return this.element;
  }
}

