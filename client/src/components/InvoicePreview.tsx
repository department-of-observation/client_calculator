
import type { InvoiceConfig } from '../../../shared/invoice-types';
import type { CalculatorRow } from '../../../shared/types';
import { formatCurrency } from '@/lib/calculator';

interface InvoicePreviewProps {
  config: InvoiceConfig;
  rows: CalculatorRow[];
  subscriptionTotal: number;
  oneshotDepositTotal: number;
  oneshotOriginalTotal: number;
  grandTotal: number;
}

export default function InvoicePreview({ config, rows, subscriptionTotal, oneshotDepositTotal, oneshotOriginalTotal, grandTotal }: InvoicePreviewProps) {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const subscriptionRows = rows.filter(r => r.category === 'subscription');
    const oneshotRows = rows.filter(r => r.category === 'oneshot');
    const allRows = [...subscriptionRows, ...oneshotRows];

  return (
    <div className="p-12 min-h-[297mm]" style={{ width: '210mm', backgroundColor: '#ffffff', color: '#000000' }}>
        {/* Header */}
        <div className="border-2 border-black mb-6">
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
              <h2 className="text-5xl font-bold">TAX INVOICE</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-4 border-r-2 border-black">
              <div className="mb-2">
                <span className="font-bold">#</span>
                <span className="ml-2">: {config.invoiceNumber}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold">Invoice Date</span>
                <span className="ml-2">: {formatDate(config.invoiceDate)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold">Terms</span>
                <span className="ml-2">: {config.terms}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold">Due Date</span>
                <span className="ml-2">: {formatDate(config.dueDate)}</span>
              </div>
              <div>
                <span className="font-bold">P.O.#</span>
                <span className="ml-2">: {config.poNumber || config.invoiceNumber}</span>
              </div>
            </div>
            <div className="p-4">
              {/* Empty right column as per original design */}
            </div>
          </div>

          <div className="p-4 border-b-2 border-black">
            <div className="font-bold mb-1">Bill To</div>
            <div className="text-lg font-bold">{config.clientName || 'Client Name'}</div>
          </div>

          {config.subject && (
            <div className="p-4 border-b-2 border-black">
              <div className="mb-1">
                <span className="font-bold">Subject :</span>
              </div>
              <div>{config.subject}</div>
            </div>
          )}

          {/* Items Table */}
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
              const displayAmount = row.category === 'oneshot' 
                ? discountedAmount * 0.5 
                : discountedAmount;

              return (
                <div key={row.id} className="grid grid-cols-12 gap-2 p-4 border-b text-sm" style={{ borderColor: '#d1d5db' }}>
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-6">
                    <div className="font-semibold">{row.name}</div>
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
              <div className="italic">{numberToWords(grandTotal)}</div>
            </div>
            <div className="border-l-2 border-black">
              <div className="flex justify-between p-4 border-b" style={{ borderColor: '#d1d5db' }}>
                <span className="font-bold">Sub Total</span>
                <span>{formatCurrency(subscriptionTotal + oneshotDepositTotal)}</span>
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
              <div className="font-bold mb-2">Notes</div>
              <div className="whitespace-pre-wrap">{config.notes}</div>
            </div>
          )}

          {/* Terms & Conditions */}
          {config.termsAndConditions && (
            <div className="p-4 border-t-2 border-black">
              <div className="whitespace-pre-wrap text-sm">{config.termsAndConditions}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-8" style={{ color: '#4b5563' }}>
          <div>POWERED BY</div>
        </div>
    </div>
  );
}

// Helper function to convert number to words (simplified)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  }
  
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = '';
  
  if (integerPart >= 1000) {
    result += convertLessThanThousand(Math.floor(integerPart / 1000)) + ' Thousand ';
    result += convertLessThanThousand(integerPart % 1000);
  } else {
    result = convertLessThanThousand(integerPart);
  }
  
  if (decimalPart > 0) {
    result += ' and ' + decimalPart + '/100';
  }
  
  return result.trim();
}

