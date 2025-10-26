import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PricingItem, CalculatorRow } from '../../../shared/types';
import type { InvoiceConfig } from '../../../shared/invoice-types';
import { DEFAULT_INVOICE_CONFIG } from '../../../shared/invoice-types';

interface CalculatorState {
  // State
  pricingItems: PricingItem[];
  rows: CalculatorRow[];
  invoiceConfig: InvoiceConfig;
  categoryFilter: string;
  searchQuery: string;
  
  // Actions
  setPricingItems: (items: PricingItem[]) => void;
  addRow: (item: PricingItem) => void;
  updateRow: (id: string, updates: Partial<CalculatorRow>) => void;
  deleteRow: (id: string) => void;
  setInvoiceConfig: (config: InvoiceConfig) => void;
  setCategoryFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      // Initial state
      pricingItems: [],
      rows: [],
      invoiceConfig: DEFAULT_INVOICE_CONFIG,
      categoryFilter: 'all',
      searchQuery: '',
      
      // Actions
      setPricingItems: (items) => set({ pricingItems: items }),
      
      addRow: (item) => set((state) => ({
        rows: [
          ...state.rows,
          {
            ...item,
            id: `${Date.now()}-${Math.random()}`,
            quantity: 1,
            discount: 0,
          },
        ],
      })),
      
      updateRow: (id, updates) => set((state) => ({
        rows: state.rows.map((row) =>
          row.id === id ? { ...row, ...updates } : row
        ),
      })),
      
      deleteRow: (id) => set((state) => ({
        rows: state.rows.filter((row) => row.id !== id),
      })),
      
      setInvoiceConfig: (config) => set({ invoiceConfig: config }),
      
      setCategoryFilter: (filter) => set({ categoryFilter: filter }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      reset: () => set({
        rows: [],
        categoryFilter: 'all',
        searchQuery: '',
      }),
    }),
    {
      name: 'calculator-storage',
      // Only persist important data, not UI state
      partialize: (state) => ({
        rows: state.rows,
        invoiceConfig: state.invoiceConfig,
      }),
    }
  )
);

