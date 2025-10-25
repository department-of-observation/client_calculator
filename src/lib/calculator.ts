import type { CalculatorRow } from '@shared/types';

export const ONESHOT_DEPOSIT_MULTIPLIER = 0.5;

/**
 * Calculate the line total for a row
 * For oneshot items: 
 *   - If isFullPayment is true: shows full amount
 *   - If isFullPayment is false/undefined: applies deposit multiplier (shows deposit amount)
 * For subscription items: shows full amount
 */
export function calculateLineTotal(row: CalculatorRow): {
  displayAmount: number;
  originalAmount: number;
} {
  const baseAmount = row.price * row.quantity;
  const discountedAmount = baseAmount * (1 - row.discount / 100);
  
  if (row.category === 'oneshot' && !row.isFullPayment) {
    return {
      displayAmount: discountedAmount * ONESHOT_DEPOSIT_MULTIPLIER,
      originalAmount: discountedAmount
    };
  }
  
  return {
    displayAmount: discountedAmount,
    originalAmount: discountedAmount
  };
}

/**
 * Calculate totals for all rows grouped by category
 */
export function calculateTotals(rows: CalculatorRow[]) {
  const subscriptionRows = rows.filter(r => r.category === 'subscription');
  const oneshotRows = rows.filter(r => r.category === 'oneshot');
  
  const subscriptionTotal = subscriptionRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).displayAmount;
  }, 0);
  
  const oneshotDepositTotal = oneshotRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).displayAmount;
  }, 0);
  
  const oneshotOriginalTotal = oneshotRows.reduce((sum, row) => {
    return sum + calculateLineTotal(row).originalAmount;
  }, 0);
  
  return {
    subscriptionTotal,
    oneshotDepositTotal,
    oneshotOriginalTotal,
    grandTotal: subscriptionTotal + oneshotDepositTotal
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

