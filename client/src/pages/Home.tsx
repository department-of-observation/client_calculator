import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Download, FileText, Settings } from 'lucide-react';
import Papa from 'papaparse';
import type { PricingItem, CalculatorRow as CalculatorRowType } from '../../../shared/types';
import type { InvoiceConfig } from '../../../shared/invoice-types';
import { DEFAULT_INVOICE_CONFIG } from '../../../shared/invoice-types';
import CategorySection from '@/components/CategorySection';
import InvoiceConfigForm from '@/components/InvoiceConfigForm';
import InvoicePreview from '@/components/InvoicePreview';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [rows, setRows] = useState<CalculatorRowType[]>([]);
  const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig>(DEFAULT_INVOICE_CONFIG);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Load sample CSV on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      const response = await fetch('/sample-pricing.csv');
      const csvText = await response.text();
      parseCsvData(csvText);
    } catch (error) {
      toast.error('Failed to load sample data');
      console.error(error);
    }
  };

  const parseCsvData = (csvText: string) => {
    Papa.parse<PricingItem>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const items = results.data.map((item) => ({
          name: item.name,
          price: parseFloat(String(item.price)) || 0,
          category: (item.category === 'subscription' ? 'subscription' : 'oneshot') as 'subscription' | 'oneshot'
        }));
        setPricingItems(items);
        toast.success(`Loaded ${items.length} pricing items`);
      },
      error: (error: Error) => {
        toast.error('Failed to parse CSV');
        console.error(error);
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCsvData(text);
    };
    reader.readAsText(file);
  };

  const addRow = (item: PricingItem) => {
    const newRow: CalculatorRowType = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      quantity: 1,
      discount: 0
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
    const exportData = {
      items: rows,
      totals,
      invoiceConfig
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${invoiceConfig.invoiceNumber}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Quote exported');
  };

  const generatePDF = async () => {
    if (!invoiceRef.current || rows.length === 0) {
      toast.error('Please add items before generating invoice');
      return;
    }

    setIsGeneratingPDF(true);
    toast.info('Generating PDF...');

    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoiceConfig.invoiceNumber}.pdf`);
      
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
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
              <p className="text-muted-foreground mt-2">
                Import pricing data and generate custom quotes with quantity and discount controls
              </p>
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
                      <DialogDescription>
                        Configure company details, client information, and invoice settings
                      </DialogDescription>
                    </DialogHeader>
                    <InvoiceConfigForm config={invoiceConfig} onChange={setInvoiceConfig} />
                  </DialogContent>
                </Dialog>

                <Button 
                  variant={showInvoice ? "default" : "outline"}
                  onClick={() => setShowInvoice(!showInvoice)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {showInvoice ? 'Hide Invoice' : 'Preview Invoice'}
                </Button>

                {showInvoice && (
                  <Button onClick={generatePDF} disabled={isGeneratingPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
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
            {/* Controls */}
            <div className="flex gap-3 mb-8">
              <label htmlFor="csv-upload">
                <Button variant="outline" asChild>
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </span>
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
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

            {/* Calculator Sections */}
            {rows.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No items added yet</p>
                <p className="text-sm mt-2">Select items from the dropdown above to start building a quote</p>
              </div>
            ) : (
              <>
                <CategorySection
                  title="Subscription Packages"
                  subtitle="Monthly recurring services - paid in full at start of month"
                  rows={subscriptionRows}
                  total={totals.subscriptionTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />

                <CategorySection
                  title="One-Shot Packages"
                  subtitle="One-time services - 50% deposit upfront, balance on delivery"
                  rows={oneshotRows}
                  total={totals.oneshotDepositTotal}
                  originalTotal={totals.oneshotOriginalTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />

                {/* Grand Total */}
                <div className="bg-primary text-primary-foreground rounded-lg p-6 mt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">Grand Total</h3>
                      <p className="text-sm opacity-90 mt-1">
                        Total due upfront (subscriptions + deposits)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">
                        {formatCurrency(totals.grandTotal)}
                      </div>
                      {totals.oneshotOriginalTotal > totals.oneshotDepositTotal && (
                        <div className="text-sm opacity-90 mt-1">
                          Balance due on delivery: {formatCurrency(totals.oneshotOriginalTotal - totals.oneshotDepositTotal)}
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
                  ref={invoiceRef}
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

