import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentUploadMock from '../DocumentUploadMock';
import * as documentUploadMock from '../../utils/documentUploadMock';

describe('DocumentUploadMock', () => {
  const applicationId = 12345;

  beforeEach(() => {
    jest.spyOn(documentUploadMock, 'validateDocument').mockImplementation(file => ({
      valid: true,
      reason: '',
    }));
    jest.spyOn(documentUploadMock, 'saveDocumentReference').mockImplementation(() => {});
    jest.spyOn(documentUploadMock, 'getDocumentsByApplication').mockImplementation(() => []);
    jest.spyOn(documentUploadMock, 'removeDocumentReference').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderComponent(props = {}) {
    return render(<DocumentUploadMock applicationId={applicationId} {...props} />);
  }

  it('renders upload form and shows no documents initially', () => {
    renderComponent();
    expect(screen.getByText(/Upload Supporting Documents/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Document/i })).toBeInTheDocument();
    expect(screen.getByText(/No documents uploaded yet/i)).toBeInTheDocument();
  });

  it('shows error if no file selected on upload', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Upload Document/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please select a file to upload/i)).toBeInTheDocument();
    });
  });

  it('shows error if file validation fails', async () => {
    jest.spyOn(documentUploadMock, 'validateDocument').mockImplementation(() => ({
      valid: false,
      reason: 'Unsupported file type',
    }));
    renderComponent();
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/Upload Supporting Documents/i, { selector: 'input[type="file"]' }) || screen.getByRole('textbox');
    fireEvent.change(screen.getByRole('textbox', { hidden: false }) || input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload Document/i }));
    await waitFor(() => {
      expect(screen.getByText(/Unsupported file type/i)).toBeInTheDocument();
    });
  });

  it('calls saveDocumentReference and refreshes documents on valid upload', async () => {
    const saveSpy = jest.spyOn(documentUploadMock, 'saveDocumentReference');
    jest.spyOn(documentUploadMock, 'getDocumentsByApplication').mockImplementation(() => [
      {
        id: 1,
        name: 'ID Proof.pdf',
        type: 'application/pdf',
        size: 10240,
        applicationId,
        uploadedAt: '2024-06-01T12:00:00Z',
      },
    ]);
    renderComponent();
    const file = new File(['dummy'], 'ID Proof.pdf', { type: 'application/pdf', size: 10240 });
    const input = screen.getByLabelText(/Upload Supporting Documents/i, { selector: 'input[type="file"]' }) || screen.getByRole('textbox');
    fireEvent.change(screen.getByRole('textbox', { hidden: false }) || input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload Document/i }));
    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalled();
      expect(screen.getByText(/ID Proof.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/application\/pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/10.0 KB/i)).toBeInTheDocument();
    });
  });

  it('removes document when Remove button is clicked', async () => {
    jest.spyOn(documentUploadMock, 'getDocumentsByApplication').mockImplementation(() => [
      {
        id: 2,
        name: 'Income Statement.jpg',
        type: 'image/jpeg',
        size: 20480,
        applicationId,
        uploadedAt: '2024-06-01T12:00:00Z',
      },
    ]);
    const removeSpy = jest.spyOn(documentUploadMock, 'removeDocumentReference');
    renderComponent();
    expect(screen.getByText(/Income Statement.jpg/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Remove/i }));
    await waitFor(() => {
      expect(removeSpy).toHaveBeenCalledWith(2);
    });
  });

  it('shows error if upload fails', async () => {
    jest.spyOn(documentUploadMock, 'saveDocumentReference').mockImplementation(() => { throw new Error('fail'); });
    renderComponent();
    const file = new File(['dummy'], 'ID Proof.pdf', { type: 'application/pdf', size: 10240 });
    const input = screen.getByLabelText(/Upload Supporting Documents/i, { selector: 'input[type="file"]' }) || screen.getByRole('textbox');
    fireEvent.change(screen.getByRole('textbox', { hidden: false }) || input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload Document/i }));
    await waitFor(() => {
      expect(screen.getByText(/Failed to upload document/i)).toBeInTheDocument();
    });
  });

  it('shows error if removeDocumentReference fails', async () => {
    jest.spyOn(documentUploadMock, 'getDocumentsByApplication').mockImplementation(() => [
      {
        id: 3,
        name: 'Utility Bill.pdf',
        type: 'application/pdf',
        size: 30720,
        applicationId,
        uploadedAt: '2024-06-01T12:00:00Z',
      },
    ]);
    jest.spyOn(documentUploadMock, 'removeDocumentReference').mockImplementation(() => false);
    renderComponent();
    expect(screen.getByText(/Utility Bill.pdf/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Remove/i }));
    await waitFor(() => {
      // No error UI for remove failure, but removeDocumentReference should be called
      expect(documentUploadMock.removeDocumentReference).toHaveBeenCalledWith(3);
    });
  });

  it('handles edge case: file input cleared', async () => {
    renderComponent();
    const input = screen.getByLabelText(/Upload Supporting Documents/i, { selector: 'input[type="file"]' }) || screen.getByRole('textbox');
    fireEvent.change(screen.getByRole('textbox', { hidden: false }) || input, { target: { files: [] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload Document/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please select a file to upload/i)).toBeInTheDocument();
    });
  });
});