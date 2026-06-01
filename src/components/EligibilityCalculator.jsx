import React from 'react';
import PropTypes from 'prop-types';

/**
 * EligibilityCalculator: UI for displaying eligibility results based on intake form data.
 * Shows eligibility status, reasons, max eligible amount, rate band, and preliminary offer.
 * @param {object} props
 * @param {object} props.eligibility - { eligible, reasons, maxAmount, rateBand }
 * @param {object} props.offer - { status, offer, reasons }
 * @returns {JSX.Element}
 */
function EligibilityCalculator({ eligibility, offer }) {
  if (!eligibility) {
    return (
      <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-gray-600 text-center">
        No eligibility data available.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Eligibility Result</h3>
      {eligibility.eligible ? (
        <div>
          <div className="text-green-700 font-medium mb-2">Eligible for loan!</div>
          <div className="mb-2">
            <span className="font-medium">Max Eligible Amount:</span> ${eligibility.maxAmount?.toLocaleString()}
          </div>
          <div className="mb-2">
            <span className="font-medium">Rate Band:</span> {eligibility.rateBand}
          </div>
          {offer && offer.status === 'Pre-Approved' && offer.offer && (
            <div>
              <h4 className="text-md font-semibold mt-4 mb-2 text-blue-700">Preliminary Offer</h4>
              <div>
                <span className="font-medium">Approved Amount:</span> ${offer.offer.approvedAmount?.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Interest Rate:</span> {(offer.offer.interestRate * 100).toFixed(2)}%
              </div>
              <div>
                <span className="font-medium">Term:</span> {offer.offer.termMonths} months
              </div>
              <div>
                <span className="font-medium">Estimated Monthly Payment (EMI):</span> ${offer.offer.emi?.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="text-red-700 font-medium mb-2">Not eligible for loan.</div>
          <ul className="list-disc pl-5 text-sm text-red-600">
            {(eligibility.reasons || []).map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
          {offer && offer.status === 'Rejected' && offer.reasons && (
            <div className="mt-2 text-xs text-red-500">
              {offer.reasons.map((reason, idx) => (
                <div key={idx}>{reason}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

EligibilityCalculator.propTypes = {
  eligibility: PropTypes.shape({
    eligible: PropTypes.bool,
    reasons: PropTypes.arrayOf(PropTypes.string),
    maxAmount: PropTypes.number,
    rateBand: PropTypes.string,
  }),
  offer: PropTypes.shape({
    status: PropTypes.string,
    offer: PropTypes.shape({
      approvedAmount: PropTypes.number,
      rateBand: PropTypes.string,
      interestRate: PropTypes.number,
      termMonths: PropTypes.number,
      emi: PropTypes.number,
    }),
    reasons: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default EligibilityCalculator;