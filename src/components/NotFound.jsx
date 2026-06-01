import React from 'react';

/**
 * NotFound: 404 fallback UI for undefined routes.
 * Displays a friendly error message for missing pages.
 * @returns {JSX.Element}
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-semibold text-red-800 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-700 mb-6">
          Sorry, the page you are looking for does not exist.<br />
          Please check the URL or return to the home page.
        </p>
        <a
          href="/"
          className="inline-block py-2 px-4 rounded-md bg-red-600 text-white font-semibold transition hover:bg-red-700"
        >
          Go to Home
        </a>
        <div className="mt-6 text-xs text-gray-500">
          This is a demo 404 page for Loan Origination MVP.<br />
          All navigation is handled locally.
        </div>
      </div>
    </div>
  );
}

export default NotFound;