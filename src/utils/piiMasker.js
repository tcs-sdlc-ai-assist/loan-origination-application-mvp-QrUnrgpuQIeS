/**
 * PIIMasker: Utility for masking PII fields in logs and UI.
 * Supports masking email, phone, SSN, name, address, and generic fields.
 */

/**
 * Mask an email address, showing first char and domain.
 * e.g. "johndoe@example.com" => "j*******@example.com"
 * @param {string} email
 * @returns {string}
 */
export function maskEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  if (!local || !domain) return '';
  if (local.length < 2) return `*@${domain}`;
  return `${local[0]}${'*'.repeat(local.length - 1)}@${domain}`;
}

/**
 * Mask a phone number, showing last 2 digits.
 * e.g. "123-456-7890" => "***-***-**90"
 * @param {string} phone
 * @returns {string}
 */
export function maskPhone(phone) {
  if (typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '*'.repeat(digits.length);
  const masked = '*'.repeat(digits.length - 2) + digits.slice(-2);
  // Re-insert formatting if possible
  if (digits.length === 10) {
    return `***-***-**${digits.slice(-2)}`;
  }
  return masked;
}

/**
 * Mask SSN, showing only last 4 digits.
 * e.g. "123-45-6789" => "***-**-6789"
 * @param {string} ssn
 * @returns {string}
 */
export function maskSSN(ssn) {
  if (typeof ssn !== 'string') return '';
  const digits = ssn.replace(/\D/g, '');
  if (digits.length !== 9) return '*'.repeat(digits.length);
  return `***-**-${digits.slice(-4)}`;
}

/**
 * Mask a name, showing first letter and masking rest.
 * e.g. "John Doe" => "J*** D**"
 * @param {string} name
 * @returns {string}
 */
export function maskName(name) {
  if (typeof name !== 'string') return '';
  return name
    .split(' ')
    .map(part => {
      if (!part) return '';
      if (part.length < 2) return '*';
      return `${part[0]}${'*'.repeat(part.length - 1)}`;
    })
    .join(' ');
}

/**
 * Mask an address, showing only city and state if possible.
 * e.g. "123 Main St, Springfield, IL 62704" => "***, Springfield, IL"
 * @param {string} address
 * @returns {string}
 */
export function maskAddress(address) {
  if (typeof address !== 'string') return '';
  const parts = address.split(',');
  if (parts.length < 2) return '***';
  // Mask street, show city/state
  return `***,${parts.slice(1).join(',')}`.trim();
}

/**
 * Mask generic string, showing only first char and masking rest.
 * e.g. "abcdef" => "a*****"
 * @param {string} value
 * @returns {string}
 */
export function maskGeneric(value) {
  if (typeof value !== 'string') return '';
  if (value.length < 2) return '*';
  return `${value[0]}${'*'.repeat(value.length - 1)}`;
}

/**
 * Mask PII fields in an object.
 * Supported keys: email, phone, ssn, name, address
 * @param {object} obj
 * @returns {object} masked object
 */
export function maskPIIObject(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const masked = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    if (key.toLowerCase().includes('email')) {
      masked[key] = maskEmail(value);
    } else if (key.toLowerCase().includes('phone')) {
      masked[key] = maskPhone(value);
    } else if (key.toLowerCase().includes('ssn')) {
      masked[key] = maskSSN(value);
    } else if (key.toLowerCase().includes('name')) {
      masked[key] = maskName(value);
    } else if (key.toLowerCase().includes('address')) {
      masked[key] = maskAddress(value);
    } else {
      masked[key] = maskGeneric(value);
    }
  }
  return masked;
}