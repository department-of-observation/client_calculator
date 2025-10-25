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
          row.category
        );

        return (
          <View key={row.id} style={styles.tableRow}>
            <Text style={styles.col1}>{index + 1}</Text>
            <View style={styles.col6}>
              <Text style={styles.itemName}>{row.name}</Text>
              {row.Description && (
                <Text style={styles.itemDescription}>{row.Description}</Text>
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

