import { View, Text } from '@react-pdf/renderer';
import type { InvoiceBillToProps } from '../shared/types';
import { styles } from './styles';

export function PDFBillTo({ clientName }: InvoiceBillToProps) {
  return (
    <View style={styles.billToSection}>
      <Text style={styles.billToLabel}>Bill To</Text>
      <Text style={styles.clientName}>{clientName || 'Client Name'}</Text>
    </View>
  );
}

