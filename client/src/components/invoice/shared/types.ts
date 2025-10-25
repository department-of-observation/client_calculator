import type { InvoiceConfig } from '../../../../../shared/invoice-types';
import type { CalculatorRow } from '../../../../../shared/types';

export interface InvoiceHeaderProps {
  companyName: string;
  companyLogo?: string;
  companyAddress: string;
  companyCity: string;
  companyEmail: string;
}

export interface InvoiceInfoProps {
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

