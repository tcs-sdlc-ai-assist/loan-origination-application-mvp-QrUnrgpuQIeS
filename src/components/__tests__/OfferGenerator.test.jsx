import React from 'react';
import { render, screen } from '@testing-library/react';
import OfferGenerator from '../OfferGenerator';

describe('OfferGenerator', () => {
  it('renders preliminary offer for pre-approved status', () => {
    const offer = {
      status: 'Pre-Approved',
      offer: {
        approvedAmount: 25000,
        rateBand: 'B',
        interestRate: 0.059,
        termMonths: 60,
        emi: 480.00,
      },
      reasons: [],
    };
    render(<OfferGenerator offer={offer} />);
    expect(screen.getByText(/Preliminary Offer/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/\$25,000/i)).toBeInTheDocument();
    expect(screen.getByText(/Rate Band:/i)).toBeInTheDocument();
    expect(screen.getByText(/Interest Rate:/i)).toBeInTheDocument();
    expect(screen.getByText(/Term:/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Monthly Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/\$480/i)).toBeInTheDocument();
  });

  it('renders rejected offer with reasons', () => {
    const offer = {
      status: 'Rejected',
      offer: null,
      reasons: ['Credit score too low', 'DTI exceeds maximum'],
    };
    render(<OfferGenerator offer={offer} />);
    expect(screen.getByText(/Offer Status: Rejected/i)).toBeInTheDocument();
    expect(screen.getByText(/Credit score too low/i)).toBeInTheDocument();
    expect(screen.getByText(/DTI exceeds maximum/i)).toBeInTheDocument();
    expect(screen.getByText(/No preliminary offer generated/i)).toBeInTheDocument();
  });

  it('renders fallback when offer is null', () => {
    render(<OfferGenerator offer={null} />);
    expect(screen.getByText(/No offer data available/i)).toBeInTheDocument();
  });

  it('renders rejected offer with default reason if reasons missing', () => {
    const offer = {
      status: 'Rejected',
      offer: null,
      reasons: undefined,
    };
    render(<OfferGenerator offer={offer} />);
    expect(screen.getByText(/Offer Status: Rejected/i)).toBeInTheDocument();
    expect(screen.getByText(/Not eligible/i)).toBeInTheDocument();
  });

  it('renders pre-approved offer with missing fields gracefully', () => {
    const offer = {
      status: 'Pre-Approved',
      offer: {
        approvedAmount: undefined,
        rateBand: undefined,
        interestRate: undefined,
        termMonths: undefined,
        emi: undefined,
      },
      reasons: [],
    };
    render(<OfferGenerator offer={offer} />);
    expect(screen.getByText(/Preliminary Offer/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rate Band:/i)).toBeInTheDocument();
    expect(screen.getByText(/Interest Rate:/i)).toBeInTheDocument();
    expect(screen.getByText(/Term:/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Monthly Payment/i)).toBeInTheDocument();
  });

  it('renders rejected offer if offer object missing', () => {
    const offer = {
      status: 'Rejected',
    };
    render(<OfferGenerator offer={offer} />);
    expect(screen.getByText(/Offer Status: Rejected/i)).toBeInTheDocument();
  });

  it('renders pre-approved offer if offer object missing fields', () => {
    const offer = {
      status: 'Pre-Approved',
      offer: {},
      reasons: [],
    };
    render(<OfferGenerator offer={offer} />);
    expect(screen.getByText(/Preliminary Offer/i)).toBeInTheDocument();
  });
});