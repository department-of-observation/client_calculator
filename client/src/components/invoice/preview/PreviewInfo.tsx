import type { InvoiceInfoProps } from '../shared/types';
import { formatDate } from '../utils/formatters';

export function PreviewInfo({
  invoiceNumber,
  invoiceDate,
  terms,
  dueDate,
  poNumber,
}: InvoiceInfoProps) {
  return (
    <div className="grid grid-cols-2 border-b-2 border-black">
      <div className="p-4 border-r-2 border-black">
        <div className="mb-2">
          <span className="font-bold">#</span>
          <span className="ml-2">: {invoiceNumber}</span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Invoice Date</span>
          <span className="ml-2">: {formatDate(invoiceDate)}</span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Terms</span>
          <span className="ml-2">: {terms}</span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Due Date</span>
          <span className="ml-2">: {formatDate(dueDate)}</span>
        </div>
        <div>
          <span className="font-bold">P.O.#</span>
          <span className="ml-2">: {poNumber || invoiceNumber}</span>
        </div>
      </div>
      <div className="p-4">
        {/* Empty right column as per original design */}
      </div>
    </div>
  );
}

