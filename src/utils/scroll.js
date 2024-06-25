/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Check if an element is visible in the viewport.
 * @param {HTMLElement} e - The element to check visibility for.
 * @returns {boolean} True if the element is visible, otherwise false.
 */
const visible = (e) =>
  e.getBoundingClientRect().bottom <=
  (window.innerHeight || document.documentElement.clientHeight) + 2;

/**
 * Throttle a function, ensuring it is only called once per specified limit.
 * @param {function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {function} A throttled version of the input function.
 */
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;

  return function (...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
};

/**
 * Create a smooth scroll down function.
 * @param {HTMLElement} checkElement - The element to check visibility for.
 * @param {HTMLElement} scrollElement - The element to scroll.
 * @returns {function} A throttled function that scrolls down smoothly if the check element is not visible.
 */
export const createSmoothScrollDownFunction = (checkElement, scrollElement) => {
  return throttle(() => {
    if (!visible(checkElement)) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, 250);
};

