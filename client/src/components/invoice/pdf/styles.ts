import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
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
    padding: 12,
    borderBottom: '2px solid #000000',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  logo: {
    maxWidth: 100,
    maxHeight: 50,
    objectFit: 'contain',
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
    padding: 8,
    borderRight: '2px solid #000000',
  },
  infoRight: {
    width: '50%',
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 100,
  },
  billToSection: {
    padding: 8,
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
    padding: 8,
    borderBottom: '2px solid #000000',
  },
  subjectLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #000000',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #d1d5db',
    fontSize: 9,
  },
  col1: {
    width: '8.33%',
    borderRight: '1px solid #e5e7eb',
    paddingRight: 6,
  },
  col6: {
    width: '50%',
    borderRight: '1px solid #e5e7eb',
    paddingRight: 6,
    paddingLeft: 6,
  },
  col2: {
    width: '16.66%',
    textAlign: 'right',
    borderRight: '1px solid #e5e7eb',
    paddingRight: 6,
    paddingLeft: 6,
  },
  col1Right: {
    width: '8.33%',
    textAlign: 'right',
    borderRight: '1px solid #e5e7eb',
    paddingRight: 6,
    paddingLeft: 6,
  },
  col2Right: {
    width: '16.66%',
    textAlign: 'right',
    paddingLeft: 6,
  },
  itemName: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  discount: {
    fontSize: 8,
    color: '#4b5563',
  },
  itemDescription: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 1.4,
  },
  totalsSection: {
    flexDirection: 'row',
    borderTop: '2px solid #000000',
  },
  totalsLeft: {
    width: '50%',
    padding: 8,
  },
  totalsRight: {
    width: '50%',
    borderLeft: '2px solid #000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottom: '1px solid #d1d5db',
  },
  totalRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
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
    padding: 8,
    borderTop: '2px solid #000000',
  },
  notesLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  termsSection: {
    padding: 8,
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

