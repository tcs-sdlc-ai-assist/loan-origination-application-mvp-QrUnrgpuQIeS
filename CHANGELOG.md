# Changelog

## [1.0.0] - 2024-06-01

### Added

- Initial release of **Loan Origination MVP**.
- Customer Intake Form: Submit loan applications, see eligibility and preliminary offer.
- Document Upload (Mocked): Upload supporting documents (PDF/JPG/PNG), metadata stored locally.
- Eligibility Calculator: Rule-based eligibility logic (credit score, DTI, income, amount).
- Offer Generator: Preliminary loan offer calculation (rate band, EMI, term).
- Internal Dashboard: Ops team can review applications, update status, mask PII.
- PII Masking: All sensitive fields masked in UI for compliance awareness.
- Mock Credit Bureau & OCR: Simulated credit check and document extraction.
- Demo Login: Simulated login for customer/internal roles.
- 404 Handling: Friendly not-found page.
- LocalStorage Repo: All data stored in browser localStorage (no backend).
- Testing: Comprehensive component/unit tests with @testing-library/react + Vitest.
- Demo data seeding and clearing utilities.

### Setup

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Run tests: `npm run test`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

---

For detailed usage and features, see [README.md](./README.md).