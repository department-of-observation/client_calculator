import { View, Text, Image } from '@react-pdf/renderer';
import type { InvoiceHeaderProps } from '../shared/types';
import { styles } from './styles';

export function PDFHeader({
  documentType,
  companyName,
  companyLogo,
  companyAddress,
  companyCity,
  companyEmail,
}: InvoiceHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {companyLogo && <Image src={companyLogo} style={styles.logo} />}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{companyName}</Text>
          <Text>{companyAddress}</Text>
          <Text>{companyCity}</Text>
          <Text>{companyEmail}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.invoiceTitle}>{documentType === 'quote' ? 'QUOTE' : 'TAX INVOICE'}</Text>
      </View>
    </View>
  );
}

