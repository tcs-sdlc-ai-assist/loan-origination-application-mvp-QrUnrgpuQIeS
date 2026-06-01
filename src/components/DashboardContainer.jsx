import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../context/AppContext';
import { getApplications, getApplicationById, updateApplicationStatus } from '../utils/localStorageRepo';
import { maskPIIObject } from '../utils/piiMasker';

/**
 * DashboardContainer: Main container for internal review dashboard.
 * Handles navigation, application list, and review state.
 * @param {object} props
 * @returns {JSX.Element}
 */
function DashboardContainer({ title }) {
  const { user } = useAppContext();
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [applications, setApplications] = useState(() => getApplications());
  const [reviewStatus, setReviewStatus] = useState('');
  const [error, setError] = useState('');

  const handleSelectApp = (appId) => {
    setSelectedAppId(appId);
    setReviewStatus('');
    setError('');
  };

  const handleStatusChange = (e) => {
    setReviewStatus(e.target.value);
    setError('');
  };

  const handleUpdateStatus = async () => {
    setError('');
    if (!selectedAppId || !reviewStatus) {
      setError('Select an application and status.');
      return;
    }
    try {
      const updated = updateApplicationStatus(selectedAppId, reviewStatus);
      if (!updated) {
        setError('Failed to update status.');
        return;
      }
      setApplications(getApplications());
    } catch (e) {
      setError('Error updating status.');
    }
  };

  const selectedApp = selectedAppId ? getApplicationById(selectedAppId) : null;
  const maskedUser = selectedApp ? maskPIIObject({ name: selectedApp.name, ssn: selectedApp.ssn, address: selectedApp.address }) : {};

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">{title || 'Internal Review Dashboard'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Applications</h3>
            {applications.length === 0 ? (
              <div className="text-gray-500 text-sm">No applications found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {applications.map(app => (
                  <li
                    key={app.id}
                    className={`py-3 px-2 cursor-pointer rounded-md transition ${selectedAppId === app.id ? 'bg-green-100 border border-green-300' : 'hover:bg-green-50'}`}
                    onClick={() => handleSelectApp(app.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-800">App #{app.id}</span>
                        <span className="ml-2 text-xs text-gray-500">{app.status}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ${app.requestedAmount?.toLocaleString()} | Score: {app.creditScore}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Review Details</h3>
            {!selectedApp ? (
              <div className="text-gray-500 text-sm">Select an application to review.</div>
            ) : (
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <div className="mb-2">
                  <span className="font-medium">Application ID:</span> {selectedApp.id}
                </div>
                <div className="mb-2">
                  <span className="font-medium">User ID:</span> {selectedApp.userId}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Credit Score:</span> {selectedApp.creditScore}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Annual Income:</span> ${selectedApp.annualIncome?.toLocaleString()}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Monthly Debt:</span> ${selectedApp.monthlyDebt?.toLocaleString()}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Requested Amount:</span> ${selectedApp.requestedAmount?.toLocaleString()}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Status:</span> {selectedApp.status}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Created At:</span> {selectedApp.createdAt}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  PII Masked: Name: {maskedUser.name || 'N/A'}, SSN: {maskedUser.ssn || 'N/A'}, Address: {maskedUser.address || 'N/A'}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select
                    value={reviewStatus}
                    onChange={handleStatusChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
                  >
                    <option value="">Select status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Pre-Approved">Pre-Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    type="button"
                    className="w-full py-2 px-4 rounded-md bg-green-600 text-white font-semibold transition hover:bg-green-700"
                    onClick={handleUpdateStatus}
                  >
                    Update Status
                  </button>
                  {error && (
                    <div className="text-red-600 text-xs mt-2">{error}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-500 text-center">
          Internal dashboard for reviewing loan applications.<br />
          All data is stored locally for demo purposes.
        </div>
      </div>
    </div>
  );
}

DashboardContainer.propTypes = {
  title: PropTypes.string,
};

export default DashboardContainer;