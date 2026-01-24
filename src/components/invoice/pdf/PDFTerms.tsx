import { View, Text } from '@react-pdf/renderer';
import type { InvoiceTermsProps } from '@/lib/types';
import { styles } from './styles';

export function PDFTerms({ termsAndConditions }: InvoiceTermsProps) {
  return (
    <View style={styles.termsSection}>
      <Text>{termsAndConditions}</Text>
    </View>
  );
}

