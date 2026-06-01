import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../context/AppContext';
import { saveApplication } from '../utils/localStorageRepo';
import { checkEligibility } from '../utils/eligibilityCalculator';
import { generateOffer } from '../utils/offerGenerator';

/**
 * IntakeForm: Customer intake form for applicant details.
 * Validates input and saves application to localStorage.
 * Shows eligibility and preliminary offer if valid.
 * @param {object} props
 * @returns {JSX.Element}
 */
function IntakeForm({ onSubmit }) {
  const { user, setApplications } = useAppContext();
  const [form, setForm] = useState({
    creditScore: '',
    annualIncome: '',
    monthlyDebt: '',
    requestedAmount: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.creditScore || isNaN(form.creditScore) || form.creditScore < 300 || form.creditScore > 850) {
      errs.creditScore = 'Credit score must be between 300 and 850';
    }
    if (!form.annualIncome || isNaN(form.annualIncome) || form.annualIncome < 10000) {
      errs.annualIncome = 'Annual income must be at least $10,000';
    }
    if (!form.monthlyDebt || isNaN(form.monthlyDebt) || form.monthlyDebt < 0) {
      errs.monthlyDebt = 'Monthly debt must be 0 or greater';
    }
    if (!form.requestedAmount || isNaN(form.requestedAmount) || form.requestedAmount < 1000) {
      errs.requestedAmount = 'Requested amount must be at least $1,000';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setResult(null);
    try {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        setLoading(false);
        return;
      }
      const application = {
        id: Date.now(),
        userId: user?.id || 'unknown',
        creditScore: Number(form.creditScore),
        annualIncome: Number(form.annualIncome),
        monthlyDebt: Number(form.monthlyDebt),
        requestedAmount: Number(form.requestedAmount),
        status: 'Submitted',
        createdAt: new Date().toISOString(),
      };
      saveApplication(application);
      setApplications(prev => [...prev, application]);
      const eligibility = checkEligibility(application);
      const offer = generateOffer(eligibility, application);
      setResult({ eligibility, offer });
      if (typeof onSubmit === 'function') {
        onSubmit(application, eligibility, offer);
      }
    } catch (err) {
      setErrors({ form: 'Failed to submit application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Loan Application Intake Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score</label>
          <input
            type="number"
            name="creditScore"
            value={form.creditScore}
            onChange={handleChange}
            min={300}
            max={850}
            placeholder="e.g. 700"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
          {errors.creditScore && (
            <div className="text-red-600 text-xs mt-1">{errors.creditScore}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income ($)</label>
          <input
            type="number"
            name="annualIncome"
            value={form.annualIncome}
            onChange={handleChange}
            min={10000}
            placeholder="e.g. 50000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
          {errors.annualIncome && (
            <div className="text-red-600 text-xs mt-1">{errors.annualIncome}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Debt Payments ($)</label>
          <input
            type="number"
            name="monthlyDebt"
            value={form.monthlyDebt}
            onChange={handleChange}
            min={0}
            placeholder="e.g. 500"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
          {errors.monthlyDebt && (
            <div className="text-red-600 text-xs mt-1">{errors.monthlyDebt}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Requested Loan Amount ($)</label>
          <input
            type="number"
            name="requestedAmount"
            value={form.requestedAmount}
            onChange={handleChange}
            min={1000}
            placeholder="e.g. 20000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
          {errors.requestedAmount && (
            <div className="text-red-600 text-xs mt-1">{errors.requestedAmount}</div>
          )}
        </div>
        {errors.form && (
          <div className="text-red-600 text-sm">{errors.form}</div>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      {result && (
        <div className="mt-8 bg-gray-50 rounded-md p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Eligibility Result</h3>
          {result.eligibility.eligible ? (
            <div>
              <div className="text-green-700 font-medium mb-2">Eligible for loan!</div>
              <div className="mb-2">
                <span className="font-medium">Max Eligible Amount:</span> ${result.eligibility.maxAmount.toLocaleString()}
              </div>
              <div className="mb-2">
                <span className="font-medium">Rate Band:</span> {result.eligibility.rateBand}
              </div>
              <h4 className="text-md font-semibold mt-4 mb-2 text-blue-700">Preliminary Offer</h4>
              <div>
                <span className="font-medium">Approved Amount:</span> ${result.offer.offer.approvedAmount.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Interest Rate:</span> {(result.offer.offer.interestRate * 100).toFixed(2)}%
              </div>
              <div>
                <span className="font-medium">Term:</span> {result.offer.offer.termMonths} months
              </div>
              <div>
                <span className="font-medium">Estimated Monthly Payment (EMI):</span> ${result.offer.offer.emi.toLocaleString()}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-red-700 font-medium mb-2">Not eligible for loan.</div>
              <ul className="list-disc pl-5 text-sm text-red-600">
                {result.eligibility.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="mt-6 text-xs text-gray-500 text-center">
        All data is stored locally for demo purposes.<br />
        No real credit check or loan approval is performed.
      </div>
    </div>
  );
}

IntakeForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default IntakeForm;