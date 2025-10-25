'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Download, FileText, Settings, Printer } from 'lucide-react';
import readXlsxFile from 'read-excel-file';
import type { PricingItem, CalculatorRow as CalculatorRowType } from '@shared/types';
import type { InvoiceConfig } from '@shared/invoice-types';
import { DEFAULT_INVOICE_CONFIG } from '@shared/invoice-types';
import CategorySection from '@/components/CategorySection';
import InvoiceConfigForm from '@/components/invoice/InvoiceConfigForm';
import InvoicePreview from '@/components/invoice/preview/InvoicePreview';
import InvoicePDF from '@/components/invoice/pdf/InvoicePDF';
import { pdf } from '@react-pdf/renderer';
import { calculateTotals, formatCurrency } from '@/lib/calculator';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [rows, setRows] = useState<CalculatorRowType[]>([]);
  const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig>(DEFAULT_INVOICE_CONFIG);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      const response = await fetch('/pricing.xlsx');
      const blob = await response.blob();
      await parseXlsxData(blob);
    } catch (error) {
      toast.error('Failed to load sample data');
      console.error(error);
    }
  };

  const parseXlsxData = async (file: File | Blob) => {
    try {
      const rows = await readXlsxFile(file);
      const items = rows.slice(1).map((row) => ({
        name: String(row[0] || ''),
        price: parseFloat(String(row[1])) || 0,
        category: (row[2] === 'subscription' ? 'subscription' : 'oneshot') as 'subscription' | 'oneshot',
        Description: String(row[3] || '')
      }));
      setPricingItems(items);
      toast.success(`Loaded ${items.length} pricing items`);
    } catch (error) {
      toast.error('Failed to parse XLSX');
      console.error(error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    parseXlsxData(file);
  };

  const addRow = (item: PricingItem) => {
    const newRow: CalculatorRowType = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      quantity: 1,
      discount: 0,
      isFullPayment: false
    };
    setRows([...rows, newRow]);
    toast.success(`Added ${item.name}`);
  };

  const updateRow = (id: string, updates: Partial<CalculatorRowType>) => {
    setRows(rows.map(row => row.id === id ? { ...row, ...updates } : row));
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
    toast.success('Item removed');
  };

  const exportData = () => {
    const totals = calculateTotals(rows);
    const exportData = { items: rows, totals, invoiceConfig };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${invoiceConfig.invoiceNumber}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Quote exported');
  };

  const printInvoice = async () => {
    if (rows.length === 0) {
      toast.error('Please add items before generating invoice');
      return;
    }
    try {
      toast.info('Generating PDF...');
      const blob = await pdf(
        <InvoicePDF
          config={invoiceConfig}
          rows={rows}
          subscriptionTotal={totals.subscriptionTotal}
          oneshotDepositTotal={totals.oneshotDepositTotal}
          oneshotOriginalTotal={totals.oneshotOriginalTotal}
          grandTotal={totals.grandTotal}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceConfig.invoiceNumber}-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const subscriptionRows = rows.filter(r => r.category === 'subscription');
  const oneshotRows = rows.filter(r => r.category === 'oneshot');
  const totals = calculateTotals(rows);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Client Pricing Calculator</h1>
              <p className="text-muted-foreground mt-2">Import pricing data and generate custom quotes</p>
            </div>
            {rows.length > 0 && (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Invoice Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Invoice Configuration</DialogTitle>
                      <DialogDescription>Configure company details and invoice settings</DialogDescription>
                    </DialogHeader>
                    <InvoiceConfigForm config={invoiceConfig} onChange={setInvoiceConfig} />
                  </DialogContent>
                </Dialog>
                <Button variant={showInvoice ? "default" : "outline"} onClick={() => setShowInvoice(!showInvoice)}>
                  <FileText className="mr-2 h-4 w-4" />
                  {showInvoice ? 'Hide Invoice' : 'Preview Invoice'}
                </Button>
                {showInvoice && (
                  <Button onClick={printInvoice}>
                    <Printer className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs value={showInvoice ? "invoice" : "calculator"} onValueChange={(v) => setShowInvoice(v === "invoice")}>
          <TabsList className="mb-6">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="invoice" disabled={rows.length === 0}>Invoice Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="flex gap-3 mb-8">
              <label htmlFor="xlsx-upload">
                <Button variant="outline" asChild>
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Import XLSX
                  </span>
                </Button>
                <input id="xlsx-upload" type="file" accept=".xlsx" onChange={handleFileUpload} className="hidden" />
              </label>
              <Select onValueChange={(value) => {
                const item = pricingItems.find(i => i.name === value);
                if (item) addRow(item);
              }}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Add item to quote..." />
                </SelectTrigger>
                <SelectContent>
                  {pricingItems.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name} - {formatCurrency(item.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rows.length > 0 && (
                <Button variant="outline" onClick={exportData} className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              )}
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No items added yet</p>
                <p className="text-sm mt-2">Select items from the dropdown above</p>
              </div>
            ) : (
              <>
                <CategorySection
                  title="Subscription Packages"
                  subtitle="Monthly recurring services"
                  rows={subscriptionRows}
                  total={totals.subscriptionTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />
                <CategorySection
                  title="One-Shot Packages"
                  subtitle="One-time services - 50% deposit"
                  rows={oneshotRows}
                  total={totals.oneshotDepositTotal}
                  originalTotal={totals.oneshotOriginalTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />
                <div className="bg-primary text-primary-foreground rounded-lg p-6 mt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">Grand Total</h3>
                      <p className="text-sm opacity-90 mt-1">Total due upfront</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{formatCurrency(totals.grandTotal)}</div>
                      {totals.oneshotOriginalTotal > totals.oneshotDepositTotal && (
                        <div className="text-sm opacity-90 mt-1">
                          Balance: {formatCurrency(totals.oneshotOriginalTotal - totals.oneshotDepositTotal)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="invoice">
            <div className="flex justify-center">
              <div className="shadow-2xl">
                <InvoicePreview
                  config={invoiceConfig}
                  rows={rows}
                  subscriptionTotal={totals.subscriptionTotal}
                  oneshotDepositTotal={totals.oneshotDepositTotal}
                  oneshotOriginalTotal={totals.oneshotOriginalTotal}
                  grandTotal={totals.grandTotal}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

