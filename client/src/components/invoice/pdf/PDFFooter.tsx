import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

export function PDFFooter() {
  return (
    <View style={styles.footer}>
      <Text>Thank you for your business!</Text>
    </View>
  );
}

