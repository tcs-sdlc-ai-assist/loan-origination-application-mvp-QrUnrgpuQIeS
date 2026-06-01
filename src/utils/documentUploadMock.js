/**
 * DocumentUploadMock: Mocked document upload logic for loan origination MVP.
 * Validates file type and size, stores document references in localStorage.
 * No actual file upload; only metadata is stored.
 */

const DOCUMENTS_KEY = 'loan_origination_documents';

/**
 * Allowed file types for upload.
 */
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

/**
 * Max file size in bytes (5MB).
 */
const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Validate file type and size.
 * @param {File} file
 * @returns {object} { valid: boolean, reason: string }
 */
export function validateDocument(file) {
  if (!file) {
    return { valid: false, reason: 'No file provided' };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, reason: 'Unsupported file type' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, reason: 'File exceeds maximum size (5MB)' };
  }
  return { valid: true, reason: '' };
}

/**
 * Store document reference in localStorage.
 * Only stores metadata: id, name, type, size, applicationId, uploadedAt.
 * @param {object} docMeta - { id, name, type, size, applicationId }
 */
export function saveDocumentReference(docMeta) {
  if (!docMeta || typeof docMeta.id === 'undefined') return;
  const docs = getDocumentReferences();
  docs.push({
    ...docMeta,
    uploadedAt: new Date().toISOString(),
  });
  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
  } catch (e) {
    // ignore write errors
  }
}

/**
 * Get all document references from localStorage.
 * @returns {Array} Array of document metadata
 */
export function getDocumentReferences() {
  try {
    const data = localStorage.getItem(DOCUMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Get document references for a specific application.
 * @param {string|number} applicationId
 * @returns {Array} Array of document metadata
 */
export function getDocumentsByApplication(applicationId) {
  const docs = getDocumentReferences();
  return docs.filter(doc => String(doc.applicationId) === String(applicationId));
}

/**
 * Remove a document reference by ID.
 * @param {string|number} id
 * @returns {boolean} True if removed, false if not found
 */
export function removeDocumentReference(id) {
  const docs = getDocumentReferences();
  const filtered = docs.filter(doc => String(doc.id) !== String(id));
  if (filtered.length === docs.length) return false;
  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Clear all document references from localStorage.
 */
export function clearDocuments() {
  try {
    localStorage.removeItem(DOCUMENTS_KEY);
  } catch (e) {
    // ignore remove errors
  }
}