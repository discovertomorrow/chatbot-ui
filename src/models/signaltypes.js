/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Class representing a signal to delete a message item.
 */
class DeleteMessageItemSignal {
  /**
   * Create a delete message item signal.
   * @param {number} [messageItemID=-1] - The ID of the message item to be deleted. Defaults to -1 if not provided.
   */
  constructor(messageItemID = -1) {
    this.messageItemID = messageItemID;
  }

  /**
   * Create a DeleteMessageItemSignal instance from a JSON object.
   * @param {Object} json - The JSON object containing the message item data.
   * @param {number} [json.messageItemID=-1] - The ID of the message item to be deleted. Defaults to -1 if not provided.
   * @returns {DeleteMessageItemSignal} The instance of DeleteMessageItemSignal.
   */
  static fromJSON(json) {
    const { messageItemID } = json;
    return new DeleteMessageItemSignal(messageItemID);
  }
}

/**
 * Class representing a signal to hide a message item.
 */
class HideMessageItemSignal {
  /**
   * Create a hide message item signal.
   * @param {number} [messageItemID=-1] - The ID of the message item to be hidden. Defaults to -1 if not provided.
   */
  constructor(messageItemID = -1) {
    this.messageItemID = messageItemID;
  }

  /**
   * Create a HideMessageItemSignal instance from a JSON object.
   * @param {Object} json - The JSON object containing the message item data.
   * @param {number} [json.messageItemID=-1] - The ID of the message item to be hidden. Defaults to -1 if not provided.
   * @returns {DeleteMessageItemSignal} The instance of HideMessageItemSignal.
   */
  static fromJSON(json) {
    const { messageItemID } = json;
    return new HideMessageItemSignal(messageItemID);
  }
}

export { DeleteMessageItemSignal, HideMessageItemSignal };

