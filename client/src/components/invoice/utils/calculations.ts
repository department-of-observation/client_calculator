export function calculateLineItemAmount(
  price: number,
  quantity: number,
  discount: number,
  category: string
): number {
  const baseAmount = price * quantity;
  const discountedAmount = baseAmount * (1 - discount / 100);
  return category === 'oneshot' ? discountedAmount * 0.5 : discountedAmount;
}

