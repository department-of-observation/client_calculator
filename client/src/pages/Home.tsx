import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Plus, Download, FileText, Settings, Printer, X, Search } from 'lucide-react';
import readXlsxFile from 'read-excel-file';
import type { PricingItem, CalculatorRow as CalculatorRowType } from '../../../shared/types';
import type { InvoiceConfig } from '../../../shared/invoice-types';
import { DEFAULT_INVOICE_CONFIG } from '../../../shared/invoice-types';
import CategorySection from '@/components/CategorySection';
import InvoiceConfigForm from '@/components/invoice/InvoiceConfigForm';
import InvoicePreview from '@/components/invoice/preview/InvoicePreview';
import InvoicePDF from '@/components/invoice/pdf/InvoicePDF';
import { pdf } from '@react-pdf/renderer';
import { calculateTotals, formatCurrency, calculateLineTotal } from '@/lib/calculator';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipLockable } from '@/components/ui/tooltip-lockable';
import pricingData from '@/data/pricing-data.json';

export default function Home() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [rows, setRows] = useState<CalculatorRowType[]>([]);
  const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig>(DEFAULT_INVOICE_CONFIG);
  const [showInvoice, setShowInvoice] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load pricing data from pre-built JSON on mount
  useEffect(() => {
    loadDefaultData();
  }, []);

  const loadDefaultData = () => {
    try {
      setPricingItems(pricingData as PricingItem[]);
      toast.success(`Loaded ${pricingData.length} pricing items`);
    } catch (error) {
      toast.error('Failed to load pricing data');
      console.error(error);
    }
  };

  const parseXlsxData = async (file: File | Blob) => {
    try {
      const rows = await readXlsxFile(file);
      
      // Skip header row and map data
      // Expected columns: name, price, category, description, shortdescription, payment type
      const items = rows.slice(1).map((row) => ({
        name: String(row[0] || ''),
        price: parseFloat(String(row[1])) || 0,
        category: String(row[2] || ''),
        description: String(row[3] || ''),
        shortDescription: String(row[4] || ''),
        paymentType: (String(row[5] || 'deposit').toLowerCase() as 'subscription' | 'deposit' | 'full')
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
          depositTotal={totals.depositTotal}
          depositOriginalTotal={totals.depositOriginalTotal}
          fullTotal={totals.fullTotal}
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

  const totals = calculateTotals(rows);

  // Get unique categories from pricing items
  const uniqueCategories = Array.from(new Set(pricingItems.map(item => item.category)));

  // Filter items by category and search query
  const filteredItems = pricingItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10 print:hidden">
        <div className="container py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Client Pricing Calculator</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Point of Sale System
              </p>
            </div>
            {rows.length > 0 && (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
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
                  size="sm"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {showInvoice ? 'Hide Invoice' : 'Preview Invoice'}
                </Button>

                {showInvoice && (
                  <Button onClick={printInvoice} size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-4">
        <Tabs value={showInvoice ? "invoice" : "calculator"} onValueChange={(v) => setShowInvoice(v === "invoice")} className="print:hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="invoice" disabled={rows.length === 0}>Invoice Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left side: POS Item Grid */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4 mb-4">
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex gap-2">
                      <label htmlFor="xlsx-upload">
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Import XLSX
                          </span>
                        </Button>
                        <input
                          id="xlsx-upload"
                          type="file"
                          accept=".xlsx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search items by name, category, or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      <Button 
                        variant={categoryFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter('all')}
                      >
                        All
                      </Button>
                      {uniqueCategories.map(cat => (
                        <Button 
                          key={cat}
                          variant={categoryFilter === cat ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCategoryFilter(cat)}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* POS Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto">
                    {filteredItems.map((item) => (
                      <TooltipLockable key={item.name} content={item.shortDescription || ''}>
                        <button
                          onClick={() => addRow(item)}
                          className="w-full h-full bg-background hover:bg-accent border-2 border-border hover:border-primary rounded-lg p-4 text-left transition-all active:scale-95"
                        >
                          <div className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</div>
                          <div className="text-lg font-bold text-primary">{formatCurrency(item.price)}</div>
                          <div className="text-xs text-muted-foreground mt-1 capitalize">
                            {item.paymentType}
                          </div>
                        </button>
                      </TooltipLockable>
                    ))}
                  </div>

                  {filteredItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No items found matching your search
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Selected Items */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-4 sticky top-20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Selected Items</h2>
                    {rows.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={exportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    )}
                  </div>

                  {rows.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Click items to add them to your quote
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
                        {rows.map((row) => (
                          <CategorySection
                            key={row.id}
                            row={row}
                            onUpdate={updateRow}
                            onDelete={deleteRow}
                          />
                        ))}
                      </div>

                      <div className="border-t border-border pt-4 space-y-2">
                        {totals.subscriptionTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Subscription Total:</span>
                            <span className="font-semibold">{formatCurrency(totals.subscriptionTotal)}/mo</span>
                          </div>
                        )}
                        
                        {totals.depositTotal > 0 && (
                          <>
                            {totals.depositOriginalTotal !== totals.depositTotal && (
                              <div className="flex justify-between text-sm text-muted-foreground line-through">
                                <span>Original Deposit:</span>
                                <span>{formatCurrency(totals.depositOriginalTotal)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>Deposit Total:</span>
                              <span className="font-semibold">{formatCurrency(totals.depositTotal)}</span>
                            </div>
                          </>
                        )}
                        
                        {totals.fullTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Full Payment Total:</span>
                            <span className="font-semibold">{formatCurrency(totals.fullTotal)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                          <span>Grand Total:</span>
                          <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoice">
            {rows.length > 0 && (
              <InvoicePreview
                config={invoiceConfig}
                rows={rows}
                subscriptionTotal={totals.subscriptionTotal}
                depositTotal={totals.depositTotal}
                depositOriginalTotal={totals.depositOriginalTotal}
                fullTotal={totals.fullTotal}
                grandTotal={totals.grandTotal}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

