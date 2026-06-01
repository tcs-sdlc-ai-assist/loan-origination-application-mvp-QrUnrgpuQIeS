/**
 * OfferGenerator: Generates preliminary loan offer from eligibility and application data.
 * Calculates status, approved loan amount, EMI (monthly payment), and rate band.
 *
 * Rules:
 * - If not eligible, status = "Rejected", offer = null
 * - If eligible, status = "Pre-Approved", offer includes:
 *   - approvedAmount: min(requestedAmount, maxAmount)
 *   - rateBand: from eligibility
 *   - interestRate: mapped from rateBand
 *   - termMonths: default 60 (5 years)
 *   - emi: calculated using approvedAmount, interestRate, termMonths
 */

/**
 * Map rate band to interest rate (example values).
 * @param {string} rateBand
 * @returns {number} Annual interest rate (as decimal)
 */
function getInterestRate(rateBand) {
  switch (rateBand) {
    case 'A':
      return 0.049; // 4.9%
    case 'B':
      return 0.059; // 5.9%
    case 'C':
      return 0.069; // 6.9%
    case 'D':
      return 0.089; // 8.9%
    default:
      return 0.099; // fallback 9.9%
  }
}

/**
 * Calculate EMI (monthly payment) for a loan.
 * Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (decimal)
 * @param {number} termMonths - Number of months
 * @returns {number} EMI (rounded to 2 decimals)
 */
function calculateEMI(principal, annualRate, termMonths) {
  if (!principal || !annualRate || !termMonths) return 0;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return +(principal / termMonths).toFixed(2);
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  const emi = numerator / denominator;
  return +emi.toFixed(2);
}

/**
 * Generate preliminary loan offer.
 * @param {object} eligibility - { eligible, maxAmount, rateBand }
 * @param {object} application - { requestedAmount }
 * @returns {object} Offer object:
 *   - status: "Pre-Approved" | "Rejected"
 *   - offer: { approvedAmount, rateBand, interestRate, termMonths, emi } | null
 *   - reasons: array (if rejected)
 */
export function generateOffer(eligibility, application) {
  if (!eligibility || typeof eligibility.eligible !== 'boolean') {
    return {
      status: 'Rejected',
      offer: null,
      reasons: ['Eligibility check failed'],
    };
  }
  if (!eligibility.eligible) {
    return {
      status: 'Rejected',
      offer: null,
      reasons: eligibility.reasons || ['Not eligible'],
    };
  }
  const approvedAmount = Math.min(
    Number(application?.requestedAmount || 0),
    Number(eligibility.maxAmount || 0)
  );
  const rateBand = eligibility.rateBand || 'D';
  const interestRate = getInterestRate(rateBand);
  const termMonths = 60; // Default 5 years
  const emi = calculateEMI(approvedAmount, interestRate, termMonths);

  return {
    status: 'Pre-Approved',
    offer: {
      approvedAmount,
      rateBand,
      interestRate,
      termMonths,
      emi,
    },
    reasons: [],
  };
}