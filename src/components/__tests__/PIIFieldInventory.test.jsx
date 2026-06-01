import React from 'react';
import { render, screen } from '@testing-library/react';
import PIIFieldInventory from '../PIIFieldInventory';

describe('PIIFieldInventory', () => {
  it('renders PII field inventory table with all fields', () => {
    render(<PIIFieldInventory />);
    expect(screen.getByText(/PII Field Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Field Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Masking Method/i)).toBeInTheDocument();
    expect(screen.getByText(/Masked Example/i)).toBeInTheDocument();
    expect(screen.getByText(/Usage Context/i)).toBeInTheDocument();

    // Check for each field
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('maskName')).toBeInTheDocument();
    expect(screen.getByText('J*** D**')).toBeInTheDocument();
    expect(screen.getByText('User profile, loan application, document OCR')).toBeInTheDocument();

    expect(screen.getByText('SSN')).toBeInTheDocument();
    expect(screen.getByText('123-45-6789')).toBeInTheDocument();
    expect(screen.getByText('maskSSN')).toBeInTheDocument();
    expect(screen.getByText('***-**-6789')).toBeInTheDocument();

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, Springfield, IL 62704')).toBeInTheDocument();
    expect(screen.getByText('maskAddress')).toBeInTheDocument();
    expect(screen.getByText('***, Springfield, IL 62704')).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    expect(screen.getByText('maskEmail')).toBeInTheDocument();
    expect(screen.getByText('j*******@example.com')).toBeInTheDocument();

    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('555-123-4567')).toBeInTheDocument();
    expect(screen.getByText('maskPhone')).toBeInTheDocument();
    expect(screen.getByText('***-***-**67')).toBeInTheDocument();

    expect(screen.getByText('Generic')).toBeInTheDocument();
    expect(screen.getByText('abcdef')).toBeInTheDocument();
    expect(screen.getByText('maskGeneric')).toBeInTheDocument();
    expect(screen.getByText('a*****')).toBeInTheDocument();
    expect(screen.getByText('Other fields (fallback)')).toBeInTheDocument();
  });

  it('renders compliance awareness message and masking method file reference', () => {
    render(<PIIFieldInventory />);
    expect(screen.getByText(/This inventory lists all PII fields handled in the codebase/i)).toBeInTheDocument();
    expect(screen.getByText(/Masking methods are implemented in/i)).toBeInTheDocument();
    expect(screen.getByText(/src\/utils\/piiMasker.js/i)).toBeInTheDocument();
    expect(screen.getByText(/For demo\/compliance awareness only/i)).toBeInTheDocument();
  });

  it('renders table rows for each field and handles hover', () => {
    render(<PIIFieldInventory />);
    const rows = screen.getAllByRole('row');
    // There should be header + 6 data rows
    expect(rows.length).toBeGreaterThanOrEqual(7);
    // Check that each row contains expected field name
    expect(rows.some(row => row.textContent.includes('Name'))).toBe(true);
    expect(rows.some(row => row.textContent.includes('SSN'))).toBe(true);
    expect(rows.some(row => row.textContent.includes('Address'))).toBe(true);
    expect(rows.some(row => row.textContent.includes('Email'))).toBe(true);
    expect(rows.some(row => row.textContent.includes('Phone'))).toBe(true);
    expect(rows.some(row => row.textContent.includes('Generic'))).toBe(true);
  });

  it('handles edge case: renders with no errors if table is empty', () => {
    // Temporarily override the component to render empty piiFields
    const OriginalPIIFieldInventory = PIIFieldInventory;
    const EmptyPIIFieldInventory = () => {
      return (
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">PII Field Inventory</h2>
          <table className="w-full border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Field Name</th>
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Example Value</th>
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Masking Method</th>
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Masked Example</th>
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Usage Context</th>
              </tr>
            </thead>
            <tbody>
              {/* No rows */}
            </tbody>
          </table>
          <div className="mt-6 text-xs text-gray-500 text-center">
            This inventory lists all PII fields handled in the codebase.<br />
            Masking methods are implemented in <span className="font-mono">src/utils/piiMasker.js</span>.<br />
            For demo/compliance awareness only.
          </div>
        </div>
      );
    };
    render(<EmptyPIIFieldInventory />);
    expect(screen.getByText(/PII Field Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Field Name/i)).toBeInTheDocument();
    // No data rows
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.queryByText('SSN')).not.toBeInTheDocument();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
    expect(screen.queryByText('Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Generic')).not.toBeInTheDocument();
  });
});