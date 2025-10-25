import { View, Text } from '@react-pdf/renderer';
import type { InvoiceTotalsProps } from '../shared/types';
import { numberToWords } from '../utils/numberToWords';
import { formatCurrency } from '@/lib/calculator';
import { styles } from './styles';

export function PDFTotals({
  subscriptionTotal,
  oneshotDepositTotal,
  grandTotal,
}: InvoiceTotalsProps) {
  return (
    <View style={styles.totalsSection}>
      <View style={styles.totalsLeft}>
        <Text style={styles.totalInWordsLabel}>Total In Words</Text>
        <Text style={styles.totalInWordsValue}>{numberToWords(grandTotal)}</Text>
      </View>
      <View style={styles.totalsRight}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sub Total</Text>
          <Text>{formatCurrency(subscriptionTotal + oneshotDepositTotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>SGD{formatCurrency(grandTotal)}</Text>
        </View>
        <View style={styles.totalRowLast}>
          <Text style={styles.totalLabel}>Balance Due</Text>
          <Text style={styles.totalValue}>SGD{formatCurrency(grandTotal)}</Text>
        </View>
      </View>
    </View>
  );
}

