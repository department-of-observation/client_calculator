import { View, Text } from '@react-pdf/renderer';
import type { InvoiceInfoProps } from '@/lib/types';
import { styles } from './styles';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export function PDFInfo({
  documentType,
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
          <Text style={styles.infoLabel}>{documentType === 'quote' ? 'Date' : 'Invoice Date'}</Text>
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
            <Text style={{ flex: 1 }}>: {clientName}</Text>
          </View>
        )}
        {clientEmail && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={{ flex: 1 }}>: {clientEmail}</Text>
          </View>
        )}
        {clientWebsite && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Website</Text>
            <Text style={{ flex: 1 }}>: {clientWebsite}</Text>
          </View>
        )}
        {clientPhone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={{ flex: 1 }}>: {clientPhone}</Text>
          </View>
        )}
        {clientBillingAddress && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Billing Address</Text>
            <Text style={{ flex: 1 }}>: {clientBillingAddress}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

