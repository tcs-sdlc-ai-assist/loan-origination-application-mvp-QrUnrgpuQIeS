import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationList from '../ApplicationList';
import * as localStorageRepo from '../../utils/localStorageRepo';

describe('ApplicationList', () => {
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
    },
    {
      id: 103,
      userId: 1003,
      creditScore: 780,
      annualIncome: 90000,
      monthlyDebt: 400,
      requestedAmount: 50000,
      status: 'Pre-Approved',
      createdAt: '2024-06-03T12:00:00Z',
    },
    {
      id: 104,
      userId: 1004,
      creditScore: 590,
      annualIncome: 30000,
      monthlyDebt: 2000,
      requestedAmount: 10000,
      status: 'Rejected',
      createdAt: '2024-06-04T12:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.spyOn(localStorageRepo, 'getApplications').mockImplementation(() => applications);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderComponent(props = {}) {
    return render(<ApplicationList {...props} />);
  }

  it('renders application list table with all applications', () => {
    renderComponent();
    expect(screen.getByText(/Loan Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/App ID/i)).toBeInTheDocument();
    expect(screen.getByText(/User ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Credit Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByText(/Requested Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Created At/i)).toBeInTheDocument();
    expect(screen.getByText(/Review/i)).toBeInTheDocument();

    // All applications should be present
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('103')).toBeInTheDocument();
    expect(screen.getByText('104')).toBeInTheDocument();
    expect(screen.getByText('1001')).toBeInTheDocument();
    expect(screen.getByText('1002')).toBeInTheDocument();
    expect(screen.getByText('1003')).toBeInTheDocument();
    expect(screen.getByText('1004')).toBeInTheDocument();
    expect(screen.getByText('720')).toBeInTheDocument();
    expect(screen.getByText('650')).toBeInTheDocument();
    expect(screen.getByText('780')).toBeInTheDocument();
    expect(screen.getByText('590')).toBeInTheDocument();
    expect(screen.getByText('$60,000')).toBeInTheDocument();
    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('$90,000')).toBeInTheDocument();
    expect(screen.getByText('$30,000')).toBeInTheDocument();
    expect(screen.getByText('$20,000')).toBeInTheDocument();
    expect(screen.getByText('$15,000')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Under Review')).toBeInTheDocument();
    expect(screen.getByText('Pre-Approved')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('2024-06-01T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2024-06-02T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2024-06-03T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2024-06-04T12:00:00Z')).toBeInTheDocument();
  });

  it('filters applications by status', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Filter by Status/i), { target: { value: 'Pre-Approved' } });
    await waitFor(() => {
      expect(screen.getByText('103')).toBeInTheDocument();
      expect(screen.queryByText('101')).not.toBeInTheDocument();
      expect(screen.queryByText('102')).not.toBeInTheDocument();
      expect(screen.queryByText('104')).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Filter by Status/i), { target: { value: 'Rejected' } });
    await waitFor(() => {
      expect(screen.getByText('104')).toBeInTheDocument();
      expect(screen.queryByText('101')).not.toBeInTheDocument();
      expect(screen.queryByText('102')).not.toBeInTheDocument();
      expect(screen.queryByText('103')).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Filter by Status/i), { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('102')).toBeInTheDocument();
      expect(screen.getByText('103')).toBeInTheDocument();
      expect(screen.getByText('104')).toBeInTheDocument();
    });
  });

  it('sorts applications by credit score ascending and descending', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: 'creditScore' } });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'asc' } });
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // First data row should be 104 (lowest score)
      expect(rows[1]).toHaveTextContent('104');
      // Last data row should be 103 (highest score)
      expect(rows[4]).toHaveTextContent('103');
    });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'desc' } });
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // First data row should be 103 (highest score)
      expect(rows[1]).toHaveTextContent('103');
      // Last data row should be 104 (lowest score)
      expect(rows[4]).toHaveTextContent('104');
    });
  });

  it('sorts applications by requested amount ascending and descending', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: 'requestedAmount' } });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'asc' } });
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('104'); // $10,000
      expect(rows[4]).toHaveTextContent('103'); // $50,000
    });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'desc' } });
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('103'); // $50,000
      expect(rows[4]).toHaveTextContent('104'); // $10,000
    });
  });

  it('filters applications by search input (App ID, User ID, Credit Score)', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Search/i), { target: { value: '103' } });
    await waitFor(() => {
      expect(screen.getByText('103')).toBeInTheDocument();
      expect(screen.queryByText('101')).not.toBeInTheDocument();
      expect(screen.queryByText('102')).not.toBeInTheDocument();
      expect(screen.queryByText('104')).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Search/i), { target: { value: '1002' } });
    await waitFor(() => {
      expect(screen.getByText('102')).toBeInTheDocument();
      expect(screen.queryByText('101')).not.toBeInTheDocument();
      expect(screen.queryByText('103')).not.toBeInTheDocument();
      expect(screen.queryByText('104')).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Search/i), { target: { value: '780' } });
    await waitFor(() => {
      expect(screen.getByText('103')).toBeInTheDocument();
      expect(screen.queryByText('101')).not.toBeInTheDocument();
      expect(screen.queryByText('102')).not.toBeInTheDocument();
      expect(screen.queryByText('104')).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Search/i), { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('102')).toBeInTheDocument();
      expect(screen.getByText('103')).toBeInTheDocument();
      expect(screen.getByText('104')).toBeInTheDocument();
    });
  });

  it('calls onSelect callback when Review button is clicked', async () => {
    const onSelect = jest.fn();
    renderComponent({ onSelect });
    fireEvent.click(screen.getAllByRole('button', { name: /Review/i })[0]);
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(101);
    });
    fireEvent.click(screen.getAllByRole('button', { name: /Review/i })[2]);
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(103);
    });
  });

  it('refreshes applications when Refresh button is clicked', async () => {
    const getAppsSpy = jest.spyOn(localStorageRepo, 'getApplications');
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Refresh/i }));
    await waitFor(() => {
      expect(getAppsSpy).toHaveBeenCalled();
    });
  });

  it('shows message when no applications found', () => {
    jest.spyOn(localStorageRepo, 'getApplications').mockImplementation(() => []);
    renderComponent();
    expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
  });

  it('handles edge case: search yields no results', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Search/i), { target: { value: '99999' } });
    await waitFor(() => {
      expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: filter by status yields no results', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Filter by Status/i), { target: { value: 'Info Requested' } });
    await waitFor(() => {
      expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: sort field is createdAt', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: 'createdAt' } });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'asc' } });
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('101');
      expect(rows[4]).toHaveTextContent('104');
    });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'desc' } });
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('104');
      expect(rows[4]).toHaveTextContent('101');
    });
  });
});