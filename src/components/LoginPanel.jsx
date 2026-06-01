import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../context/AppContext';
import { generateDemoUser } from '../utils/demoData';
import { saveUser } from '../utils/localStorageRepo';

/**
 * LoginPanel: Simulated login/signup UI for customer and ops team.
 * Sets user context for demo purposes.
 * @param {object} props
 * @returns {JSX.Element}
 */
function LoginPanel({ onLogin }) {
  const { setUser } = useAppContext();
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError('');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (name.trim()) {
        user = generateDemoUser({ name: name.trim(), role });
      } else {
        user = generateDemoUser({ role });
      }
      setUser(user);
      saveUser(user);
      if (typeof onLogin === 'function') {
        onLogin(user);
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Demo Login</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === 'customer'}
                onChange={handleRoleChange}
                className="mr-2"
              />
              Customer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="internal"
                checked={role === 'internal'}
                onChange={handleRoleChange}
                className="mr-2"
              />
              Internal Ops
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name (optional)</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-6 text-xs text-gray-500 text-center">
        This is a simulated login for demo purposes.<br />
        No real authentication is performed.
      </div>
    </div>
  );
}

LoginPanel.propTypes = {
  onLogin: PropTypes.func,
};

export default LoginPanel;