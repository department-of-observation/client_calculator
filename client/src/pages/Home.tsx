import { useState, useEffect } from 'react';
import { useCalculatorStore } from '@/store/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Plus, Settings, Menu, ShoppingCart } from 'lucide-react';
import readXlsxFile from 'read-excel-file';
import type { PricingItem } from '../../../shared/types';
import InvoiceConfigForm from '@/components/invoice/InvoiceConfigForm';
import SendInvoiceDialog from '@/components/invoice/SendInvoiceDialog';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import InvoicePDF from '@/components/invoice/pdf/InvoicePDF';
import { pdf } from '@react-pdf/renderer';
import { calculateTotals, formatCurrency } from '@/lib/calculator';
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
import { useMobileDetect } from '@/hooks/useMobileDetect';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import CartTab from '@/components/CartTab';

export default function Home() {
  // Use Zustand store for state management
  const {
    pricingItems,
    rows,
    invoiceConfig,
    categoryFilter,
    searchQuery,
    setPricingItems,
    addRow: addRowToStore,
    updateRow,
    deleteRow: deleteRowFromStore,
    setInvoiceConfig,
    setCategoryFilter,
    setSearchQuery,
    reset,
  } = useCalculatorStore();
  
  // Mobile detection
  const isMobile = useMobileDetect();
  
  // Local UI state (not persisted)
  const [activeTab, setActiveTab] = useState<'calculator' | 'cart' | 'invoice'>('calculator');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

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
    addRowToStore(item);
    toast.success(`Added ${item.name}`);
  };

  const deleteRow = (id: string) => {
    deleteRowFromStore(id);
    toast.success('Item removed');
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

  const sendInvoice = async (to: string, cc: string, message: string) => {
    if (rows.length === 0) {
      toast.error('Please add items before sending invoice');
      return;
    }

    if (!to) {
      toast.error('Please provide a recipient email address');
      return;
    }

    try {
      toast.info('Generating PDF...');
      
      // Generate PDF blob
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

      // Convert blob to base64 for email attachment
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          
          // Create mailto link with attachment simulation
          // Note: mailto doesn't support attachments directly
          // In a real app, this would call a backend API to send the email
          const subject = encodeURIComponent(`Invoice ${invoiceConfig.invoiceNumber} from ${invoiceConfig.companyName}`);
          const body = encodeURIComponent(message);
          const mailtoLink = `mailto:${to}${cc ? `?cc=${cc}` : '?'}${cc ? '&' : ''}subject=${subject}&body=${body}`;
          
          // For now, open mailto and download the PDF
          window.open(mailtoLink, '_blank');
          
          // Also download the PDF for manual attachment
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice-${invoiceConfig.invoiceNumber}-${Date.now()}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast.success('Email client opened. Please attach the downloaded PDF manually.');
          resolve(true);
        };
        reader.onerror = reject;
      });
    } catch (error) {
      console.error('Send invoice error:', error);
      toast.error('Failed to prepare invoice for sending');
      throw error;
    }
  };

  const handleSendInvoice = () => {
    if (!invoiceConfig.clientEmail) {
      toast.error('Please set client email in Invoice Settings first');
      return;
    }
    setIsSendDialogOpen(true);
  };

  const totals = calculateTotals(rows);

  // Get unique categories from pricing items
  const uniqueCategories = Array.from(new Set(pricingItems.map(item => item.category)));

  // Filter items by category and search query
  const filteredItems = pricingItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
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
            {rows.length > 0 && !isMobile && (
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
            )}
          </div>
        </div>
      </header>

      <main className="container py-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="print:hidden">
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="cart">Cart {rows.length > 0 && `(${rows.length})`}</TabsTrigger>
            <TabsTrigger value="invoice" disabled={rows.length === 0}>Invoice</TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <div className="bg-card rounded-lg border border-border p-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2">
                  {isMobile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFilterDrawerOpen(true)}
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <label htmlFor="xlsx-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        {!isMobile && 'Import XLSX'}
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
                    <Input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Desktop Category Filters */}
                {!isMobile && (
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
                )}
              </div>

              {/* POS Grid */}
              <div className={`grid gap-2 max-h-[600px] overflow-y-auto ${
                isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
              }`}>
                {filteredItems.map((item) => (
                  <TooltipLockable key={item.name} content={item.shortDescription || ''}>
                    <button
                      onClick={() => addRow(item)}
                      className="w-full h-full bg-background hover:bg-accent border-2 border-border hover:border-primary rounded-lg p-4 text-left transition-all active:scale-95 min-h-[100px]"
                    >
                      <div className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</div>
                      <div className="text-lg font-bold text-primary">{formatCurrency(item.price)}</div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">
                        {item.paymentType === 'subscription' && '🔄 Recurring'}
                        {item.paymentType === 'deposit' && '🏦 Deposit'}
                        {item.paymentType === 'full' && '💵 Full Payment'}
                      </div>
                    </button>
                  </TooltipLockable>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No items found matching your search</p>
                  <p className="text-sm mt-2">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>

            {/* Floating Cart Button (Mobile Only) */}
            {isMobile && rows.length > 0 && (
              <button
                onClick={() => setActiveTab('cart')}
                className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full w-14 h-14 shadow-lg flex items-center justify-center z-30 hover:scale-110 transition-transform"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {rows.length}
                </span>
              </button>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            <div className="bg-card rounded-lg border border-border p-4">
              <CartTab
                rows={rows}
                onUpdateRow={updateRow}
                onDeleteRow={deleteRow}
                onClearAll={reset}
                totals={totals}
                onShowInvoice={() => setActiveTab('invoice')}
                onPrintInvoice={printInvoice}
                onSendInvoice={handleSendInvoice}
                isMobile={isMobile}
              />
            </div>
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice">
            <div className="mb-4 flex justify-between items-center">
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
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
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

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          categories={uniqueCategories}
          activeCategory={categoryFilter}
          onCategorySelect={setCategoryFilter}
        />
      )}

      {/* Send Invoice Dialog */}
      <SendInvoiceDialog
        isOpen={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        config={invoiceConfig}
        onSend={sendInvoice}
      />
    </div>
  );
}

