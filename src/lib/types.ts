// Payment types - defines how payment is handled
export type PaymentType = 'subscription' | 'deposit' | 'full';

export interface PricingItem {
  name: string;
  price: number;
  category: string; // Category name (e.g., "Web Design", "Content Creation")
  paymentType: PaymentType; // Payment type determines functionality
  description?: string;
  shortDescription?: string;
}

export interface CalculatorRow extends PricingItem {
  id: string;
  quantity: number;
  discount: number; // percentage (0-100)
  convertToSubscription?: boolean; // For deposit items: true = convert to subscription, false/undefined = keep as deposit
}

// Invoice types - document configuration and rendering props
export type DocumentType = 'invoice' | 'quote';

export interface InvoiceConfig {
  // Document Type
  documentType: DocumentType;

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
  clientEmail: string;
  clientWebsite: string;
  clientPhone: string;
  clientBillingAddress: string;

  // Content
  subject: string;
  notes: string;
  termsAndConditions: string;
}

export interface InvoiceHeaderProps {
  documentType: DocumentType;
  companyName: string;
  companyLogo?: string;
  companyAddress: string;
  companyCity: string;
  companyEmail: string;
}

export interface InvoiceInfoProps {
  documentType: DocumentType;
  invoiceNumber: string;
  invoiceDate: string;
  terms: string;
  dueDate: string;
  poNumber: string;
  clientName: string;
  clientEmail: string;
  clientWebsite: string;
  clientPhone: string;
  clientBillingAddress: string;
}

export interface InvoiceBillToProps {
  clientName: string;
}

export interface InvoiceSubjectProps {
  subject: string;
}

export interface InvoiceLineItemsProps {
  rows: CalculatorRow[];
}

export interface InvoiceTotalsProps {
  subscriptionTotal: number;
  depositTotal: number;
  fullTotal: number;
  grandTotal: number;
}

export interface InvoiceNotesProps {
  notes: string;
}

export interface InvoiceTermsProps {
  termsAndConditions: string;
}

export interface InvoiceComponentProps {
  config: InvoiceConfig;
  rows: CalculatorRow[];
  subscriptionTotal: number;
  depositTotal: number;
  depositOriginalTotal: number;
  fullTotal: number;
  grandTotal: number;
}

