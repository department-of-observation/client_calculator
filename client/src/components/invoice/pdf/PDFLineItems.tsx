import { View, Text } from '@react-pdf/renderer';
import type { InvoiceLineItemsProps } from '../shared/types';
import { calculateLineItemAmount } from '../utils/calculations';
import { formatCurrency } from '@/lib/calculator';
import { styles } from './styles';

export function PDFLineItems({ rows }: InvoiceLineItemsProps) {
  return (
    <>
      <View style={styles.tableHeader}>
        <View style={styles.tableColumnNumber}>
          <View style={styles.cellContent}>
            <Text style={styles.headerText}>#</Text>
          </View>
        </View>

        <View style={styles.tableColumnItemDescription}>
          <View style={styles.cellContent}>
            <Text style={styles.headerText}>Item & Description</Text>
          </View>
        </View>

        <View style={styles.tableColumnQuantity}>
          <View style={styles.cellContent}>
            <Text style={styles.headerText}>Qty</Text>
          </View>
        </View>

        <View style={styles.tableColumnRate}>
          <View style={styles.cellContent}>
            <Text style={styles.headerText}>Rate</Text>
          </View>
        </View>

        <View style={styles.tableColumnAmount}>
          <View style={styles.cellContent}>
            <Text style={styles.headerText}>Amount</Text>
          </View>
        </View>
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
        const displayName =
          row.paymentType === 'deposit' && !row.convertToSubscription
            ? `50% Deposit - ${row.name}`
            : row.name;

        return (
          <View key={row.id} style={styles.tableRow}>
            <View style={styles.tableColumnNumber}>
              <View style={styles.cellContent}>
                <Text>{index + 1}</Text>
              </View>
            </View>

            <View style={styles.tableColumnItemDescription}>
              <View style={styles.cellContent}>
                <Text style={styles.itemName}>{displayName}</Text>
                {row.description && (
                  <Text style={styles.itemDescription}>{row.description}</Text>
                )}
                {row.discount > 0 && (
                  <Text style={styles.discount}>Discount: {row.discount}%</Text>
                )}
              </View>
            </View>

            <View style={styles.tableColumnQuantity}>
              <View style={styles.cellContent}>
                <Text>{row.quantity.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.tableColumnRate}>
              <View style={styles.cellContent}>
                <Text>{formatCurrency(row.price)}</Text>
              </View>
            </View>

            <View style={styles.tableColumnAmount}>
              <View style={styles.cellContent}>
                <Text>{formatCurrency(displayAmount)}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
}

