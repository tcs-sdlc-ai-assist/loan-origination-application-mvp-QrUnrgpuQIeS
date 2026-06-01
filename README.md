# Loan Origination MVP

A demo web application for loan origination, featuring customer intake, eligibility calculation, document upload (mocked), internal review dashboard, and compliance PII masking. All data is stored locally for demo purposes.

---

## Tech Stack

- **React JS** (18.x)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **JavaScript** (ES2022+)
- **@testing-library/react** (component tests)
- **Vitest** (test runner)
- **PropTypes** (runtime prop validation)

---

## Features

- **Customer Intake Form**: Submit loan applications, see eligibility and preliminary offer.
- **Document Upload (Mocked)**: Upload supporting documents (PDF/JPG/PNG), metadata stored locally.
- **Eligibility Calculator**: Rule-based eligibility logic (credit score, DTI, income, amount).
- **Offer Generator**: Preliminary loan offer calculation (rate band, EMI, term).
- **Internal Dashboard**: Ops team can review applications, update status, mask PII.
- **PII Masking**: All sensitive fields masked in UI for compliance awareness.
- **Mock Credit Bureau & OCR**: Simulated credit check and document extraction.
- **Demo Login**: Simulated login for customer/internal roles.
- **404 Handling**: Friendly not-found page.
- **LocalStorage Repo**: All data stored in browser localStorage (no backend).
- **Testing**: Comprehensive component/unit tests with @testing-library/react + Vitest.

---

## Folder Structure

```
loan-origination-mvp/
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── components/      # React components (UI, forms, dashboards)
│   │   └── __tests__/   # Component/unit tests
│   ├── context/         # AppContext (global state)
│   ├── utils/           # Shared utilities (eligibility, offer, PII masking, demo data)
│   ├── index.css        # Tailwind CSS entrypoint
│   ├── main.jsx         # App bootstrap (ReactDOM)
│   ├── App.jsx          # Main app component
│   ├── routes.jsx       # Route config (demo, not real routing)
│   └── ...              # Other files/components
├── index.html           # Vite entrypoint
├── package.json         # Dependencies and scripts
├── postcss.config.js    # Tailwind config
├── tailwind.config.js   # Tailwind config
├── vite.config.js       # Vite config
├── vitest.config.js     # Test config
├── .env.example         # Example env vars
├── .gitignore           # Git ignore rules
└── README.md            # Project overview (this file)
```

---

## Setup & Usage

### 1. Install dependencies

```
npm install
```

### 2. Start development server

```
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run tests

```
npm run test
```

### 4. Build for production

```
npm run build
```

### 5. Preview production build

```
npm run preview
```

---

## Demo Data

- All data is stored in browser localStorage.
- Use the **Demo Login** to simulate customer or internal ops user.
- Applications, documents, and users are generated for demo/testing.

---

## Compliance & PII Masking

- All PII fields (name, SSN, address, email, phone) are masked in UI for compliance awareness.
- See `src/components/PIIFieldInventory.jsx` and `src/utils/piiMasker.js` for masking logic.

---

## License

**Private** — For internal demo and evaluation only. Not for production use.

---

## Notes

- No backend/API — all logic is client-side and local.
- No real authentication, credit bureau, or document processing.
- For demo, testing, and compliance awareness only.

---

## Authors

- Internal Engineering Team

---

## Questions

For questions or feedback, contact the project owner.

---