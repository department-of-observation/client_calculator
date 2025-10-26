import type { InvoiceTotalsProps } from '../shared/types';
import { toWords } from 'number-to-words';
import { formatCurrency } from '@/lib/calculator';

export function PreviewTotals({
  subscriptionTotal,
  depositTotal,
  fullTotal,
  grandTotal,
}: InvoiceTotalsProps) {
  return (
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
  );
}

