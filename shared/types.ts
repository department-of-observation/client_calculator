// Category types - easily extensible for future types
export type CategoryType = 'subscription' | 'oneshot';

export interface PricingItem {
  name: string;
  price: number;
  category: CategoryType;
  Description?: string;
}

export interface CalculatorRow extends PricingItem {
  id: string;
  quantity: number;
  discount: number; // percentage (0-100)
  isFullPayment?: boolean; // For oneshot items: true = full payment, false/undefined = 50% deposit
}

