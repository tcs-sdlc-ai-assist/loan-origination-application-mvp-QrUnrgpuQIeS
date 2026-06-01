import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getApplications } from '../utils/localStorageRepo';

/**
 * ApplicationList: Displays list of loan applications for ops team review.
 * Supports sorting and filtering by status, amount, and credit score.
 * @param {object} props
 * @param {function} props.onSelect - Callback when an application is selected (id)
 * @returns {JSX.Element}
 */
function ApplicationList({ onSelect }) {
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState(() => getApplications());

  // Refresh applications from localStorage
  const handleRefresh = () => {
    setApplications(getApplications());
  };

  // Filtering and sorting logic
  const filteredApps = useMemo(() => {
    let apps = [...applications];
    if (filterStatus) {
      apps = apps.filter(app => app.status === filterStatus);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      apps = apps.filter(app =>
        String(app.id).includes(s) ||
        String(app.userId).includes(s) ||
        String(app.creditScore).includes(s)
      );
    }
    apps.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'createdAt') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return apps;
  }, [applications, filterStatus, sortField, sortOrder, search]);

  const statusOptions = ['Submitted', 'Under Review', 'Pre-Approved', 'Rejected'];

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Loan Applications</h3>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <div className="flex space-x-2">
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="createdAt">Created At</option>
              <option value="requestedAmount">Requested Amount</option>
              <option value="creditScore">Credit Score</option>
            </select>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="App ID, User ID, Credit Score"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          className="py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      {filteredApps.length === 0 ? (
        <div className="text-gray-500 text-sm text-center mt-6">No applications found.</div>
      ) : (
        <table className="w-full mt-4 border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">App ID</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">User ID</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Credit Score</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Annual Income</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Requested Amount</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app.id} className="hover:bg-blue-50 transition">
                <td className="py-2 px-3 text-sm text-gray-800">{app.id}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{app.userId}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{app.creditScore}</td>
                <td className="py-2 px-3 text-sm text-gray-800">${app.annualIncome?.toLocaleString()}</td>
                <td className="py-2 px-3 text-sm text-gray-800">${app.requestedAmount?.toLocaleString()}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{app.status}</td>
                <td className="py-2 px-3 text-xs text-gray-500">{app.createdAt}</td>
                <td className="py-2 px-3">
                  <button
                    type="button"
                    className="py-1 px-3 rounded-md bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition"
                    onClick={() => typeof onSelect === 'function' && onSelect(app.id)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6 text-xs text-gray-500 text-center">
        Applications are stored locally for demo purposes.<br />
        No real loan processing is performed.
      </div>
    </div>
  );
}

ApplicationList.propTypes = {
  onSelect: PropTypes.func,
};

export default ApplicationList;