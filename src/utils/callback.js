/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Class representing a CallbackHandler.
 * Allows registering and unregistering callback functions,
 * and calling all registered callbacks with arbitrary arguments.
 */
export class CallbackHandler {
  /**
   * Creates an instance of CallbackHandler.
   */
  constructor() {
    /**
     * Set to store registered callback functions.
     * @type {Set<Function>}
     */
    this.callbacks = new Set();
  }

  /**
   * Registers a callback function.
   * @param {Function} callback - The callback function to register.
   * @throws {Error} Throws an error if the callback is not a function.
   */
  register(callback) {
    if (typeof callback === "function") {
      this.callbacks.add(callback);
    } else {
      throw new Error("Callback must be a function");
    }
  }

  /**
   * Unregisters a callback function.
   * @param {Function} callback - The callback function to unregister.
   */
  unregister(callback) {
    this.callbacks.delete(callback);
  }

  /**
   * Calls all registered callback functions with arbitrary arguments.
   * @param {...*} args - The arguments to pass to the callback functions.
   */
  callback(...args) {
    this.callbacks.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error("Callback error:", error);
      }
    });
  }
}

