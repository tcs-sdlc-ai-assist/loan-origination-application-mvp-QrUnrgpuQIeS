import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { updateApplicationStatus, getApplicationById } from '../utils/localStorageRepo';

/**
 * ActionControls: Approve/reject/request info controls for application status updates.
 * Used by ops team to update application status and add notes.
 * @param {object} props
 * @param {string|number} props.applicationId - Application ID to update
 * @param {function} props.onStatusChange - Callback after status update (newStatus)
 * @returns {JSX.Element}
 */
function ActionControls({ applicationId, onStatusChange }) {
  const [action, setAction] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statusOptions = [
    { value: 'Pre-Approved', label: 'Approve' },
    { value: 'Rejected', label: 'Reject' },
    { value: 'Info Requested', label: 'Request Info' },
  ];

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (!action) {
        setError('Select an action.');
        setLoading(false);
        return;
      }
      const app = getApplicationById(applicationId);
      if (!app) {
        setError('Application not found.');
        setLoading(false);
        return;
      }
      const updated = updateApplicationStatus(applicationId, action);
      if (!updated) {
        setError('Failed to update status.');
        setLoading(false);
        return;
      }
      // Optionally, store note in localStorage (not implemented in repo)
      setSuccess(`Status updated to "${action}".`);
      setAction('');
      setNote('');
      if (typeof onStatusChange === 'function') {
        onStatusChange(action, note);
      }
    } catch (err) {
      setError('Error updating status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Status Actions</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Action</label>
          <select
            value={action}
            onChange={handleActionChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            <option value="">Choose...</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Note (optional)</label>
          <textarea
            value={note}
            onChange={handleNoteChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a note for the applicant or internal team"
            disabled={loading}
          />
        </div>
        {error && (
          <div className="text-red-600 text-xs">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-xs">{success}</div>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </button>
      </form>
      <div className="mt-6 text-xs text-gray-500 text-center">
        Actions update application status locally for demo purposes.<br />
        No real loan processing is performed.
      </div>
    </div>
  );
}

ActionControls.propTypes = {
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onStatusChange: PropTypes.func,
};

export default ActionControls;