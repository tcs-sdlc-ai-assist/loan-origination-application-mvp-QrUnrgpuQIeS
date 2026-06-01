/**
 * EligibilityCalculator: Rule-based eligibility logic for loan origination.
 * Calculates eligibility for loan amount, rate band, and approval status.
 *
 * Rules (example, can be extended):
 * - Min credit score: 600
 * - Max debt-to-income ratio: 0.45
 * - Min annual income: $25,000
 * - Loan amount: max 5x annual income, capped at $250,000
 * - Rate band: based on credit score
 * - Approval: must meet all criteria
 */

/**
 * Calculate debt-to-income ratio.
 * @param {number} monthlyDebt - Total monthly debt payments
 * @param {number} monthlyIncome - Gross monthly income
 * @returns {number} DTI ratio (0-1)
 */
export function calculateDTI(monthlyDebt, monthlyIncome) {
  if (!monthlyIncome || monthlyIncome <= 0) return 1;
  return monthlyDebt / monthlyIncome;
}

/**
 * Determine rate band based on credit score.
 * @param {number} creditScore
 * @returns {string} Rate band ("A", "B", "C", "D")
 */
export function getRateBand(creditScore) {
  if (creditScore >= 750) return 'A';
  if (creditScore >= 700) return 'B';
  if (creditScore >= 650) return 'C';
  return 'D';
}

/**
 * Calculate max eligible loan amount.
 * @param {number} annualIncome
 * @returns {number} Max loan amount (capped at $250,000)
 */
export function getMaxLoanAmount(annualIncome) {
  if (!annualIncome || annualIncome <= 0) return 0;
  const max = annualIncome * 5;
  return Math.min(max, 250000);
}

/**
 * Check eligibility for loan application.
 * @param {object} application - { creditScore, annualIncome, monthlyDebt, requestedAmount }
 * @returns {object} { eligible: boolean, reasons: array, maxAmount: number, rateBand: string }
 */
export function checkEligibility(application) {
  const reasons = [];
  const minCreditScore = 600;
  const maxDTI = 0.45;
  const minIncome = 25000;

  const {
    creditScore = 0,
    annualIncome = 0,
    monthlyDebt = 0,
    requestedAmount = 0,
  } = application || {};

  if (creditScore < minCreditScore) {
    reasons.push('Credit score below minimum threshold');
  }
  if (annualIncome < minIncome) {
    reasons.push('Annual income below minimum required');
  }
  const monthlyIncome = annualIncome / 12;
  const dti = calculateDTI(monthlyDebt, monthlyIncome);
  if (dti > maxDTI) {
    reasons.push('Debt-to-income ratio exceeds maximum allowed');
  }

  const maxAmount = getMaxLoanAmount(annualIncome);
  if (requestedAmount > maxAmount) {
    reasons.push('Requested amount exceeds eligible maximum');
  }

  const rateBand = getRateBand(creditScore);

  const eligible = reasons.length === 0;

  return {
    eligible,
    reasons,
    maxAmount,
    rateBand,
  };
}