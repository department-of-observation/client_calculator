import { View, Text } from '@react-pdf/renderer';
import type { InvoiceLineItemsProps } from '../shared/types';
import { calculateLineItemAmount } from '../utils/calculations';
import { formatCurrency } from '@/lib/calculator';
import { styles } from './styles';

export function PDFLineItems({ rows }: InvoiceLineItemsProps) {
  return (
    <>
      <View style={styles.tableHeader}>
        <Text style={styles.col1}>#</Text>
        <Text style={styles.col6}>Item & Description</Text>
        <Text style={styles.col2}>Qty</Text>
        <Text style={styles.col1Right}>Rate</Text>
        <Text style={styles.col2Right}>Amount</Text>
      </View>
      {rows.map((row, index) => {
        const displayAmount = calculateLineItemAmount(
          row.price,
          row.quantity,
          row.discount,
          row.paymentType,
          row.convertToSubscription
        );

        // Add "50% Deposit - " prefix for deposit items not converted to subscription
        const displayName = row.paymentType === 'deposit' && !row.convertToSubscription
          ? `50% Deposit - ${row.name}` 
          : row.name;

        return (
          <View key={row.id} style={styles.tableRow}>
            <Text style={styles.col1}>{index + 1}</Text>
            <View style={styles.col6}>
              <Text style={styles.itemName}>{displayName}</Text>
              {row.description && (
                <Text style={styles.itemDescription}>{row.description}</Text>
              )}
              {row.discount > 0 && (
                <Text style={styles.discount}>Discount: {row.discount}%</Text>
              )}
            </View>
            <Text style={styles.col2}>{row.quantity.toFixed(2)}</Text>
            <Text style={styles.col1Right}>{formatCurrency(row.price)}</Text>
            <Text style={styles.col2Right}>{formatCurrency(displayAmount)}</Text>
          </View>
        );
      })}
    </>
  );
}

