import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Download, FileText, Settings, Printer, X, Info } from 'lucide-react';
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
import { Tooltip } from '@/components/ui/tooltip';

export default function Home() {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [rows, setRows] = useState<CalculatorRowType[]>([]);
  const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig>(DEFAULT_INVOICE_CONFIG);
  const [showInvoice, setShowInvoice] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  // Load sample XLSX on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      const response = await fetch('/client_calculator/pricing.xlsx');
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

  const filteredItems = pricingItems.filter(item => 
    categoryFilter === 'all' || item.category === categoryFilter
  );

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
                  <div className="flex gap-2 mb-4">
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

                    <div className="flex gap-1 ml-auto flex-wrap">
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
                      <div key={item.name} className="relative group flex">
                        <Tooltip content={item.shortDescription || ''}>
                          <button
                            onClick={() => addRow(item)}
                            className="w-full h-32 bg-background hover:bg-accent border-2 border-border hover:border-primary rounded-lg p-4 text-left transition-all active:scale-95 flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="font-semibold text-sm mb-1 line-clamp-2 flex-1 min-h-[2.5rem]">{item.name}</div>
                              {item.description && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedDescription(expandedDescription === item.name ? null : item.name);
                                  }}
                                  className="md:hidden flex-shrink-0 text-muted-foreground hover:text-foreground p-1"
                                  title="Show description"
                                >
                                  <Info className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <div className="text-lg font-bold text-primary">{formatCurrency(item.price)}</div>
                            <div className="text-xs text-muted-foreground mt-auto pt-2 capitalize flex items-center gap-1">
                              {item.paymentType === 'subscription' && '🔄 Recurring'}
                              {item.paymentType === 'deposit' && '🏦 Deposit'}
                              {item.paymentType === 'full' && '💵 Full Payment'}
                            </div>
                          </button>
                        </Tooltip>
                        {expandedDescription === item.name && item.description && (
                          <div className="md:hidden absolute z-10 mt-1 p-3 bg-popover border border-border rounded-lg shadow-lg text-sm w-full">
                            <button
                              onClick={() => setExpandedDescription(null)}
                              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="pr-6">{item.description}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No items available</p>
                      <p className="text-sm mt-2">Import an XLSX file to load pricing items</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Current Order */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Current Order</h2>
                    {rows.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setRows([])}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {rows.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No items added</p>
                      <p className="text-xs mt-2">Click items on the left to add</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
                        {rows.map((row) => {
                          const { displayAmount } = calculateLineTotal(row);
                          return (
                            <div key={row.id} className="bg-background rounded p-3 border border-border">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-sm flex-1">{row.name}</div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteRow(row.id)}
                                  className="h-6 w-6 -mt-1 -mr-1 text-destructive hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="text-muted-foreground">Qty</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={row.quantity}
                                    onChange={(e) => updateRow(row.id, { quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-2 py-1 border rounded mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-muted-foreground">Disc %</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={row.discount}
                                    onChange={(e) => updateRow(row.id, { discount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-2 py-1 border rounded mt-1"
                                  />
                                </div>
                              </div>
                              {row.paymentType === 'deposit' && (
                                <div className="mt-2">
                                  <Button
                                    variant={row.convertToSubscription ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateRow(row.id, { convertToSubscription: !row.convertToSubscription })}
                                    className="w-full h-7 text-xs"
                                  >
                                    {row.convertToSubscription ? "🔄 Subscription" : "🏦 50% Deposit"}
                                  </Button>
                                </div>
                              )}
                              <div className="text-right font-bold text-primary mt-2">
                                {formatCurrency(displayAmount)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Totals */}
                      <div className="border-t border-border pt-4 space-y-2">
                        {totals.subscriptionTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">🔄 Subscription Total</span>
                            <span className="font-semibold">{formatCurrency(totals.subscriptionTotal)}</span>
                          </div>
                        )}
                        {totals.depositTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">🏦 Deposit Total</span>
                            <span className="font-semibold">{formatCurrency(totals.depositTotal)}</span>
                          </div>
                        )}
                        {totals.fullTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">💵 Full Payment Total</span>
                            <span className="font-semibold">{formatCurrency(totals.fullTotal)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                          <span>Grand Total</span>
                          <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
                        </div>
                        {totals.depositOriginalTotal > totals.depositTotal && (
                          <div className="text-xs text-muted-foreground text-right">
                            Balance due: {formatCurrency(totals.depositOriginalTotal - totals.depositTotal)}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <Button 
                          variant="outline" 
                          onClick={exportData} 
                          className="w-full"
                          size="sm"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export JSON
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed view below for reference */}
            {rows.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Detailed Breakdown</h3>
                <CategorySection
                  title="🔄 Subscription Packages"
                  subtitle="Monthly recurring services - paid in full at start of month"
                  rows={rows.filter(r => r.paymentType === 'subscription')}
                  total={totals.subscriptionTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />

                <CategorySection
                  title="🏦 Deposit Packages"
                  subtitle="Services requiring 50% deposit upfront, balance on delivery"
                  rows={rows.filter(r => r.paymentType === 'deposit')}
                  total={totals.depositTotal}
                  originalTotal={totals.depositOriginalTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />

                <CategorySection
                  title="💵 Full Payment Packages"
                  subtitle="One-time services paid in full"
                  rows={rows.filter(r => r.paymentType === 'full')}
                  total={totals.fullTotal}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="invoice">
            <div className="flex justify-center">
              <div className="shadow-2xl">
                <InvoicePreview
                  config={invoiceConfig}
                  rows={rows}
                  subscriptionTotal={totals.subscriptionTotal}
                  depositTotal={totals.depositTotal}
                  depositOriginalTotal={totals.depositOriginalTotal}
                  fullTotal={totals.fullTotal}
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

