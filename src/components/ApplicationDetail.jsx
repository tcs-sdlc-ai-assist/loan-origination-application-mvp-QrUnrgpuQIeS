import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getApplicationById } from '../utils/localStorageRepo';
import { checkEligibility } from '../utils/eligibilityCalculator';
import { generateOffer } from '../utils/offerGenerator';
import { maskPIIObject } from '../utils/piiMasker';
import { getDocumentsByApplication } from '../utils/documentUploadMock';
import EligibilityCalculator from './EligibilityCalculator';
import OfferGenerator from './OfferGenerator';

/**
 * ApplicationDetail: Shows full application, eligibility, documents, and status.
 * For ops team review.
 * @param {object} props
 * @param {string|number} props.applicationId - Application ID to show details for
 * @returns {JSX.Element}
 */
function ApplicationDetail({ applicationId }) {
  const [application, setApplication] = useState(null);
  const [maskedUser, setMaskedUser] = useState({});
  const [eligibility, setEligibility] = useState(null);
  const [offer, setOffer] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const app = getApplicationById(applicationId);
      if (!app) {
        setError('Application not found.');
        setApplication(null);
        setEligibility(null);
        setOffer(null);
        setDocuments([]);
        setMaskedUser({});
        setLoading(false);
        return;
      }
      setApplication(app);
      setMaskedUser(maskPIIObject({
        name: app.name,
        ssn: app.ssn,
        address: app.address,
        email: app.email,
        phone: app.phone,
      }));
      const elig = checkEligibility(app);
      setEligibility(elig);
      setOffer(generateOffer(elig, app));
      setDocuments(getDocumentsByApplication(app.id));
    } catch (e) {
      setError('Failed to load application details.');
      setApplication(null);
      setEligibility(null);
      setOffer(null);
      setDocuments([]);
      setMaskedUser({});
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6 text-center text-gray-600">
        Loading application details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-red-50 rounded-lg shadow-lg p-6 text-center text-red-700">
        {error}
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-gray-50 rounded-lg shadow-lg p-6 text-center text-gray-600">
        No application found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Application Detail</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Application Info</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="font-medium">Application ID:</span> {application.id}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {application.userId}
          </div>
          <div>
            <span className="font-medium">Credit Score:</span> {application.creditScore}
          </div>
          <div>
            <span className="font-medium">Annual Income:</span> ${application.annualIncome?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Monthly Debt:</span> ${application.monthlyDebt?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Requested Amount:</span> ${application.requestedAmount?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Status:</span> {application.status}
          </div>
          <div>
            <span className="font-medium">Created At:</span> {application.createdAt}
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          PII Masked: Name: {maskedUser.name || 'N/A'}, SSN: {maskedUser.ssn || 'N/A'}, Address: {maskedUser.address || 'N/A'}, Email: {maskedUser.email || 'N/A'}, Phone: {maskedUser.phone || 'N/A'}
        </div>
      </div>
      <div className="mb-6">
        <EligibilityCalculator eligibility={eligibility} offer={offer} />
      </div>
      <div className="mb-6">
        <OfferGenerator offer={offer} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Uploaded Documents</h3>
        {documents.length === 0 ? (
          <div className="text-gray-500 text-sm">No documents uploaded.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {documents.map(doc => (
              <li key={doc.id} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium text-gray-800">{doc.name}</span>
                  <span className="ml-2 text-xs text-gray-500">{doc.type}</span>
                  <span className="ml-2 text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</span>
                </div>
                <span className="ml-4 text-xs text-gray-400">{doc.uploadedAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6 text-xs text-gray-500 text-center">
        All data is stored locally for demo purposes.<br />
        No real loan processing or document storage is performed.
      </div>
    </div>
  );
}

ApplicationDetail.propTypes = {
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ApplicationDetail;