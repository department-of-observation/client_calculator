import type { InvoiceBillToProps } from '../shared/types';

export function PreviewBillTo({ clientName }: InvoiceBillToProps) {
  return (
    <div className="p-4 border-b-2 border-black">
      <div className="font-bold mb-1">Bill To</div>
      <div className="text-lg font-bold">{clientName || 'Client Name'}</div>
    </div>
  );
}

