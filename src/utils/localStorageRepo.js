/**
 * Utility functions for managing loan applications and user data in localStorage.
 * All keys are prefixed to avoid collisions.
 */

const APPLICATIONS_KEY = 'loan_origination_applications';
const USER_KEY = 'loan_origination_user';

/**
 * Get all applications from localStorage.
 * @returns {Array} Array of applications, or empty array if none.
 */
export function getApplications() {
  try {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Get a single application by ID.
 * @param {string|number} id - Application ID
 * @returns {object|null} Application object or null if not found
 */
export function getApplicationById(id) {
  const applications = getApplications();
  return applications.find(app => String(app.id) === String(id)) || null;
}

/**
 * Save (add or update) an application.
 * If the application has an id matching an existing one, it updates it.
 * Otherwise, it adds a new application.
 * @param {object} application - Application object (must have id)
 */
export function saveApplication(application) {
  if (!application || typeof application.id === 'undefined') return;
  const applications = getApplications();
  const idx = applications.findIndex(app => String(app.id) === String(application.id));
  if (idx > -1) {
    applications[idx] = { ...applications[idx], ...application };
  } else {
    applications.push(application);
  }
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  } catch (e) {
    // ignore write errors
  }
}

/**
 * Update application status by ID.
 * @param {string|number} id - Application ID
 * @param {string} status - New status
 * @returns {boolean} True if updated, false if not found
 */
export function updateApplicationStatus(id, status) {
  const applications = getApplications();
  const idx = applications.findIndex(app => String(app.id) === String(id));
  if (idx === -1) return false;
  applications[idx] = { ...applications[idx], status };
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Remove an application by ID.
 * @param {string|number} id - Application ID
 * @returns {boolean} True if removed, false if not found
 */
export function removeApplication(id) {
  const applications = getApplications();
  const filtered = applications.filter(app => String(app.id) !== String(id));
  if (filtered.length === applications.length) return false;
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save user data to localStorage.
 * @param {object} user - User object
 */
export function saveUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    // ignore write errors
  }
}

/**
 * Get user data from localStorage.
 * @returns {object|null} User object or null if not found
 */
export function getUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Remove user data from localStorage.
 */
export function removeUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    // ignore remove errors
  }
}

/**
 * Clear all loan origination data from localStorage.
 */
export function clearAll() {
  try {
    localStorage.removeItem(APPLICATIONS_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    // ignore remove errors
  }
}