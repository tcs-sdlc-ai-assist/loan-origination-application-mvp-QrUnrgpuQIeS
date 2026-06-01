import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ApplicationDetail from '../ApplicationDetail';
import * as localStorageRepo from '../../utils/localStorageRepo';
import * as eligibilityCalculator from '../../utils/eligibilityCalculator';
import * as offerGenerator from '../../utils/offerGenerator';
import * as piiMasker from '../../utils/piiMasker';
import * as documentUploadMock from '../../utils/documentUploadMock';

describe('ApplicationDetail', () => {
  const application = {
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
    email: 'johndoe@example.com',
    phone: '555-123-4567',
  };

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

  const maskedUser = {
    name: 'J*** D**',
    ssn: '***-**-6789',
    address: '***, Springfield, IL 62704',
    email: 'j*******@example.com',
    phone: '***-***-**67',
  };

  const documents = [
    {
      id: 1,
      name: 'ID Proof.pdf',
      type: 'application/pdf',
      size: 10240,
      applicationId: 101,
      uploadedAt: '2024-06-01T12:00:00Z',
    },
    {
      id: 2,
      name: 'Income Statement.jpg',
      type: 'image/jpeg',
      size: 20480,
      applicationId: 101,
      uploadedAt: '2024-06-01T12:05:00Z',
    },
  ];

  beforeEach(() => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(id =>
      String(id) === String(application.id) ? application : null
    );
    jest.spyOn(eligibilityCalculator, 'checkEligibility').mockImplementation(() => eligibility);
    jest.spyOn(offerGenerator, 'generateOffer').mockImplementation(() => offer);
    jest.spyOn(piiMasker, 'maskPIIObject').mockImplementation(() => maskedUser);
    jest.spyOn(documentUploadMock, 'getDocumentsByApplication').mockImplementation(appId =>
      String(appId) === String(application.id) ? documents : []
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderComponent(props = {}) {
    return render(<ApplicationDetail applicationId={application.id} {...props} />);
  }

  it('renders application detail with all fields and documents', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Application Detail/i)).toBeInTheDocument();
      expect(screen.getByText(/Application Info/i)).toBeInTheDocument();
      expect(screen.getByText(/Application ID:/i)).toBeInTheDocument();
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText(/User ID:/i)).toBeInTheDocument();
      expect(screen.getByText('1001')).toBeInTheDocument();
      expect(screen.getByText(/Credit Score:/i)).toBeInTheDocument();
      expect(screen.getByText('720')).toBeInTheDocument();
      expect(screen.getByText(/Annual Income:/i)).toBeInTheDocument();
      expect(screen.getByText('$60,000')).toBeInTheDocument();
      expect(screen.getByText(/Monthly Debt:/i)).toBeInTheDocument();
      expect(screen.getByText('$500')).toBeInTheDocument();
      expect(screen.getByText(/Requested Amount:/i)).toBeInTheDocument();
      expect(screen.getByText('$20,000')).toBeInTheDocument();
      expect(screen.getByText(/Status:/i)).toBeInTheDocument();
      expect(screen.getByText('Submitted')).toBeInTheDocument();
      expect(screen.getByText(/Created At:/i)).toBeInTheDocument();
      expect(screen.getByText('2024-06-01T12:00:00Z')).toBeInTheDocument();
      expect(screen.getByText(/PII Masked:/i)).toBeInTheDocument();
      expect(screen.getByText(/J\*\*\* D\*\*/i)).toBeInTheDocument();
      expect(screen.getByText(/\*\*\*-**-6789/i)).toBeInTheDocument();
      expect(screen.getByText(/\*\*\*, Springfield, IL 62704/i)).toBeInTheDocument();
      expect(screen.getByText(/j\*\*\*\*\*\*\*@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/\*\*\*-***-**67/i)).toBeInTheDocument();
      expect(screen.getByText(/Eligibility Result/i)).toBeInTheDocument();
      expect(screen.getByText(/Eligible for loan!/i)).toBeInTheDocument();
      expect(screen.getByText(/Max Eligible Amount:/i)).toBeInTheDocument();
      expect(screen.getByText('$50,000')).toBeInTheDocument();
      expect(screen.getByText(/Rate Band:/i)).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText(/Preliminary Offer/i)).toBeInTheDocument();
      expect(screen.getByText(/Approved Amount:/i)).toBeInTheDocument();
      expect(screen.getByText('$20,000')).toBeInTheDocument();
      expect(screen.getByText(/Interest Rate:/i)).toBeInTheDocument();
      expect(screen.getByText('5.90%')).toBeInTheDocument();
      expect(screen.getByText(/Term:/i)).toBeInTheDocument();
      expect(screen.getByText('60 months')).toBeInTheDocument();
      expect(screen.getByText(/Estimated Monthly Payment/i)).toBeInTheDocument();
      expect(screen.getByText('$400')).toBeInTheDocument();
      expect(screen.getByText(/Uploaded Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/ID Proof.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/Income Statement.jpg/i)).toBeInTheDocument();
      expect(screen.getByText(/application\/pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/image\/jpeg/i)).toBeInTheDocument();
      expect(screen.getByText(/10.0 KB/i)).toBeInTheDocument();
      expect(screen.getByText(/20.0 KB/i)).toBeInTheDocument();
      expect(screen.getByText('2024-06-01T12:00:00Z')).toBeInTheDocument();
      expect(screen.getByText('2024-06-01T12:05:00Z')).toBeInTheDocument();
      expect(screen.getByText(/All data is stored locally for demo purposes/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching application', async () => {
    render(<ApplicationDetail applicationId={application.id} />);
    expect(screen.getByText(/Loading application details/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Loading application details/i)).not.toBeInTheDocument();
    });
  });

  it('shows error if application not found', async () => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(() => null);
    render(<ApplicationDetail applicationId={999} />);
    await waitFor(() => {
      expect(screen.getByText(/Application not found/i)).toBeInTheDocument();
    });
  });

  it('shows no application found if application is null', async () => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(() => null);
    render(<ApplicationDetail applicationId={999} />);
    await waitFor(() => {
      expect(screen.getByText(/No application found/i)).toBeInTheDocument();
    });
  });

  it('shows eligibility and offer for not eligible applicant', async () => {
    jest.spyOn(eligibilityCalculator, 'checkEligibility').mockImplementation(() => ({
      eligible: false,
      reasons: ['Credit score below minimum threshold'],
      maxAmount: 0,
      rateBand: 'D',
    }));
    jest.spyOn(offerGenerator, 'generateOffer').mockImplementation(() => ({
      status: 'Rejected',
      offer: null,
      reasons: ['Credit score below minimum threshold'],
    }));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Not eligible for loan/i)).toBeInTheDocument();
      expect(screen.getByText(/Credit score below minimum threshold/i)).toBeInTheDocument();
      expect(screen.getByText(/Offer Status: Rejected/i)).toBeInTheDocument();
      expect(screen.getByText(/No preliminary offer generated/i)).toBeInTheDocument();
    });
  });

  it('shows message when no documents uploaded', async () => {
    jest.spyOn(documentUploadMock, 'getDocumentsByApplication').mockImplementation(() => []);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No documents uploaded/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: eligibility and offer missing', async () => {
    jest.spyOn(eligibilityCalculator, 'checkEligibility').mockImplementation(() => null);
    jest.spyOn(offerGenerator, 'generateOffer').mockImplementation(() => null);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No eligibility data available/i)).toBeInTheDocument();
      expect(screen.getByText(/No offer data available/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: maskedUser returns empty object', async () => {
    jest.spyOn(piiMasker, 'maskPIIObject').mockImplementation(() => ({}));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/PII Masked:/i)).toBeInTheDocument();
      expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: error thrown during loading', async () => {
    jest.spyOn(localStorageRepo, 'getApplicationById').mockImplementation(() => { throw new Error('fail'); });
    render(<ApplicationDetail applicationId={application.id} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load application details/i)).toBeInTheDocument();
    });
  });
});