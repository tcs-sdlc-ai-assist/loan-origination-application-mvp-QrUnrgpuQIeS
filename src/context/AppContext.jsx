import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

/**
 * AppProvider wraps the app and provides global state.
 * State includes:
 * - user: { id, name, role } | null
 * - applications: array of loan applications
 * - setUser: function to update user
 * - setApplications: function to update applications
 */
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

  const value = {
    user,
    setUser,
    applications,
    setApplications,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useAppContext hook to access global app state.
 * @returns {object} app context value
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}