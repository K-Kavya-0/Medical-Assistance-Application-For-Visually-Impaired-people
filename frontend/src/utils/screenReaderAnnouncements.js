/**
 * Utilities for screen reader announcements and accessibility announcements
 */

// Create a singleton div for live region announcements
let liveRegion = null;

const getLiveRegion = () => {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('aria-relevant', 'additions text');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
};

/**
 * Announce text to screen readers
 * @param {string} text - The text to announce
 * @param {boolean} assertive - If true, uses assertive role instead of polite
 */
export const announceToScreenReader = (text, assertive = false) => {
  const region = getLiveRegion();
  region.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  region.textContent = text;
  
  // Clear after announcement
  setTimeout(() => {
    region.textContent = '';
  }, 1000);
};

/**
 * Announce a success message
 */
export const announceSuccess = (text) => {
  announceToScreenReader(`Success: ${text}`, false);
};

/**
 * Announce an error message
 */
export const announceError = (text) => {
  announceToScreenReader(`Error: ${text}`, true);
};

/**
 * Announce navigation
 */
export const announceNavigation = (text) => {
  announceToScreenReader(`Navigated to: ${text}`, false);
};

/**
 * Announce page load
 */
export const announcePageLoad = (pageTitle) => {
  announceToScreenReader(`${pageTitle} page loaded. Use arrow keys to navigate and Enter to activate.`, false);
};

/**
 * Announce form submission
 */
export const announceFormSubmission = (formName) => {
  announceToScreenReader(`${formName} form submitted successfully.`, false);
};

/**
 * Announce data update
 */
export const announceDataUpdate = (dataType, count) => {
  announceToScreenReader(`${dataType} updated. Now showing ${count} items.`, false);
};

/**
 * Set focus and announce
 */
export const setFocusAndAnnounce = (element, text) => {
  if (element) {
    element.focus();
    announceToScreenReader(text, false);
  }
};

/**
 * Create a more descriptive label for an element
 */
export const getAriaLabel = (primaryText, secondaryText = '', count = null) => {
  let label = primaryText;
  if (secondaryText) {
    label += `, ${secondaryText}`;
  }
  if (count !== null && count !== undefined) {
    label += `, ${count} items`;
  }
  return label;
};

/**
 * Format number for screen readers
 */
export const formatNumberForScreenReader = (number) => {
  if (typeof number !== 'number') return number;
  return new Intl.NumberFormat('en-US').format(number);
};

/**
 * Get accessible status text
 */
export const getStatusText = (status) => {
  const statusMap = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    pending: 'Pending',
    completed: 'Completed',
    active: 'Active',
    inactive: 'Inactive',
  };
  return statusMap[status] || status;
};
