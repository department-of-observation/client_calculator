import { PDFViewer } from '@react-pdf/renderer';
import type { InvoiceComponentProps } from './shared/types';
import InvoicePDF from './pdf/InvoicePDF';

/**
 * Unified Invoice Preview Component
 * Uses @react-pdf/renderer's PDFViewer to display the exact PDF that will be generated
 * This ensures the preview matches the PDF output exactly - single source of truth
 */
export default function InvoicePreview(props: InvoiceComponentProps) {
  return (
    <PDFViewer 
      style={{ 
        width: '100%', 
        height: '1400px',
        border: 'none'
      }}
      showToolbar={false}
    >
      <InvoicePDF {...props} />
    </PDFViewer>
  );
}

