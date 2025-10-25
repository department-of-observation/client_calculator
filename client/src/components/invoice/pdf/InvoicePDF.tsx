import { Document, Page, View } from '@react-pdf/renderer';
import type { InvoiceComponentProps } from '../shared/types';
import { PDFHeader } from './PDFHeader';
import { PDFInfo } from './PDFInfo';
import { PDFBillTo } from './PDFBillTo';
import { PDFSubject } from './PDFSubject';
import { PDFLineItems } from './PDFLineItems';
import { PDFTotals } from './PDFTotals';
import { PDFNotes } from './PDFNotes';
import { PDFTerms } from './PDFTerms';
import { PDFFooter } from './PDFFooter';
import { styles } from './styles';

export default function InvoicePDF({
  config,
  rows,
  subscriptionTotal,
  oneshotDepositTotal,
  oneshotOriginalTotal,
  grandTotal,
}: InvoiceComponentProps) {
  const subscriptionRows = rows.filter(r => r.category === 'subscription');
  const oneshotRows = rows.filter(r => r.category === 'oneshot');
  const allRows = [...subscriptionRows, ...oneshotRows];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <PDFHeader
            companyName={config.companyName}
            companyLogo={config.companyLogo}
            companyAddress={config.companyAddress}
            companyCity={config.companyCity}
            companyEmail={config.companyEmail}
          />
          <PDFInfo
            invoiceNumber={config.invoiceNumber}
            invoiceDate={config.invoiceDate}
            terms={config.terms}
            dueDate={config.dueDate}
            poNumber={config.poNumber}
            clientName={config.clientName}
            clientEmail={config.clientEmail}
            clientWebsite={config.clientWebsite}
            clientPhone={config.clientPhone}
            clientBillingAddress={config.clientBillingAddress}
          />
          <PDFBillTo clientName={config.clientName} />
          {config.subject && <PDFSubject subject={config.subject} />}
          <PDFLineItems rows={allRows} />
          <PDFTotals
            subscriptionTotal={subscriptionTotal}
            oneshotDepositTotal={oneshotDepositTotal}
            grandTotal={grandTotal}
          />
          {config.notes && <PDFNotes notes={config.notes} />}
          {config.termsAndConditions && <PDFTerms termsAndConditions={config.termsAndConditions} />}
        </View>
        <PDFFooter />
      </Page>
    </Document>
  );
}

