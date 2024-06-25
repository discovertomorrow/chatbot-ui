/**
 * Array to hold serializer functions.
 * @type {Array<function(HTMLElement): *>}
 */
let serializerFunctions = [];

/**
 * Serializes an HTML element using registered serializer functions.
 * @param {HTMLElement} element - The HTML element to serialize.
 * @returns {*} The serialized result, if a serializer function handles the element, otherwise undefined.
 */
export const serialize = (element) => {
  for (const serializer of serializerFunctions) {
    const res = serializer(element);
    if (res) {
      return res;
    }
  }
};

/**
 * Adds a serializer function to the list of serializer functions.
 * @param {function(HTMLElement): *} serializer - The serializer function to add.
 */
export const addSerializer = (serializer) => {
  serializerFunctions.push(serializer);
};

/**
 * Basic serializer for chat input elements.
 * @param {HTMLElement} element - The HTML element to serialize.
 * @returns {string|undefined} The serialized text content if the element is of type ChatInput, otherwise undefined.
 */
export const baseSerializer = (element) => {
  if (element.dataset.chatbotuiType === "ChatInput") {
    const text = element.innerHTML
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "");
    return text;
  }
};

/**
 * Serializer for file input elements.
 * @param {HTMLElement} element - The HTML element to serialize.
 * @returns {Array<string>|undefined} The array of file IDs if the element is of type InputFileArea, otherwise undefined.
 */
export const fileSerializer = (element) => {
  if (element.dataset.chatbotuiType === "InputFileArea") {
    const fileElements = element.querySelectorAll(
      '[data-chatbotui-type="InputFile"][data-chatbotui-input-file-id]',
    );
    const files = [];
    for (const fileElement of fileElements) {
      files.push(fileElement.dataset.chatbotuiInputFileId);
    }
    return files;
  }
};

