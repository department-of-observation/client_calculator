import type { CalculatorRow } from '../../../shared/types';

export const DEPOSIT_MULTIPLIER = 0.5;

/**
 * Calculate the line total for a row based on payment type
 * - subscription: shows full amount (recurring)
 * - deposit: applies 50% deposit multiplier (unless converted to subscription)
 * - full: shows full amount (one-time payment)
 */
export function calculateLineTotal(row: CalculatorRow): {
  displayAmount: number;
  originalAmount: number;
} {
  const baseAmount = row.price * row.quantity;
  const discountedAmount = baseAmount * (1 - row.discount / 100);
  
  // If it's a deposit item but converted to subscription, show full amount
  if (row.paymentType === 'deposit' && !row.convertToSubscription) {
    return {
      displayAmount: discountedAmount * DEPOSIT_MULTIPLIER,
      originalAmount: discountedAmount
    };
  }
  
  return {
    displayAmount: discountedAmount,
    originalAmount: discountedAmount
  };
}

/**
 * Calculate totals for all rows grouped by payment type
 */
export function calculateTotals(rows: CalculatorRow[]) {
  const subscriptionRows = rows.filter(r => r.paymentType === 'subscription');
  const depositRows = rows.filter(r => r.paymentType === 'deposit');
  const fullRows = rows.filter(r => r.paymentType === 'full');
  
  const subscriptionTotal = subscriptionRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).displayAmount;
  }, 0);
  
  const depositTotal = depositRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).displayAmount;
  }, 0);
  
  const depositOriginalTotal = depositRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).originalAmount;
  }, 0);
  
  const fullTotal = fullRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).displayAmount;
  }, 0);
  
  return {
    subscriptionTotal,
    depositTotal,
    depositOriginalTotal,
    fullTotal,
    grandTotal: subscriptionTotal + depositTotal + fullTotal
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

