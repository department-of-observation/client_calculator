import { View, Text } from '@react-pdf/renderer';
import type {
  InvoiceBillToProps,
  InvoiceSubjectProps,
  InvoiceNotesProps,
  InvoiceTermsProps,
} from '@/lib/types';
import { styles } from './styles';

export function PDFBillTo({ clientName }: InvoiceBillToProps) {
  return (
    <View style={styles.billToSection}>
      <Text style={styles.billToLabel}>Bill To</Text>
      <Text style={styles.clientName}>{clientName || 'Client Name'}</Text>
    </View>
  );
}

export function PDFSubject({ subject }: InvoiceSubjectProps) {
  return (
    <View style={styles.subjectSection}>
      <Text style={styles.subjectLabel}>Subject :</Text>
      {subject && <Text>{subject}</Text>}
    </View>
  );
}

export function PDFNotes({ notes }: InvoiceNotesProps) {
  return (
    <View style={styles.notesSection}>
      <Text style={styles.notesLabel}>Notes</Text>
      <Text>{notes}</Text>
    </View>
  );
}

export function PDFTerms({ termsAndConditions }: InvoiceTermsProps) {
  return (
    <View style={styles.termsSection}>
      <Text>{termsAndConditions}</Text>
    </View>
  );
}

export function PDFFooter() {
  return (
    <View style={styles.footer}>
      <Text></Text>
    </View>
  );
}
