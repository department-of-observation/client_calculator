import type { InvoiceLineItemsProps } from '../shared/types';
import { calculateLineItemAmount } from '../utils/calculations';
import { formatCurrency } from '@/lib/calculator';

export function PreviewLineItems({ rows }: InvoiceLineItemsProps) {
  return (
    <div>
      <div className="grid grid-cols-12 gap-2 p-4 border-b font-bold text-sm" style={{ backgroundColor: '#f3f4f6', borderColor: '#000000' }}>
        <div className="col-span-1">#</div>
        <div className="col-span-6">Item & Description</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-1 text-right">Rate</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      {rows.map((row, index) => {
        const displayAmount = calculateLineItemAmount(
          row.price,
          row.quantity,
          row.discount,
          row.category,
          row.isFullPayment
        );

        // Add "50% Deposit - " prefix for oneshot items in deposit mode
        const displayName = row.category === 'oneshot' && !row.isFullPayment 
          ? `50% Deposit - ${row.name}` 
          : row.name;

        return (
          <div key={row.id} className="grid grid-cols-12 gap-2 p-4 border-b text-sm" style={{ borderColor: '#d1d5db' }}>
            <div className="col-span-1">{index + 1}</div>
            <div className="col-span-6">
              <div className="font-semibold">{displayName}</div>
              {row.Description && (
                <div className="text-xs mt-1" style={{ color: '#6b7280', lineHeight: '1.4' }}>{row.Description}</div>
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
  );
}

