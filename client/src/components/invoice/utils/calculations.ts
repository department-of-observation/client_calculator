import type { PaymentType } from '@shared/types';

export function calculateLineItemAmount(
  price: number,
  quantity: number,
  discount: number,
  paymentType: PaymentType,
  convertToSubscription?: boolean
): number {
  const baseAmount = price * quantity;
  const discountedAmount = baseAmount * (1 - discount / 100);
  
  // Apply 50% deposit multiplier only for deposit items not converted to subscription
  return paymentType === 'deposit' && !convertToSubscription 
    ? discountedAmount * 0.5 
    : discountedAmount;
}

