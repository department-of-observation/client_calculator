import type { InvoiceNotesProps } from '../shared/types';

export function PreviewNotes({ notes }: InvoiceNotesProps) {
  return (
    <div className="p-4 border-t-2 border-black">
      <div className="font-bold mb-2">Notes</div>
      <div className="whitespace-pre-wrap">{notes}</div>
    </div>
  );
}

