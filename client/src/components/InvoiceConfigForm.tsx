import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InvoiceConfig } from '../../../shared/invoice-types';

interface InvoiceConfigFormProps {
  config: InvoiceConfig;
  onChange: (config: InvoiceConfig) => void;
}

export default function InvoiceConfigForm({ config, onChange }: InvoiceConfigFormProps) {
  const updateField = (field: keyof InvoiceConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={config.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={config.companyEmail}
                onChange={(e) => updateField('companyEmail', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyAddress">Address</Label>
              <Input
                id="companyAddress"
                value={config.companyAddress}
                onChange={(e) => updateField('companyAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyCity">City/Country</Label>
              <Input
                id="companyCity"
                value={config.companyCity}
                onChange={(e) => updateField('companyCity', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={config.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                value={config.referenceNumber}
                onChange={(e) => updateField('referenceNumber', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={config.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={config.expiryDate}
                onChange={(e) => updateField('expiryDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={config.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              placeholder="e.g., Ruhan College Pte. Ltd"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={config.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="e.g., Website monthly support packages"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={config.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes for the client..."
            />
          </div>
          <div>
            <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={config.termsAndConditions}
              onChange={(e) => updateField('termsAndConditions', e.target.value)}
              rows={4}
              placeholder="Terms and conditions..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

