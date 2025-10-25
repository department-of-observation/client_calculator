import type { InvoiceSubjectProps } from '../shared/types';

export function PreviewSubject({ subject }: InvoiceSubjectProps) {
  return (
    <div className="p-4 border-b-2 border-black">
      <div className="mb-1">
        <span className="font-bold">Subject :</span>
      </div>
      <div>{subject}</div>
    </div>
  );
}

