import { View, Text } from '@react-pdf/renderer';
import type { InvoiceInfoProps } from '../shared/types';
import { formatDate } from '../utils/formatters';
import { styles } from './styles';

export function PDFInfo({
  invoiceNumber,
  invoiceDate,
  terms,
  dueDate,
  poNumber,
}: InvoiceInfoProps) {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoLeft}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>#</Text>
          <Text>: {invoiceNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Invoice Date</Text>
          <Text>: {formatDate(invoiceDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Terms</Text>
          <Text>: {terms}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Due Date</Text>
          <Text>: {formatDate(dueDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>P.O.#</Text>
          <Text>: {poNumber || invoiceNumber}</Text>
        </View>
      </View>
      <View style={styles.infoRight}>
        {/* Empty right column */}
      </View>
    </View>
  );
}

