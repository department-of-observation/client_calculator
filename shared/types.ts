// Payment types - defines how payment is handled
export type PaymentType = 'subscription' | 'deposit' | 'full';

export interface PricingItem {
  name: string;
  price: number;
  category: string; // Category name (e.g., "Web Design", "Content Creation")
  paymentType: PaymentType; // Payment type determines functionality
  description?: string;
  shortDescription?: string;
}

export interface CalculatorRow extends PricingItem {
  id: string;
  quantity: number;
  discount: number; // percentage (0-100)
}

