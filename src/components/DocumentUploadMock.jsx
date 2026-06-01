import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { validateDocument, saveDocumentReference, getDocumentsByApplication, removeDocumentReference } from '../utils/documentUploadMock';

/**
 * DocumentUploadMock: UI for uploading documents (mocked), validates and stores references.
 * Allows upload, shows uploaded docs, and supports removal.
 * @param {object} props
 * @param {string|number} props.applicationId - Loan application ID to associate docs
 * @returns {JSX.Element}
 */
function DocumentUploadMock({ applicationId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState(() => getDocumentsByApplication(applicationId));

  const handleFileChange = (e) => {
    setUploadError('');
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploading(true);
    try {
      if (!selectedFile) {
        setUploadError('Please select a file to upload.');
        setUploading(false);
        return;
      }
      const validation = validateDocument(selectedFile);
      if (!validation.valid) {
        setUploadError(validation.reason);
        setUploading(false);
        return;
      }
      const docMeta = {
        id: Date.now(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        applicationId,
      };
      saveDocumentReference(docMeta);
      setDocuments(getDocumentsByApplication(applicationId));
      setSelectedFile(null);
    } catch (err) {
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (docId) => {
    removeDocumentReference(docId);
    setDocuments(getDocumentsByApplication(applicationId));
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Upload Supporting Documents</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700"
            disabled={uploading}
          />
        </div>
        {uploadError && (
          <div className="text-red-600 text-xs">{uploadError}</div>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold transition hover:bg-blue-700 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={uploading || !selectedFile}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2 text-gray-700">Uploaded Documents</h4>
        {documents.length === 0 ? (
          <div className="text-gray-500 text-sm">No documents uploaded yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {documents.map(doc => (
              <li key={doc.id} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium text-gray-800">{doc.name}</span>
                  <span className="ml-2 text-xs text-gray-500">{doc.type}</span>
                  <span className="ml-2 text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  type="button"
                  className="ml-4 text-red-600 text-xs font-semibold hover:underline"
                  onClick={() => handleRemove(doc.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6 text-xs text-gray-500 text-center">
        Documents are stored locally for demo purposes.<br />
        No actual file upload is performed.
      </div>
    </div>
  );
}

DocumentUploadMock.propTypes = {
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DocumentUploadMock;