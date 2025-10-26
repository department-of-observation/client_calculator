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

  return (
    <div className="p-12 min-h-[297mm]" style={{ width: '210mm', backgroundColor: '#ffffff', color: '#000000' }}>
      <div className="border-2 border-black mb-6">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b-2 border-black">
          <div className="flex items-start gap-4">
            {config.companyLogo && (
              <img src={config.companyLogo} alt="Company Logo" className="w-16 h-16 object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold mb-2">{config.companyName}</h1>
              <p className="text-sm">{config.companyAddress}</p>
              <p className="text-sm">{config.companyCity}</p>
              <p className="text-sm">{config.companyEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold">INVOICE</h2>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-4 border-r-2 border-black">
            <div className="mb-2">
              <span className="font-bold">Invoice #:</span> {config.invoiceNumber}
            </div>
            <div className="mb-2">
              <span className="font-bold">Date:</span> {config.invoiceDate}
            </div>
            <div className="mb-2">
              <span className="font-bold">Terms:</span> {config.terms}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <span className="font-bold">Due Date:</span> {config.dueDate}
            </div>
            {config.poNumber && (
              <div className="mb-2">
                <span className="font-bold">PO Number:</span> {config.poNumber}
              </div>
            )}
          </div>
        </div>

        {/* Bill To */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold mb-1">Bill To:</div>
          <div className="text-lg font-bold">{config.clientName}</div>
          {config.clientEmail && <div className="text-sm">{config.clientEmail}</div>}
          {config.clientPhone && <div className="text-sm">{config.clientPhone}</div>}
          {config.clientWebsite && <div className="text-sm">{config.clientWebsite}</div>}
          {config.clientBillingAddress && <div className="text-sm">{config.clientBillingAddress}</div>}
        </div>

        {/* Subject */}
        {config.subject && (
          <div className="p-4 border-b-2 border-black">
            <div className="font-bold mb-1">Subject:</div>
            <div>{config.subject}</div>
          </div>
        )}

        {/* Line Items */}
        <div>
          <div className="grid grid-cols-12 gap-2 p-4 border-b font-bold text-sm" style={{ backgroundColor: '#f3f4f6', borderColor: '#000000' }}>
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
              <div key={row.id} className="grid grid-cols-12 gap-2 p-4 border-b text-sm" style={{ borderColor: '#d1d5db' }}>
                <div className="col-span-1">{index + 1}</div>
                <div className="col-span-6">
                  <div className="font-semibold">{displayName}</div>
                  {row.description && (
                    <div className="text-xs mt-1" style={{ color: '#6b7280', lineHeight: '1.4' }}>{row.description}</div>
                  )}
                  {row.discount > 0 && (
                    <div className="text-xs mt-1" style={{ color: '#4b5563' }}>Discount: {row.discount}%</div>
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
            <div className="font-bold mb-2">Total In Words</div>
            <div className="italic">{toWords(grandTotal)}</div>
          </div>
          <div className="border-l-2 border-black">
            <div className="flex justify-between p-4 border-b" style={{ borderColor: '#d1d5db' }}>
              <span className="font-bold">Sub Total</span>
              <span>{formatCurrency(subscriptionTotal + depositTotal + fullTotal)}</span>
            </div>
            <div className="flex justify-between p-4 border-b" style={{ borderColor: '#d1d5db' }}>
              <span className="font-bold">Total</span>
              <span className="font-bold">SGD{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between p-4" style={{ backgroundColor: '#f3f4f6' }}>
              <span className="font-bold text-lg">Balance Due</span>
              <span className="font-bold text-lg">SGD{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {config.notes && (
          <div className="p-4 border-t-2 border-black">
            <div className="font-bold mb-2">Notes:</div>
            <div className="whitespace-pre-wrap">{config.notes}</div>
          </div>
        )}

        {/* Terms & Conditions */}
        {config.termsAndConditions && (
          <div className="p-4 border-t-2 border-black text-xs">
            <div className="whitespace-pre-wrap">{config.termsAndConditions}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs" style={{ color: '#4b5563' }}>
        Thank you for your business!
      </div>
    </div>
  );
}

