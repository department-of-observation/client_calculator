import type { InvoiceComponentProps } from './shared/types';
import { formatCurrency } from '@/lib/calculator';
import { toWords } from 'number-to-words';

/**
 * Unified Invoice Template Component
 * Used for both preview and as the basis for PDF generation
 * Replaces the duplicate Preview* component hierarchy
 */
export default function InvoiceTemplate({
  config,
  rows,
  subscriptionTotal,
  depositTotal,
  depositOriginalTotal,
  fullTotal,
  grandTotal,
}: InvoiceComponentProps) {
  // Sort rows by payment type for consistent display
  const subscriptionRows = rows.filter(r => r.paymentType === 'subscription');
  const depositRows = rows.filter(r => r.paymentType === 'deposit');
  const fullRows = rows.filter(r => r.paymentType === 'full');
  const allRows = [...subscriptionRows, ...depositRows, ...fullRows];

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-12 min-h-[297mm]" style={{ width: '210mm', backgroundColor: '#ffffff', color: '#000000' }}>
      <div className="border-2 border-black mb-6">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b-2 border-black">
          <div className="flex items-start gap-4">
            {config.companyLogo && (
              <img src={config.companyLogo} alt="Company Logo" className="w-24 h-12 object-contain" />
            )}
            <div>
              <h1 className="text-base font-bold mb-2">{config.companyName}</h1>
              <p className="text-xs">{config.companyAddress}</p>
              <p className="text-xs">{config.companyCity}</p>
              <p className="text-xs">{config.companyEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold">TAX INVOICE</h2>
          </div>
        </div>

        {/* Invoice Info - Two Column Layout matching PDF */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-4 border-r-2 border-black text-xs">
            <div className="flex mb-2">
              <span className="font-bold w-24">#</span>
              <span>: {config.invoiceNumber}</span>
            </div>
            <div className="flex mb-2">
              <span className="font-bold w-24">Invoice Date</span>
              <span>: {formatDate(config.invoiceDate)}</span>
            </div>
            <div className="flex mb-2">
              <span className="font-bold w-24">Terms</span>
              <span>: {config.terms}</span>
            </div>
            <div className="flex mb-2">
              <span className="font-bold w-24">Due Date</span>
              <span>: {formatDate(config.dueDate)}</span>
            </div>
            <div className="flex mb-2">
              <span className="font-bold w-24">P.O.#</span>
              <span>: {config.poNumber || config.invoiceNumber}</span>
            </div>
          </div>
          <div className="p-4 text-xs">
            {config.clientName && (
              <div className="flex mb-2">
                <span className="font-bold w-28">Client Name</span>
                <span>: {config.clientName}</span>
              </div>
            )}
            {config.clientEmail && (
              <div className="flex mb-2">
                <span className="font-bold w-28">Email</span>
                <span>: {config.clientEmail}</span>
              </div>
            )}
            {config.clientWebsite && (
              <div className="flex mb-2">
                <span className="font-bold w-28">Website</span>
                <span>: {config.clientWebsite}</span>
              </div>
            )}
            {config.clientPhone && (
              <div className="flex mb-2">
                <span className="font-bold w-28">Phone</span>
                <span>: {config.clientPhone}</span>
              </div>
            )}
            {config.clientBillingAddress && (
              <div className="flex mb-2">
                <span className="font-bold w-28">Billing Address</span>
                <span>: {config.clientBillingAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bill To - Simplified to match PDF */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold mb-1 text-xs">Bill To</div>
          <div className="text-sm font-bold">{config.clientName || 'Client Name'}</div>
        </div>

        {/* Subject */}
        {config.subject && (
          <div className="p-4 border-b-2 border-black">
            <div className="font-bold mb-1 text-xs">Subject:</div>
            <div className="text-xs">{config.subject}</div>
          </div>
        )}

        {/* Line Items */}
        <div>
          <div className="grid grid-cols-12 gap-2 p-4 border-b font-bold" style={{ backgroundColor: '#f3f4f6', borderColor: '#000000', fontSize: '9px' }}>
            <div className="col-span-1">#</div>
            <div className="col-span-6">Item & Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-1 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {allRows.map((row, index) => {
            const baseAmount = row.price * row.quantity;
            const discountedAmount = baseAmount * (1 - row.discount / 100);
            const displayAmount = row.paymentType === 'deposit' && !row.convertToSubscription
              ? discountedAmount * 0.5
              : discountedAmount;
            
            const displayName = row.paymentType === 'deposit' && !row.convertToSubscription
              ? `50% Deposit - ${row.name}`
              : row.name;

            return (
              <div key={row.id} className="grid grid-cols-12 gap-2 p-4 border-b" style={{ borderColor: '#d1d5db', fontSize: '9px' }}>
                <div className="col-span-1">{index + 1}</div>
                <div className="col-span-6">
                  <div className="font-semibold mb-1">{displayName}</div>
                  {row.description && (
                    <div className="mt-1" style={{ color: '#6b7280', lineHeight: '1.4', fontSize: '8px' }}>{row.description}</div>
                  )}
                  {row.discount > 0 && (
                    <div className="mt-1" style={{ color: '#4b5563', fontSize: '8px' }}>Discount: {row.discount}%</div>
                  )}
                </div>
                <div className="col-span-2 text-right">{row.quantity.toFixed(2)}</div>
                <div className="col-span-1 text-right">{formatCurrency(row.price)}</div>
                <div className="col-span-2 text-right font-semibold">{formatCurrency(displayAmount)}</div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 border-t-2 border-black">
          <div className="p-4">
            <div className="font-bold mb-2 text-xs">Total In Words</div>
            <div className="italic text-xs">{toWords(grandTotal)}</div>
          </div>
          <div className="border-l-2 border-black">
            <div className="flex justify-between p-4 border-b text-xs" style={{ borderColor: '#d1d5db' }}>
              <span className="font-bold">Sub Total</span>
              <span>{formatCurrency(subscriptionTotal + depositTotal + fullTotal)}</span>
            </div>
            <div className="flex justify-between p-4 border-b text-xs" style={{ borderColor: '#d1d5db' }}>
              <span className="font-bold">Total</span>
              <span className="font-bold">SGD{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between p-4 text-xs" style={{ backgroundColor: '#f3f4f6' }}>
              <span className="font-bold">Balance Due</span>
              <span className="font-bold">SGD{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {config.notes && (
          <div className="p-4 border-t-2 border-black">
            <div className="font-bold mb-2 text-xs">Notes:</div>
            <div className="whitespace-pre-wrap text-xs">{config.notes}</div>
          </div>
        )}

        {/* Terms & Conditions */}
        {config.termsAndConditions && (
          <div className="p-4 border-t-2 border-black" style={{ fontSize: '9px' }}>
            <div className="whitespace-pre-wrap">{config.termsAndConditions}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8" style={{ color: '#4b5563', fontSize: '9px' }}>
        Thank you for your business!
      </div>
    </div>
  );
}

