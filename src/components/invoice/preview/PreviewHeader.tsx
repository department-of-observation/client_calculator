import type { InvoiceHeaderProps } from '../shared/types';

export function PreviewHeader({
  companyName,
  companyLogo,
  companyAddress,
  companyCity,
  companyEmail,
}: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-start p-6 border-b-2 border-black">
      <div className="flex items-start gap-4">
        {companyLogo && (
          <img src={companyLogo} alt="Company Logo" className="w-16 h-16 object-contain" />
        )}
        <div>
          <h1 className="text-2xl font-bold mb-2">{companyName}</h1>
          <p className="text-sm">{companyAddress}</p>
          <p className="text-sm">{companyCity}</p>
          <p className="text-sm">{companyEmail}</p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-5xl font-bold">TAX INVOICE</h2>
      </div>
    </div>
  );
}

