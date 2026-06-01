import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * CreditBureauMockUI: UI placeholder for credit bureau check with static/mock results.
 * Allows user to "run" a credit bureau check (mocked), shows static results,
 * and provides manual entry fallback.
 * @param {object} props
 * @param {string|number} props.applicationId - Loan application ID (for context)
 * @returns {JSX.Element}
 */
function CreditBureauMockUI({ applicationId }) {
  const [cbStatus, setCbStatus] = useState('idle'); // idle | checking | done | error
  const [cbResult, setCbResult] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    creditScore: '',
    tradelines: '',
    delinquencies: '',
  });
  const [error, setError] = useState('');

  // Mocked credit bureau check
  const handleCheck = async () => {
    setCbStatus('checking');
    setError('');
    setCbResult(null);
    setManualMode(false);
    setTimeout(() => {
      setCbStatus('done');
      setCbResult({
        creditScore: 720,
        tradelines: 6,
        delinquencies: 0,
        bureau: 'TransUnion',
        confidence: 0.97,
        checkedAt: new Date().toLocaleString(),
      });
    }, 1200);
  };

  const handleManualMode = () => {
    setManualMode(true);
    setCbStatus('idle');
    setCbResult(null);
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
    if (
      !manualData.creditScore ||
      isNaN(manualData.creditScore) ||
      !manualData.tradelines ||
      isNaN(manualData.tradelines) ||
      manualData.delinquencies === '' ||
      isNaN(manualData.delinquencies)
    ) {
      setError('All fields are required and must be valid numbers.');
      return;
    }
    setCbResult({
      creditScore: Number(manualData.creditScore),
      tradelines: Number(manualData.tradelines),
      delinquencies: Number(manualData.delinquencies),
      bureau: 'Manual Entry',
      confidence: null,
      checkedAt: new Date().toLocaleString(),
    });
    setManualMode(false);
    setCbStatus('done');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Credit Bureau Check (Mocked)</h3>
      {!manualMode && (
        <div className="space-y-4">
          <button
            type="button"
            className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700 ${cbStatus === 'checking' ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={cbStatus === 'checking'}
            onClick={handleCheck}
          >
            {cbStatus === 'checking' ? 'Checking...' : 'Run Credit Bureau Check'}
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-md bg-gray-500 text-white font-semibold transition hover:bg-gray-700"
            onClick={handleManualMode}
            disabled={cbStatus === 'checking'}
          >
            Enter Data Manually
          </button>
        </div>
      )}
      {cbStatus === 'done' && cbResult && (
        <div className="mt-6 bg-gray-50 rounded-md p-4 border border-gray-200">
          <h4 className="text-md font-semibold mb-2 text-gray-700">Credit Bureau Result</h4>
          <div className="mb-1">
            <span className="font-medium">Credit Score:</span> <span className="text-gray-800">{cbResult.creditScore}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">Tradelines:</span> <span className="text-gray-800">{cbResult.tradelines}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">Delinquencies:</span> <span className="text-gray-800">{cbResult.delinquencies}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">Bureau:</span> <span className="text-gray-800">{cbResult.bureau}</span>
          </div>
          {cbResult.confidence !== null && (
            <div className="mb-1">
              <span className="font-medium">Confidence:</span> <span className="text-green-700">{(cbResult.confidence * 100).toFixed(1)}%</span>
            </div>
          )}
          <div className="mb-1">
            <span className="font-medium">Checked At:</span> <span className="text-gray-800">{cbResult.checkedAt}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Credit bureau data is mocked for demo purposes.<br />
            No real credit check performed.
          </div>
        </div>
      )}
      {manualMode && (
        <form onSubmit={handleManualSubmit} className="mt-6 space-y-4">
          <h4 className="text-md font-semibold mb-2 text-gray-700 text-center">Manual Credit Data Entry</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score</label>
            <input
              type="number"
              name="creditScore"
              value={manualData.creditScore}
              onChange={handleManualChange}
              min={300}
              max={850}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              placeholder="e.g. 700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tradelines</label>
            <input
              type="number"
              name="tradelines"
              value={manualData.tradelines}
              onChange={handleManualChange}
              min={0}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delinquencies</label>
            <input
              type="number"
              name="delinquencies"
              value={manualData.delinquencies}
              onChange={handleManualChange}
              min={0}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              placeholder="e.g. 0"
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
        Credit bureau check is simulated for demo purposes.<br />
        No real credit bureau integration is performed.
      </div>
    </div>
  );
}

CreditBureauMockUI.propTypes = {
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CreditBureauMockUI;