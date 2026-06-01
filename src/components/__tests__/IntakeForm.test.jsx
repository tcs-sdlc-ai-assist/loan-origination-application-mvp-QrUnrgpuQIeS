import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IntakeForm from '../IntakeForm';
import { AppProvider } from '../../context/AppContext';
import * as localStorageRepo from '../../utils/localStorageRepo';
import * as eligibilityCalculator from '../../utils/eligibilityCalculator';
import * as offerGenerator from '../../utils/offerGenerator';

describe('IntakeForm', () => {
  beforeEach(() => {
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    jest.spyOn(localStorage, 'getItem').mockImplementation(() => null);
    jest.spyOn(localStorageRepo, 'saveApplication').mockImplementation(() => {});
    jest.spyOn(eligibilityCalculator, 'checkEligibility').mockImplementation(app => ({
      eligible: true,
      reasons: [],
      maxAmount: 50000,
      rateBand: 'B',
    }));
    jest.spyOn(offerGenerator, 'generateOffer').mockImplementation((elig, app) => ({
      status: 'Pre-Approved',
      offer: {
        approvedAmount: 20000,
        rateBand: 'B',
        interestRate: 0.059,
        termMonths: 60,
        emi: 400.00,
      },
      reasons: [],
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderWithProvider(props = {}) {
    return render(
      <AppProvider>
        <IntakeForm {...props} />
      </AppProvider>
    );
  }

  it('renders intake form fields and submit button', () => {
    renderWithProvider();
    expect(screen.getByLabelText(/Credit Score/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Debt Payments/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Requested Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Application/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    renderWithProvider();
    fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Monthly Debt Payments/i), { target: { value: '-10' } });
    fireEvent.change(screen.getByLabelText(/Requested Loan Amount/i), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));

    await waitFor(() => {
      expect(screen.getByText(/Credit score must be between 300 and 850/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual income must be at least \$10,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly debt must be 0 or greater/i)).toBeInTheDocument();
      expect(screen.getByText(/Requested amount must be at least \$1,000/i)).toBeInTheDocument();
    });
  });

  it('submits valid application and displays eligibility result', async () => {
    renderWithProvider();
    fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: '700' } });
    fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/Monthly Debt Payments/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Requested Loan Amount/i), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));

    await waitFor(() => {
      expect(screen.getByText(/Eligible for loan!/i)).toBeInTheDocument();
      expect(screen.getByText(/Max Eligible Amount:/i)).toBeInTheDocument();
      expect(screen.getByText(/Rate Band:/i)).toBeInTheDocument();
      expect(screen.getByText(/Preliminary Offer/i)).toBeInTheDocument();
      expect(screen.getByText(/Approved Amount:/i)).toBeInTheDocument();
      expect(screen.getByText(/Interest Rate:/i)).toBeInTheDocument();
      expect(screen.getByText(/Term:/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated Monthly Payment/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit callback with application, eligibility, and offer', async () => {
    const onSubmit = jest.fn();
    renderWithProvider({ onSubmit });
    fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: '700' } });
    fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/Monthly Debt Payments/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Requested Loan Amount/i), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      const args = onSubmit.mock.calls[0];
      expect(typeof args[0]).toBe('object'); // application
      expect(typeof args[1]).toBe('object'); // eligibility
      expect(typeof args[2]).toBe('object'); // offer
      expect(args[1].eligible).toBe(true);
      expect(args[2].status).toBe('Pre-Approved');
    });
  });

  it('shows error message if submission fails', async () => {
    jest.spyOn(localStorageRepo, 'saveApplication').mockImplementation(() => { throw new Error('fail'); });
    renderWithProvider();
    fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: '700' } });
    fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/Monthly Debt Payments/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Requested Loan Amount/i), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit application/i)).toBeInTheDocument();
    });
  });

  it('displays not eligible result if eligibility fails', async () => {
    jest.spyOn(eligibilityCalculator, 'checkEligibility').mockImplementation(app => ({
      eligible: false,
      reasons: ['Credit score below minimum threshold'],
      maxAmount: 0,
      rateBand: 'D',
    }));
    jest.spyOn(offerGenerator, 'generateOffer').mockImplementation((elig, app) => ({
      status: 'Rejected',
      offer: null,
      reasons: ['Credit score below minimum threshold'],
    }));
    renderWithProvider();
    fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/Monthly Debt Payments/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Requested Loan Amount/i), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));

    await waitFor(() => {
      expect(screen.getByText(/Not eligible for loan/i)).toBeInTheDocument();
      expect(screen.getByText(/Credit score below minimum threshold/i)).toBeInTheDocument();
    });
  });
});