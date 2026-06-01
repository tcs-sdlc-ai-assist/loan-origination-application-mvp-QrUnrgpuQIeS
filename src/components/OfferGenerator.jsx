import React from 'react';
import PropTypes from 'prop-types';

/**
 * OfferGenerator: UI for displaying preliminary loan offer based on eligibility and application data.
 * Shows offer details: approved amount, rate band, interest rate, term, EMI.
 * Handles rejected cases with reasons.
 * @param {object} props
 * @param {object} props.offer - { status, offer, reasons }
 * @returns {JSX.Element}
 */
function OfferGenerator({ offer }) {
  if (!offer) {
    return (
      <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-gray-600 text-center">
        No offer data available.
      </div>
    );
  }

  if (offer.status === 'Rejected' || !offer.offer) {
    return (
      <div className="bg-red-50 rounded-md p-4 border border-red-200">
        <h3 className="text-lg font-semibold mb-2 text-red-700">Offer Status: Rejected</h3>
        <ul className="list-disc pl-5 text-sm text-red-600">
          {(offer.reasons || ['Not eligible']).map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
        <div className="mt-2 text-xs text-gray-500">
          No preliminary offer generated due to eligibility criteria.
        </div>
      </div>
    );
  }

  const { approvedAmount, rateBand, interestRate, termMonths, emi } = offer.offer;

  return (
    <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
      <h3 className="text-lg font-semibold mb-2 text-blue-700">Preliminary Offer</h3>
      <div className="mb-2">
        <span className="font-medium">Approved Amount:</span> ${approvedAmount?.toLocaleString()}
      </div>
      <div className="mb-2">
        <span className="font-medium">Rate Band:</span> {rateBand}
      </div>
      <div className="mb-2">
        <span className="font-medium">Interest Rate:</span> {(interestRate * 100).toFixed(2)}%
      </div>
      <div className="mb-2">
        <span className="font-medium">Term:</span> {termMonths} months
      </div>
      <div className="mb-2">
        <span className="font-medium">Estimated Monthly Payment (EMI):</span> ${emi?.toLocaleString()}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        This offer is preliminary and for demo purposes.<br />
        No real loan approval is performed.
      </div>
    </div>
  );
}

OfferGenerator.propTypes = {
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

export default OfferGenerator;