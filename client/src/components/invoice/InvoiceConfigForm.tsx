import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InvoiceConfig, DocumentType } from '../../../../shared/invoice-types';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceConfigFormProps {
  config: InvoiceConfig;
  onChange: (config: InvoiceConfig) => void;
}

export default function InvoiceConfigForm({ config, onChange }: InvoiceConfigFormProps) {
  const updateField = (field: keyof InvoiceConfig, value: string | boolean) => {
    onChange({ ...config, [field]: value });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateField('companyLogo', result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyLogo">Company Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              {config.companyLogo && (
                <img src={config.companyLogo} alt="Company Logo" className="w-16 h-16 object-contain border rounded" />
              )}
              <label htmlFor="logo-upload">
                <Button variant="outline" asChild>
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </span>
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
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
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <SelectPrimitive.Root
              value={config.documentType}
              onValueChange={(value) => updateField('documentType', value as DocumentType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="quote">Quote</SelectItem>
              </SelectContent>
            </SelectPrimitive.Root>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">{config.documentType === 'quote' ? 'Quote Number' : 'Invoice Number'}</Label>
              <Input
                id="invoiceNumber"
                value={config.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="poNumber">P.O. Number</Label>
              <Input
                id="poNumber"
                value={config.poNumber}
                onChange={(e) => updateField('poNumber', e.target.value)}
                placeholder="Purchase Order Number"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceDate">{config.documentType === 'quote' ? 'Date' : 'Invoice Date'}</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={config.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="terms">Terms</Label>
              <Input
                id="terms"
                value={config.terms}
                onChange={(e) => updateField('terms', e.target.value)}
                placeholder="e.g., Custom, Net 30"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={config.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={config.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              placeholder="e.g., Ruhan College Pte. Ltd"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={config.clientEmail}
                onChange={(e) => updateField('clientEmail', e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Phone</Label>
              <Input
                id="clientPhone"
                value={config.clientPhone}
                onChange={(e) => updateField('clientPhone', e.target.value)}
                placeholder="+65 1234 5678"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clientWebsite">Website</Label>
            <Input
              id="clientWebsite"
              value={config.clientWebsite}
              onChange={(e) => updateField('clientWebsite', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label htmlFor="clientBillingAddress">Billing Address</Label>
            <Textarea
              id="clientBillingAddress"
              value={config.clientBillingAddress}
              onChange={(e) => updateField('clientBillingAddress', e.target.value)}
              rows={3}
              placeholder="Street address, city, postal code, country"
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
              placeholder="e.g., Payments to be made for work to start"
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
              rows={8}
              placeholder="Terms and conditions..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

