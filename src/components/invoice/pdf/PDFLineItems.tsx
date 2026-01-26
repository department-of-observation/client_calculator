// lineitems.tsx
import { View, Text } from '@react-pdf/renderer';
import type { InvoiceLineItemsProps } from '@/lib/types';
import { calculateLineTotal, formatCurrency } from '@/lib/calculator';
import { styles } from './styles';

function splitDescriptionLines(desc?: string) {
  if (!desc) return [];
  return desc
    .split('\n')
    .map((s) => s.trimEnd())
    .filter((s) => s.length > 0);
}

export function PDFLineItems({ rows }: InvoiceLineItemsProps) {
  return (
    <>
      <View style={styles.tableHeader} wrap={false}>
        <View style={styles.tableColumnNumber}>
          <View style={styles.cellContentCenter}>
            <Text style={styles.headerText}>#</Text>
          </View>
        </View>

        <View style={styles.tableColumnItemDescription}>
          <View style={styles.cellContentCenter}>
            <Text style={styles.headerText}>Item & Description</Text>
          </View>
        </View>

        <View style={styles.tableColumnQuantity}>
          <View style={styles.cellContentCenter}>
            <Text style={styles.headerText}>Qty</Text>
          </View>
        </View>

        <View style={styles.tableColumnRate}>
          <View style={styles.cellContentCenter}>
            <Text style={styles.headerText}>Rate</Text>
          </View>
        </View>

        <View style={styles.tableColumnAmount}>
          <View style={styles.cellContentCenter}>
            <Text style={styles.headerText}>Amount</Text>
          </View>
        </View>
      </View>

      {rows.map((row, index) => {
        const { displayAmount } = calculateLineTotal(row);

        const displayName =
          row.paymentType === 'deposit' && !row.convertToSubscription
            ? `50% Deposit - ${row.name}`
            : row.name;

        const descLines = splitDescriptionLines(row.description);
        const hasDetails = descLines.length > 0;

        return (
          <View key={row.id}>
            {/* ✅ Main priced row (never split across pages) */}
            <View
              style={hasDetails ? styles.tableRowNoBorder : styles.tableRow}
              wrap={false}
            >
              <View style={styles.tableColumnNumber}>
                <View style={styles.cellContentCenter}>
                  <Text>{index + 1}</Text>
                </View>
              </View>

              <View style={styles.tableColumnItemDescription}>
                <View style={styles.cellContentCenter}>
                  <Text style={styles.itemName}>{displayName}</Text>
                  {row.discount > 0 && (
                    <Text style={styles.discount}>Discount: {row.discount}%</Text>
                  )}
                </View>
              </View>

              <View style={styles.tableColumnQuantity}>
                <View style={styles.cellContentCenter}>
                  <Text>{row.quantity.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.tableColumnRate}>
                <View style={styles.cellContentCenter}>
                  <Text>{formatCurrency(row.price)}</Text>
                </View>
              </View>

              <View style={styles.tableColumnAmount}>
                <View style={styles.cellContentCenter}>
                  <Text>{formatCurrency(displayAmount)}</Text>
                </View>
              </View>
            </View>

            {/* ✅ Continuation rows for description lines (no numbers, no pricing) */}
            {descLines.map((line, i) => {
              const isLast = i === descLines.length - 1;
              const rowStyle = isLast
                ? styles.tableRowDetailLast
                : styles.tableRowDetail;

              return (
                <View key={`${row.id}-desc-${i}`} style={rowStyle}>
                  <View style={styles.tableColumnNumber}>
                    <View style={styles.cellContentDetail}>
                      <Text>{' '}</Text>
                    </View>
                  </View>

                  <View style={styles.tableColumnItemDescription}>
                    <View style={styles.cellContentDetail}>
                      <Text style={styles.itemDescription}>{line}</Text>
                    </View>
                  </View>

                  <View style={styles.tableColumnQuantity}>
                    <View style={styles.cellContentDetail}>
                      <Text>{' '}</Text>
                    </View>
                  </View>

                  <View style={styles.tableColumnRate}>
                    <View style={styles.cellContentDetail}>
                      <Text>{' '}</Text>
                    </View>
                  </View>

                  <View style={styles.tableColumnAmount}>
                    <View style={styles.cellContentDetail}>
                      <Text>{' '}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </>
  );
}
