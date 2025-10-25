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
  clientName,
  clientEmail,
  clientWebsite,
  clientPhone,
  clientBillingAddress,
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
        {clientName && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Client Name</Text>
            <Text>: {clientName}</Text>
          </View>
        )}
        {clientEmail && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text>: {clientEmail}</Text>
          </View>
        )}
        {clientWebsite && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Website</Text>
            <Text>: {clientWebsite}</Text>
          </View>
        )}
        {clientPhone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text>: {clientPhone}</Text>
          </View>
        )}
        {clientBillingAddress && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Billing Address</Text>
            <Text>: {clientBillingAddress}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

