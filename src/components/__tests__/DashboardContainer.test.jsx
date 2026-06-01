import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardContainer from '../DashboardContainer';
import { AppProvider } from '../../context/AppContext';
import * as localStorageRepo from '../../utils/localStorageRepo';
import * as piiMasker from '../../utils/piiMasker';

describe('DashboardContainer', () => {
  const applications = [
    {
      id: 101,
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
    },
    {
      id: 102,
      userId: 1002,
      creditScore: 650,
      annualIncome: 45000,
      monthlyDebt: 1200,
      requestedAmount: 15000,
      status: 'Under Review',
      createdAt: '2024-06-02T12:00:00Z',
      name: 'Jane Smith',
      ssn: '987-65-4321',
      address: '456 Oak Ave, Riverside, CA 90210',
    },
  ];

  beforeEach(() => {
    jest.spyOn(localStorageRepo, 'getApplications').mockImplementation(() => applications);
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(id =>
      applications.find(app => String(app.id) === String(id)) || null
    );
    jest.spyOn(localStorageRepo, 'updateApplicationStatus').mockImplementation((id, status) => {
      const idx = applications.findIndex(app => String(app.id) === String(id));
      if (idx === -1) return false;
      applications[idx].status = status;
      return true;
    });
    jest.spyOn(piiMasker, 'maskPIIObject').mockImplementation(obj => ({
      name: 'J*** D**',
      ssn: '***-**-6789',
      address: '***, Springfield, IL 62704',
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderWithProvider(props = {}) {
    return render(
      <AppProvider>
        <DashboardContainer {...props} />
      </AppProvider>
    );
  }

  it('renders dashboard with applications and review details', () => {
    renderWithProvider({ title: 'Internal Review Dashboard' });
    expect(screen.getByText(/Internal Review Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/Review Details/i)).toBeInTheDocument();
    expect(screen.getByText(/App #101/i)).toBeInTheDocument();
    expect(screen.getByText(/App #102/i)).toBeInTheDocument();
    expect(screen.getByText(/\$20,000/i)).toBeInTheDocument();
    expect(screen.getByText(/\$15,000/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 720/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 650/i)).toBeInTheDocument();
  });

  it('shows review details when application is selected', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByText(/App #101/i));
    await waitFor(() => {
      expect(screen.getByText(/Application ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/User ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/Credit Score:/i)).toBeInTheDocument();
      expect(screen.getByText(/\$60,000/i)).toBeInTheDocument();
      expect(screen.getByText(/\$500/i)).toBeInTheDocument();
      expect(screen.getByText(/\$20,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Submitted/i)).toBeInTheDocument();
      expect(screen.getByText(/2024-06-01T12:00:00Z/i)).toBeInTheDocument();
      expect(screen.getByText(/PII Masked:/i)).toBeInTheDocument();
      expect(screen.getByText(/J\*\*\* D\*\*/i)).toBeInTheDocument();
      expect(screen.getByText(/\*\*\*-**-6789/i)).toBeInTheDocument();
      expect(screen.getByText(/\*\*\*, Springfield, IL 62704/i)).toBeInTheDocument();
    });
  });

  it('updates application status when status is selected and button clicked', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByText(/App #101/i));
    await waitFor(() => {
      expect(screen.getByText(/Update Status/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByRole('combobox', { name: /Update Status/i }), { target: { value: 'Pre-Approved' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(localStorageRepo.updateApplicationStatus).toHaveBeenCalledWith(101, 'Pre-Approved');
    });
    // Status should update in UI
    expect(screen.getByText(/Pre-Approved/i)).toBeInTheDocument();
  });

  it('shows error if updateApplicationStatus fails', async () => {
    jest.spyOn(localStorageRepo, 'updateApplicationStatus').mockImplementation(() => false);
    renderWithProvider();
    fireEvent.click(screen.getByText(/App #101/i));
    await waitFor(() => {
      expect(screen.getByText(/Update Status/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByRole('combobox', { name: /Update Status/i }), { target: { value: 'Rejected' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Failed to update status/i)).toBeInTheDocument();
    });
  });

  it('shows error if no application or status selected', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/Select an application and status/i)).toBeInTheDocument();
    });
  });

  it('shows message when no applications found', () => {
    jest.spyOn(localStorageRepo, 'getApplications').mockImplementation(() => []);
    renderWithProvider();
    expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
  });

  it('shows message when no application selected for review', () => {
    renderWithProvider();
    expect(screen.getByText(/Select an application to review/i)).toBeInTheDocument();
  });

  it('handles edge case: application not found', async () => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(() => null);
    renderWithProvider();
    fireEvent.click(screen.getByText(/App #101/i));
    await waitFor(() => {
      expect(screen.getByText(/Select an application to review/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: maskPIIObject returns empty object', async () => {
    jest.spyOn(piiMasker, 'maskPIIObject').mockImplementation(() => ({}));
    renderWithProvider();
    fireEvent.click(screen.getByText(/App #101/i));
    await waitFor(() => {
      expect(screen.getByText(/PII Masked:/i)).toBeInTheDocument();
      expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
    });
  });
});