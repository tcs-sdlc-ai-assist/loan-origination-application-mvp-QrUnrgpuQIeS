import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getDocumentsByApplication } from '../utils/documentUploadMock';
import OCRMockUI from './OCRMockUI';

/**
 * DocumentReview: UI for reviewing document references and mock OCR results.
 * Shows uploaded documents for an application, allows ops team to run mock OCR extraction.
 * @param {object} props
 * @param {string|number} props.applicationId - Application ID to review documents for
 * @returns {JSX.Element}
 */
function DocumentReview({ applicationId }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const docs = getDocumentsByApplication(applicationId);
      setDocuments(docs);
      setSelectedDocId(null);
    } catch (e) {
      setError('Failed to load documents.');
      setDocuments([]);
      setSelectedDocId(null);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  const handleSelectDoc = (docId) => {
    setSelectedDocId(docId);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6 text-center text-gray-600">
        Loading documents...
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

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Document Review</h2>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Uploaded Documents</h3>
        {documents.length === 0 ? (
          <div className="text-gray-500 text-sm">No documents uploaded for this application.</div>
        ) : (
          <ul className="divide-y divide-gray-200 mb-4">
            {documents.map(doc => (
              <li
                key={doc.id}
                className={`flex items-center justify-between py-2 px-2 rounded-md cursor-pointer transition ${selectedDocId === doc.id ? 'bg-blue-100 border border-blue-300' : 'hover:bg-blue-50'}`}
                onClick={() => handleSelectDoc(doc.id)}
              >
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
      {selectedDocId && (
        <div className="mt-6">
          <OCRMockUI applicationId={applicationId} />
        </div>
      )}
      <div className="mt-6 text-xs text-gray-500 text-center">
        Documents and OCR extraction are simulated for demo purposes.<br />
        No real document processing is performed.
      </div>
    </div>
  );
}

DocumentReview.propTypes = {
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DocumentReview;