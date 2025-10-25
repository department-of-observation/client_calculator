import type { InvoiceTermsProps } from '../shared/types';

export function PreviewTerms({ termsAndConditions }: InvoiceTermsProps) {
  return (
    <div className="p-4 border-t-2 border-black">
      <div className="whitespace-pre-wrap text-sm">{termsAndConditions}</div>
    </div>
  );
}

