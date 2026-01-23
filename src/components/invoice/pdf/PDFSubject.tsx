import { View, Text } from '@react-pdf/renderer';
import type { InvoiceSubjectProps } from '../shared/types';
import { styles } from './styles';

export function PDFSubject({ subject }: InvoiceSubjectProps) {
  return (
    <View style={styles.subjectSection}>
      <Text style={styles.subjectLabel}>Subject :</Text>
      {subject && <Text>{subject}</Text>}
    </View>
  );
}

