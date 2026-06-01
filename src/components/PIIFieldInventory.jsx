import React from 'react';

/**
 * PIIFieldInventory: UI for listing all PII fields inventoried in the codebase (demo/compliance).
 * Shows field names, example values, masking method, and usage context.
 * For demo/compliance awareness.
 * @returns {JSX.Element}
 */
function PIIFieldInventory() {
  // Inventory of PII fields used in the codebase
  const piiFields = [
    {
      name: 'Name',
      example: 'John Doe',
      masking: 'maskName',
      maskedExample: 'J*** D**',
      context: 'User profile, loan application, document OCR',
    },
    {
      name: 'SSN',
      example: '123-45-6789',
      masking: 'maskSSN',
      maskedExample: '***-**-6789',
      context: 'User profile, loan application, document OCR',
    },
    {
      name: 'Address',
      example: '123 Main St, Springfield, IL 62704',
      masking: 'maskAddress',
      maskedExample: '***, Springfield, IL 62704',
      context: 'User profile, loan application',
    },
    {
      name: 'Email',
      example: 'johndoe@example.com',
      masking: 'maskEmail',
      maskedExample: 'j*******@example.com',
      context: 'User profile, loan application',
    },
    {
      name: 'Phone',
      example: '555-123-4567',
      masking: 'maskPhone',
      maskedExample: '***-***-**67',
      context: 'User profile, loan application',
    },
    {
      name: 'Generic',
      example: 'abcdef',
      masking: 'maskGeneric',
      maskedExample: 'a*****',
      context: 'Other fields (fallback)',
    },
  ];

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
          {piiFields.map((field, idx) => (
            <tr key={field.name} className="hover:bg-blue-50 transition">
              <td className="py-2 px-3 text-sm text-gray-800">{field.name}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{field.example}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{field.masking}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{field.maskedExample}</td>
              <td className="py-2 px-3 text-xs text-gray-500">{field.context}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-xs text-gray-500 text-center">
        This inventory lists all PII fields handled in the codebase.<br />
        Masking methods are implemented in <span className="font-mono">src/utils/piiMasker.js</span>.<br />
        For demo/compliance awareness only.
      </div>
    </div>
  );
}

export default PIIFieldInventory;