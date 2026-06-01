import React from 'react';
import PropTypes from 'prop-types';

/**
 * Route configuration for Loan Origination MVP.
 * Each route object contains:
 * - path: string (URL path)
 * - element: React component to render
 * - title: string (optional, for display)
 */
export const routes = [
  {
    path: '/',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Loan Origination MVP</h1>
      </div>
    ),
    title: 'Home',
  },
  {
    path: '/customer-dashboard',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <h2 className="text-2xl font-semibold text-blue-800">Customer Dashboard</h2>
      </div>
    ),
    title: 'Customer Dashboard',
  },
  {
    path: '/internal-dashboard',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <h2 className="text-2xl font-semibold text-green-800">Internal Dashboard</h2>
      </div>
    ),
    title: 'Internal Dashboard',
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <h2 className="text-2xl font-semibold text-red-800">404 - Page Not Found</h2>
      </div>
    ),
    title: 'Not Found',
  },
];

export function RouteRenderer({ path }) {
  const route = routes.find(r => r.path === path) || routes.find(r => r.path === '*');
  return route.element;
}

RouteRenderer.propTypes = {
  path: PropTypes.string.isRequired,
};