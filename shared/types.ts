export interface PricingItem {
  name: string;
  price: number;
  category: 'subscription' | 'oneshot';
}

export interface CalculatorRow extends PricingItem {
  id: string;
  quantity: number;
  discount: number; // percentage (0-100)
}

