/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Prompts the user to upload a file.
 * @param {string} [accept] - A string that defines the file types the file input should accept.
 *                            For example, '.csv' or 'image/*'.
 * @returns {Promise<File>} A promise that resolves to the selected file.
 * @throws {Error} If no file is selected or the file selection fails.
 */
export async function promptFileUpload(accept) {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.click();

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error("No file selected"));
      }
    };

    input.onerror = () => {
      reject(new Error("File selection failed"));
    };
  });
}

