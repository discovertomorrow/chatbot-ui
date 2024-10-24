/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Throttle a function, ensuring it is only called once per specified limit.
 * @param {function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {function} A throttled version of the input function.
 */
const throttle = (func, limit) => {
  let blocked = false;

  return function (...args) {
    if (!blocked) {
      blocked = true;
      func(...args);
      setTimeout(() => {
        blocked = false;
      }, limit);
    }
  };
};

/**
 * Create a smooth scroll down function.
 * @param {HTMLElement} checkElement - The element to check visibility for.
 * @param {HTMLElement} scrollElement - The element to scroll.
 * @returns {function} A throttled function that scrolls down smoothly if the check element is not visible.
 */
export const createSmoothScrollDownFunction = (scrollElement) => {
  return throttle(() => {
    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior: "smooth",
    });
  }, 500);
};

