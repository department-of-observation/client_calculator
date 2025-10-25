import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

export function PDFFooter() {
  return (
    <View style={styles.footer}>
      <Text>POWERED BY</Text>
    </View>
  );
}

