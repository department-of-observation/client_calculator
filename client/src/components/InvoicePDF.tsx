import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { InvoiceConfig } from '../../../shared/invoice-types';
import type { CalculatorRow } from '../../../shared/types';
import { formatCurrency } from '@/lib/calculator';

interface InvoicePDFProps {
  config: InvoiceConfig;
  rows: CalculatorRow[];
  subscriptionTotal: number;
  oneshotDepositTotal: number;
  oneshotOriginalTotal: number;
  grandTotal: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  container: {
    border: '2px solid #000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    borderBottom: '2px solid #000000',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  companyInfo: {
    gap: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
  },
  infoSection: {
    flexDirection: 'row',
    borderBottom: '2px solid #000000',
  },
  infoLeft: {
    width: '50%',
    padding: 16,
    borderRight: '2px solid #000000',
  },
  infoRight: {
    width: '50%',
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 100,
  },
  billToSection: {
    padding: 16,
    borderBottom: '2px solid #000000',
  },
  billToLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  subjectSection: {
    padding: 16,
    borderBottom: '2px solid #000000',
  },
  subjectLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #000000',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottom: '1px solid #d1d5db',
    fontSize: 9,
  },
  col1: {
    width: '8.33%',
  },
  col6: {
    width: '50%',
  },
  col2: {
    width: '16.66%',
    textAlign: 'right',
  },
  col1Right: {
    width: '8.33%',
    textAlign: 'right',
  },
  col2Right: {
    width: '16.66%',
    textAlign: 'right',
  },
  itemName: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  discount: {
    fontSize: 8,
    color: '#4b5563',
  },
  totalsSection: {
    flexDirection: 'row',
    borderTop: '2px solid #000000',
  },
  totalsLeft: {
    width: '50%',
    padding: 16,
  },
  totalsRight: {
    width: '50%',
    borderLeft: '2px solid #000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottom: '1px solid #d1d5db',
  },
  totalRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    fontFamily: 'Helvetica-Bold',
  },
  totalInWordsLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  totalInWordsValue: {
    fontStyle: 'italic',
  },
  notesSection: {
    padding: 16,
    borderTop: '2px solid #000000',
  },
  notesLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  termsSection: {
    padding: 16,
    borderTop: '2px solid #000000',
    fontSize: 9,
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 9,
    color: '#4b5563',
  },
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  }
  
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = '';
  
  if (integerPart >= 1000) {
    result += convertLessThanThousand(Math.floor(integerPart / 1000)) + ' Thousand ';
    result += convertLessThanThousand(integerPart % 1000);
  } else {
    result = convertLessThanThousand(integerPart);
  }
  
  if (decimalPart > 0) {
    result += ' and ' + decimalPart + '/100';
  }
  
  return result.trim();
}

export default function InvoicePDF({
  config,
  rows,
  subscriptionTotal,
  oneshotDepositTotal,
  oneshotOriginalTotal,
  grandTotal,
}: InvoicePDFProps) {
  const subscriptionRows = rows.filter(r => r.category === 'subscription');
  const oneshotRows = rows.filter(r => r.category === 'oneshot');
  const allRows = [...subscriptionRows, ...oneshotRows];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {config.companyLogo && (
                <Image src={config.companyLogo} style={styles.logo} />
              )}
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{config.companyName}</Text>
                <Text>{config.companyAddress}</Text>
                <Text>{config.companyCity}</Text>
                <Text>{config.companyEmail}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoLeft}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>#</Text>
                <Text>: {config.invoiceNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Date</Text>
                <Text>: {formatDate(config.invoiceDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Terms</Text>
                <Text>: {config.terms}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Due Date</Text>
                <Text>: {formatDate(config.dueDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>P.O.#</Text>
                <Text>: {config.poNumber || config.invoiceNumber}</Text>
              </View>
            </View>
            <View style={styles.infoRight}>
              {/* Empty right column */}
            </View>
          </View>

          {/* Bill To */}
          <View style={styles.billToSection}>
            <Text style={styles.billToLabel}>Bill To</Text>
            <Text style={styles.clientName}>{config.clientName || 'Client Name'}</Text>
          </View>

          {/* Subject */}
          {config.subject && (
            <View style={styles.subjectSection}>
              <Text style={styles.subjectLabel}>Subject :</Text>
              <Text>{config.subject}</Text>
            </View>
          )}

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col6}>Item & Description</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col1Right}>Rate</Text>
            <Text style={styles.col2Right}>Amount</Text>
          </View>

          {/* Table Rows */}
          {allRows.map((row, index) => {
            const baseAmount = row.price * row.quantity;
            const discountedAmount = baseAmount * (1 - row.discount / 100);
            const displayAmount = row.category === 'oneshot' 
              ? discountedAmount * 0.5 
              : discountedAmount;

            return (
              <View key={row.id} style={styles.tableRow}>
                <Text style={styles.col1}>{index + 1}</Text>
                <View style={styles.col6}>
                  <Text style={styles.itemName}>{row.name}</Text>
                  {row.discount > 0 && (
                    <Text style={styles.discount}>Discount: {row.discount}%</Text>
                  )}
                </View>
                <Text style={styles.col2}>{row.quantity.toFixed(2)}</Text>
                <Text style={styles.col1Right}>{formatCurrency(row.price)}</Text>
                <Text style={styles.col2Right}>{formatCurrency(displayAmount)}</Text>
              </View>
            );
          })}

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsLeft}>
              <Text style={styles.totalInWordsLabel}>Total In Words</Text>
              <Text style={styles.totalInWordsValue}>{numberToWords(grandTotal)}</Text>
            </View>
            <View style={styles.totalsRight}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Sub Total</Text>
                <Text>{formatCurrency(subscriptionTotal + oneshotDepositTotal)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>SGD{formatCurrency(grandTotal)}</Text>
              </View>
              <View style={styles.totalRowLast}>
                <Text style={styles.totalLabel}>Balance Due</Text>
                <Text style={styles.totalValue}>SGD{formatCurrency(grandTotal)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {config.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text>{config.notes}</Text>
            </View>
          )}

          {/* Terms & Conditions */}
          {config.termsAndConditions && (
            <View style={styles.termsSection}>
              <Text>{config.termsAndConditions}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>POWERED BY</Text>
        </View>
      </Page>
    </Document>
  );
}

