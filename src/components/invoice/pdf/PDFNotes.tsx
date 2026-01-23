import { View, Text } from '@react-pdf/renderer';
import type { InvoiceNotesProps } from '../shared/types';
import { styles } from './styles';

export function PDFNotes({ notes }: InvoiceNotesProps) {
  return (
    <View style={styles.notesSection}>
      <Text style={styles.notesLabel}>Notes</Text>
      <Text>{notes}</Text>
    </View>
  );
}

