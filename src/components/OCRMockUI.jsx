import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * OCRMockUI: UI placeholder for OCR extraction with static/mock results and manual fallback.
 * Allows user to "extract" data from uploaded document (mocked), shows static results,
 * and provides manual entry fallback.
 * @param {object} props
 * @param {string|number} props.applicationId - Loan application ID (for context)
 * @returns {JSX.Element}
 */
function OCRMockUI({ applicationId }) {
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle | extracting | done | error
  const [ocrResult, setOcrResult] = useState(null);
  const [manualData, setManualData] = useState({
    name: '',
    ssn: '',
    income: '',
  });
  const [manualMode, setManualMode] = useState(false);
  const [error, setError] = useState('');

  // Mocked OCR extraction
  const handleExtract = async () => {
    setOcrStatus('extracting');
    setError('');
    setOcrResult(null);
    setManualMode(false);
    // Simulate async extraction
    setTimeout(() => {
      // Static/mock result
      setOcrStatus('done');
      setOcrResult({
        name: 'John Doe',
        ssn: '123-45-6789',
        income: '$55,000',
        confidence: 0.92,
      });
    }, 1200);
  };

  const handleManualMode = () => {
    setManualMode(true);
    setOcrStatus('idle');
    setOcrResult(null);
    setError('');
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualData.name || !manualData.ssn || !manualData.income) {
      setError('All fields are required.');
      return;
    }
    setOcrResult({
      ...manualData,
      confidence: null,
    });
    setManualMode(false);
    setOcrStatus('done');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">OCR Extraction (Mocked)</h3>
      {!manualMode && (
        <div className="space-y-4">
          <button
            type="button"
            className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700 ${ocrStatus === 'extracting' ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={ocrStatus === 'extracting'}
            onClick={handleExtract}
          >
            {ocrStatus === 'extracting' ? 'Extracting...' : 'Extract Data from Document'}
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-md bg-gray-500 text-white font-semibold transition hover:bg-gray-700"
            onClick={handleManualMode}
            disabled={ocrStatus === 'extracting'}
          >
            Enter Data Manually
          </button>
        </div>
      )}
      {ocrStatus === 'done' && ocrResult && (
        <div className="mt-6 bg-gray-50 rounded-md p-4 border border-gray-200">
          <h4 className="text-md font-semibold mb-2 text-gray-700">Extracted Data</h4>
          <div className="mb-1">
            <span className="font-medium">Name:</span> <span className="text-gray-800">{ocrResult.name}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">SSN:</span> <span className="text-gray-800">{ocrResult.ssn}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">Income:</span> <span className="text-gray-800">{ocrResult.income}</span>
          </div>
          {ocrResult.confidence !== null && (
            <div className="mb-1">
              <span className="font-medium">Confidence:</span> <span className="text-green-700">{(ocrResult.confidence * 100).toFixed(1)}%</span>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Data extracted from document (mocked).<br />
            No real OCR performed.
          </div>
        </div>
      )}
      {manualMode && (
        <form onSubmit={handleManualSubmit} className="mt-6 space-y-4">
          <h4 className="text-md font-semibold mb-2 text-gray-700 text-center">Manual Data Entry</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={manualData.name}
              onChange={handleManualChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SSN</label>
            <input
              type="text"
              name="ssn"
              value={manualData.ssn}
              onChange={handleManualChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              placeholder="e.g. 123-45-6789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income ($)</label>
            <input
              type="text"
              name="income"
              value={manualData.income}
              onChange={handleManualChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              placeholder="e.g. 55000"
            />
          </div>
          {error && (
            <div className="text-red-600 text-xs">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700"
          >
            Save Data
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-md bg-gray-500 text-white font-semibold transition hover:bg-gray-700"
            onClick={() => setManualMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
      <div className="mt-6 text-xs text-gray-500 text-center">
        OCR extraction is simulated for demo purposes.<br />
        No real document processing is performed.
      </div>
    </div>
  );
}

OCRMockUI.propTypes = {
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default OCRMockUI;