/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

/**
 * Class representing a BaseComponent.
 */
export class BaseComponent {
  /**
   * Create a BaseComponent.
   * @param {string} [tagName='div'] - The name of the tag (e.g., 'div', 'button').
   * @param {Date} [timestamp=new Date()] - The timestamp of the baseComponent.
   * @param {HTMLElement} [element=null] - The existing HTML element to use.
   */
  constructor(tagName = "div", timestamp = new Date(), element = null) {
    if (element) {
      this.element = element;
      return;
    }
    this.element = document.createElement(tagName);
    this.element.dataset.chatbotuiType = "BaseComponent";
    this.setTimestamp(timestamp);

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.element.addEventListener("mousedown", (e) => this.onMouseDown(e));
    document.addEventListener("mousemove", (e) => this.onMouseMove(e));
    document.addEventListener("mouseup", (e) => this.onMouseUp(e));
  }

  /**
   * Handle mousedown event.
   * @param {MouseEvent} e - The mousedown event.
   */
  onMouseDown(e) {
    this.isDragging = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  /**
   * Handle mousemove event.
   * @param {MouseEvent} e - The mousemove event.
   */
  onMouseMove(e) {
    if (
      Math.abs(e.clientX - this.startX) > 5 ||
      Math.abs(e.clientY - this.startY) > 5
    ) {
      this.isDragging = true;
    }
  }

  /**
   * Handle mouseup event.
   * @param {MouseEvent} e - The mouseup event.
   */
  onMouseUp(e) {
    if (!this.isDragging) {
      this.toggleSelected();
    }
  }

  /**
   * Toggle the selected state of the component.
   */
  toggleSelected() {
    this.setSelected(!this.isSelected());
  }

  /**
   * Set the selected state of the component.
   * @param {boolean} selected - The selected state to set.
   */
  setSelected(selected) {
    this.element.dataset.chatbotuiSelected = selected;
  }

  /**
   * Check if the component is selected.
   * @returns {boolean} True if the component is selected, otherwise false.
   */
  isSelected() {
    return this.element.dataset.chatbotuiSelected === "true";
  }

  /**
   * Set the timestamp of the baseComponent.
   * @param {Date} timestamp - The timestamp of the baseComponent.
   */
  setTimestamp(timestamp) {
    this.element.dataset.chatbotuiTimestamp = timestamp.getTime();
    this.element.dataset.chatbotuiTimestampLocale = timestamp.toLocaleString();
  }
}

