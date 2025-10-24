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
  expiryDate: string;
  referenceNumber: string;
  
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
  invoiceNumber: 'QT-000001',
  invoiceDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  referenceNumber: 'QT-000001',
  clientName: '',
  subject: '',
  notes: 'Looking forward for your business.',
  termsAndConditions: 'Anything not explicitly mentioned above (e.g., extra revisions, shoot time, music, voiceovers, B-roll, social media formatting, additional graphics, or extended video length) is not included and will be billed separately if requested.'
};

