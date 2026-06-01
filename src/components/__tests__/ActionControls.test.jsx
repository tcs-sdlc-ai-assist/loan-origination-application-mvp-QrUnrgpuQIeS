import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActionControls from '../ActionControls';
import * as localStorageRepo from '../../utils/localStorageRepo';

describe('ActionControls', () => {
  const applicationId = 101;
  const application = {
    id: applicationId,
    userId: 1001,
    creditScore: 720,
    annualIncome: 60000,
    monthlyDebt: 500,
    requestedAmount: 20000,
    status: 'Submitted',
    createdAt: '2024-06-01T12:00:00Z',
    name: 'John Doe',
    ssn: '123-45-6789',
    address: '123 Main St, Springfield, IL 62704',
    email: 'johndoe@example.com',
    phone: '555-123-4567',
  };

  beforeEach(() => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(id =>
      String(id) === String(application.id) ? application : null
    );
    jest.spyOn(localStorageRepo, 'updateApplicationStatus').mockImplementation((id, status) => {
      if (String(id) === String(application.id)) return true;
      return false;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderComponent(props = {}) {
    return render(<ActionControls applicationId={applicationId} {...props} />);
  }

  it('renders action controls form with status options', () => {
    renderComponent();
    expect(screen.getByText(/Status Actions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Action/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Note/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Status/i })).toBeInTheDocument();
    expect(screen.getByText(/Approve/i)).toBeInTheDocument();
    expect(screen.getByText(/Reject/i)).toBeInTheDocument();
    expect(screen.getByText(/Request Info/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions update application status locally/i)).toBeInTheDocument();
  });

  it('shows error if no action is selected and submit is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Select an action/i)).toBeInTheDocument();
    });
  });

  it('shows error if application not found', async () => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(() => null);
    render(<ActionControls applicationId={999} />);
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Pre-Approved' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Application not found/i)).toBeInTheDocument();
    });
  });

  it('shows error if updateApplicationStatus fails', async () => {
    jest.spyOn(localStorageRepo, 'updateApplicationStatus').mockImplementation(() => false);
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Rejected' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Failed to update status/i)).toBeInTheDocument();
    });
  });

  it('updates status and shows success message for valid action', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Pre-Approved' } });
    fireEvent.change(screen.getByLabelText(/Add Note/i), { target: { value: 'Approved after review' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Status updated to "Pre-Approved"/i)).toBeInTheDocument();
    });
  });

  it('calls onStatusChange callback with action and note', async () => {
    const onStatusChange = jest.fn();
    renderComponent({ onStatusChange });
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Rejected' } });
    fireEvent.change(screen.getByLabelText(/Add Note/i), { target: { value: 'Insufficient credit score' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(onStatusChange).toHaveBeenCalledWith('Rejected', 'Insufficient credit score');
    });
  });

  it('shows loading state while updating status', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Info Requested' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    expect(screen.getByRole('button', { name: /Updating/i })).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText(/Status updated to "Info Requested"/i)).toBeInTheDocument();
    });
  });

  it('clears error and success when action or note changes', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Select an action/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Pre-Approved' } });
    expect(screen.queryByText(/Select an action/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Add Note/i), { target: { value: 'Approved' } });
    expect(screen.queryByText(/Select an action/i)).not.toBeInTheDocument();
  });

  it('handles error thrown during status update', async () => {
    jest.spyOn(localStorageRepo, 'updateApplicationStatus').mockImplementation(() => { throw new Error('fail'); });
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Select Action/i), { target: { value: 'Rejected' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Error updating status/i)).toBeInTheDocument();
    });
  });
});