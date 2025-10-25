export interface InvoiceConfig {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyEmail: string;
  companyLogo?: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  terms: string;
  dueDate: string;
  poNumber: string;
  
  // Client Info
  clientName: string;
  
  // Content
  subject: string;
  notes: string;
  termsAndConditions: string;
}

export const DEFAULT_INVOICE_CONFIG: InvoiceConfig = {
  companyName: 'Snap Gen Digital',
  companyAddress: 'Punggol',
  companyCity: 'Singapore',
  companyEmail: 'chewjiefeng@gmail.com',
  companyLogo: '/client_calculator/logo.png',
  invoiceNumber: 'INV-000001',
  invoiceDate: new Date().toISOString().split('T')[0],
  terms: 'Custom',
  dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  poNumber: '',
  clientName: '',
  subject: '',
  notes: 'Thanks for your business.',
  termsAndConditions: `Payment Instructions:
1. PayNow to ‪+65 9423 6920‬ Or bank transfer to 0122792416.
2. Once payment is sent through, please send a screenshot to ‪+65 9423 6920‬ via WhatsApp for verification.
3. If client is paying via GIRO, please send a screenshot of the payment release date to ‪+65 9423 6920‬ via WhatsApp for verification.

Terms & Conditions:
1. A 50% non-refundable deposit is required upfront before any work commences.
2. The balance payment is due upon completion and prior to delivery of the final materials.
3. For support/retainer packages, full payment must be made upfront before any work commences.
4. If the client cancels the project midway, all deposits and payments made remain non-refundable.
5. All other terms and conditions apply as stated in our Service Agreement (if applicable) and this Invoice.
6. Any terms, conditions, or obligations not expressly stated in this Invoice shall not apply.
7. All bank charges, currency conversion fees, and international transfer fees are to be borne by the Client. Net amount payable must match the invoiced amount.
`
};

