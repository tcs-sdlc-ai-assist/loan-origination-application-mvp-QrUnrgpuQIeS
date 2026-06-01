import React from 'react';
import { render, screen } from '@testing-library/react';
import EligibilityCalculator from '../EligibilityCalculator';

describe('EligibilityCalculator', () => {
  it('renders eligibility result for eligible applicant with offer', () => {
    const eligibility = {
      eligible: true,
      reasons: [],
      maxAmount: 50000,
      rateBand: 'B',
    };
    const offer = {
      status: 'Pre-Approved',
      offer: {
        approvedAmount: 20000,
        rateBand: 'B',
        interestRate: 0.059,
        termMonths: 60,
        emi: 400.00,
      },
      reasons: [],
    };
    render(<EligibilityCalculator eligibility={eligibility} offer={offer} />);
    expect(screen.getByText(/Eligible for loan!/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Eligible Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rate Band:/i)).toBeInTheDocument();
    expect(screen.getByText(/Preliminary Offer/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/Interest Rate:/i)).toBeInTheDocument();
    expect(screen.getByText(/Term:/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Monthly Payment/i)).toBeInTheDocument();
  });

  it('renders not eligible result with reasons and rejected offer', () => {
    const eligibility = {
      eligible: false,
      reasons: ['Credit score below minimum threshold', 'Debt-to-income ratio exceeds maximum allowed'],
      maxAmount: 0,
      rateBand: 'D',
    };
    const offer = {
      status: 'Rejected',
      offer: null,
      reasons: ['Credit score below minimum threshold', 'Debt-to-income ratio exceeds maximum allowed'],
    };
    render(<EligibilityCalculator eligibility={eligibility} offer={offer} />);
    expect(screen.getByText(/Not eligible for loan/i)).toBeInTheDocument();
    expect(screen.getByText(/Credit score below minimum threshold/i)).toBeInTheDocument();
    expect(screen.getByText(/Debt-to-income ratio exceeds maximum allowed/i)).toBeInTheDocument();
    expect(screen.getByText(/Offer Status: Rejected/i)).not.toBeInTheDocument(); // OfferGenerator not rendered here
  });

  it('renders eligibility result without offer', () => {
    const eligibility = {
      eligible: true,
      reasons: [],
      maxAmount: 75000,
      rateBand: 'A',
    };
    render(<EligibilityCalculator eligibility={eligibility} offer={null} />);
    expect(screen.getByText(/Eligible for loan!/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Eligible Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rate Band:/i)).toBeInTheDocument();
    expect(screen.getByText(/No offer data available/i)).not.toBeInTheDocument();
  });

  it('renders not eligible result without offer', () => {
    const eligibility = {
      eligible: false,
      reasons: ['Annual income below minimum required'],
      maxAmount: 0,
      rateBand: 'D',
    };
    render(<EligibilityCalculator eligibility={eligibility} offer={null} />);
    expect(screen.getByText(/Not eligible for loan/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual income below minimum required/i)).toBeInTheDocument();
  });

  it('renders reasons from offer if eligibility reasons are empty', () => {
    const eligibility = {
      eligible: false,
      reasons: [],
      maxAmount: 0,
      rateBand: 'D',
    };
    const offer = {
      status: 'Rejected',
      offer: null,
      reasons: ['Requested amount exceeds eligible maximum'],
    };
    render(<EligibilityCalculator eligibility={eligibility} offer={offer} />);
    expect(screen.getByText(/Not eligible for loan/i)).toBeInTheDocument();
    expect(screen.getByText(/Requested amount exceeds eligible maximum/i)).toBeInTheDocument();
  });

  it('renders fallback when eligibility is missing', () => {
    render(<EligibilityCalculator eligibility={null} offer={null} />);
    expect(screen.getByText(/No eligibility data available/i)).toBeInTheDocument();
  });

  it('handles edge case: eligibility object missing fields', () => {
    const eligibility = {};
    render(<EligibilityCalculator eligibility={eligibility} offer={null} />);
    expect(screen.getByText(/No eligibility data available/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Not eligible for loan/i)).toBeInTheDocument();
  });

  it('handles edge case: offer object missing fields', () => {
    const eligibility = {
      eligible: true,
      reasons: [],
      maxAmount: 50000,
      rateBand: 'B',
    };
    const offer = {};
    render(<EligibilityCalculator eligibility={eligibility} offer={offer} />);
    expect(screen.getByText(/Eligible for loan!/i)).toBeInTheDocument();
  });
});