/**
 * DemoData: Utility for generating and seeding demo/mock data for loan origination MVP.
 * Generates fake users, loan applications, and documents for development/testing.
 */

import { saveApplication, saveUser } from './localStorageRepo';
import { saveDocumentReference } from './documentUploadMock';

/**
 * Generate a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random name.
 * @returns {string}
 */
function randomName() {
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Sara', 'Michael', 'Laura', 'David', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Lee', 'Brown', 'Garcia', 'Martinez', 'Davis', 'Clark', 'Lopez', 'Taylor'];
  return `${firstNames[randomInt(0, firstNames.length - 1)]} ${lastNames[randomInt(0, lastNames.length - 1)]}`;
}

/**
 * Generate a random email for a name.
 * @param {string} name
 * @returns {string}
 */
function randomEmail(name) {
  const domains = ['example.com', 'mail.com', 'demo.org'];
  const emailName = name.toLowerCase().replace(/ /g, '.');
  return `${emailName}@${domains[randomInt(0, domains.length - 1)]}`;
}

/**
 * Generate a random phone number.
 * @returns {string}
 */
function randomPhone() {
  return `${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
}

/**
 * Generate a random SSN.
 * @returns {string}
 */
function randomSSN() {
  return `${randomInt(100, 999)}-${randomInt(10, 99)}-${randomInt(1000, 9999)}`;
}

/**
 * Generate a random address.
 * @returns {string}
 */
function randomAddress() {
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Elm St', 'Cedar Ln'];
  const cities = ['Springfield', 'Riverside', 'Franklin', 'Greenville', 'Madison', 'Clinton'];
  const states = ['CA', 'TX', 'IL', 'NY', 'FL', 'WA'];
  return `${randomInt(100, 9999)} ${streets[randomInt(0, streets.length - 1)]}, ${cities[randomInt(0, cities.length - 1)]}, ${states[randomInt(0, states.length - 1)]} ${randomInt(10000, 99999)}`;
}

/**
 * Generate a fake user.
 * @param {object} opts - { id, role }
 * @returns {object}
 */
export function generateDemoUser(opts = {}) {
  const name = randomName();
  return {
    id: opts.id || randomInt(1000, 9999),
    name,
    email: randomEmail(name),
    phone: randomPhone(),
    ssn: randomSSN(),
    address: randomAddress(),
    role: opts.role || 'customer',
  };
}

/**
 * Generate a fake loan application.
 * @param {object} opts - { id, userId }
 * @returns {object}
 */
export function generateDemoApplication(opts = {}) {
  const creditScore = randomInt(580, 800);
  const annualIncome = randomInt(20000, 120000);
  const monthlyDebt = randomInt(100, 2000);
  const requestedAmount = randomInt(5000, 100000);
  const statusArr = ['Submitted', 'Under Review', 'Pre-Approved', 'Rejected'];
  return {
    id: opts.id || randomInt(10000, 99999),
    userId: opts.userId || randomInt(1000, 9999),
    creditScore,
    annualIncome,
    monthlyDebt,
    requestedAmount,
    status: statusArr[randomInt(0, statusArr.length - 1)],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generate a fake document reference.
 * @param {object} opts - { id, applicationId }
 * @returns {object}
 */
export function generateDemoDocument(opts = {}) {
  const docNames = ['ID Proof.pdf', 'Income Statement.jpg', 'Bank Statement.png', 'Utility Bill.pdf'];
  const types = ['application/pdf', 'image/jpeg', 'image/png'];
  return {
    id: opts.id || randomInt(100000, 999999),
    name: docNames[randomInt(0, docNames.length - 1)],
    type: types[randomInt(0, types.length - 1)],
    size: randomInt(10000, 500000), // bytes
    applicationId: opts.applicationId || randomInt(10000, 99999),
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Seed demo users, applications, and documents into localStorage.
 * @param {number} userCount
 * @param {number} appCountPerUser
 * @param {number} docCountPerApp
 */
export function seedDemoData(userCount = 3, appCountPerUser = 2, docCountPerApp = 2) {
  const users = [];
  for (let u = 0; u < userCount; u++) {
    const user = generateDemoUser({ id: 1000 + u });
    saveUser(user);
    users.push(user);
    for (let a = 0; a < appCountPerUser; a++) {
      const app = generateDemoApplication({ id: 10000 + u * 10 + a, userId: user.id });
      saveApplication(app);
      for (let d = 0; d < docCountPerApp; d++) {
        const doc = generateDemoDocument({ id: 100000 + u * 100 + a * 10 + d, applicationId: app.id });
        saveDocumentReference(doc);
      }
    }
  }
  return users;
}

/**
 * Clear all demo data from localStorage.
 */
export function clearDemoData() {
  try {
    localStorage.clear();
  } catch (e) {
    // ignore errors
  }
}