/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Sets up a drop zone on the provided HTML element to allow file dropping.
 * @param {HTMLElement} element - The HTML element to be used as a drop zone.
 * @param {function(File): void} attachFile - The function to attach a file to the input.
 */
export function setupFileDropZone(element, attachFile) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    element.addEventListener(eventName, preventDefaults, false);
  });

  /**
   * Prevents the default behavior and stops the propagation of the event.
   * @param {Event} e - The event to prevent defaults for.
   */
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    element.addEventListener(
      eventName,
      () => {
        element.dataset.chatbotuiFileDropperHighlight = "true";
      },
      false,
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    element.addEventListener(
      eventName,
      () => {
        element.dataset.chatbotuiFileDropperHighlight = "false";
      },
      false,
    );
  });

  element.addEventListener(
    "drop",
    (event) => {
      const dt = event.dataTransfer;
      const file = dt.files[0];
      if (file) {
        attachFile(file);
      }
    },
    false,
  );
}

