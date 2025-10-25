import type { InvoiceComponentProps } from '../shared/types';
import { PreviewHeader } from './PreviewHeader';
import { PreviewInfo } from './PreviewInfo';
import { PreviewBillTo } from './PreviewBillTo';
import { PreviewSubject } from './PreviewSubject';
import { PreviewLineItems } from './PreviewLineItems';
import { PreviewTotals } from './PreviewTotals';
import { PreviewNotes } from './PreviewNotes';
import { PreviewTerms } from './PreviewTerms';
import { PreviewFooter } from './PreviewFooter';

export default function InvoicePreview({
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
    <div className="p-12 min-h-[297mm]" style={{ width: '210mm', backgroundColor: '#ffffff', color: '#000000' }}>
      <div className="border-2 border-black mb-6">
        <PreviewHeader
          companyName={config.companyName}
          companyLogo={config.companyLogo}
          companyAddress={config.companyAddress}
          companyCity={config.companyCity}
          companyEmail={config.companyEmail}
        />
        <PreviewInfo
          invoiceNumber={config.invoiceNumber}
          invoiceDate={config.invoiceDate}
          terms={config.terms}
          dueDate={config.dueDate}
          poNumber={config.poNumber}
        />
        <PreviewBillTo clientName={config.clientName} />
        {config.subject && <PreviewSubject subject={config.subject} />}
        <PreviewLineItems rows={allRows} />
        <PreviewTotals
          subscriptionTotal={subscriptionTotal}
          oneshotDepositTotal={oneshotDepositTotal}
          grandTotal={grandTotal}
        />
        {config.notes && <PreviewNotes notes={config.notes} />}
        {config.termsAndConditions && <PreviewTerms termsAndConditions={config.termsAndConditions} />}
      </div>
      <PreviewFooter />
    </div>
  );
}

