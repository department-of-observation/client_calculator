import { StyleSheet } from '@react-pdf/renderer';

// Colors
const COLOR_BLACK = '#000000';
const COLOR_WHITE = '#ffffff';
const COLOR_GRAY_50 = '#f3f4f6'; // Light gray background
const COLOR_GRAY_200 = '#e5e7eb'; // Light gray border
const COLOR_GRAY_300 = '#d1d5db'; // Medium gray border
const COLOR_GRAY_500 = '#6b7280'; // Medium gray text
const COLOR_GRAY_600 = '#4b5563'; // Dark gray text

// Borders
const BORDER_THICK = `2px solid ${COLOR_BLACK}`;
const BORDER_MEDIUM = `1px solid ${COLOR_BLACK}`;
const BORDER_LIGHT = `1px solid ${COLOR_GRAY_300}`;
const BORDER_COLUMN = `1px solid ${COLOR_BLACK}`;

// Typography
const FONT_REGULAR = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_SIZE_XLARGE = 36;
const FONT_SIZE_LARGE = 16;
const FONT_SIZE_MEDIUM = 14;
const FONT_SIZE_BASE = 10;
const FONT_SIZE_SMALL = 9;
const FONT_SIZE_TINY = 8;

// Spacing
const PADDING_XLARGE = 48;
const PADDING_MEDIUM = 12;
const PADDING_SMALL = 8;
const PADDING_XSMALL = 6;

// Layout
const WIDTH_HALF = '50%';
const WIDTH_COL_NARROW = '8.33%';
const WIDTH_COL_MEDIUM = '16.66%';
const WIDTH_COL_WIDE = '41.68%'; // Adjusted to accommodate wider Rate column

export const styles = StyleSheet.create({
  page: {
    padding: PADDING_XLARGE,
    backgroundColor: COLOR_WHITE,
    fontFamily: FONT_REGULAR,
    fontSize: FONT_SIZE_BASE,
  },
  container: {
    border: BORDER_THICK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: PADDING_MEDIUM,
    borderBottom: BORDER_THICK,
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
    fontSize: FONT_SIZE_LARGE,
    fontFamily: FONT_BOLD,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: FONT_SIZE_XLARGE,
    fontFamily: FONT_BOLD,
  },
  infoSection: {
    flexDirection: 'row',
    borderBottom: BORDER_THICK,
  },
  infoLeft: {
    width: WIDTH_HALF,
    padding: PADDING_SMALL,
    borderRight: BORDER_THICK,
  },
  infoRight: {
    width: WIDTH_HALF,
    padding: PADDING_SMALL,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoLabel: {
    fontFamily: FONT_BOLD,
    width: 100,
  },
  billToSection: {
    padding: PADDING_SMALL,
    borderBottom: BORDER_THICK,
  },
  billToLabel: {
    fontFamily: FONT_BOLD,
  },
  clientName: {
    fontSize: FONT_SIZE_MEDIUM,
    fontFamily: FONT_BOLD,
  },
  subjectSection: {
    padding: PADDING_SMALL,
    borderBottom: BORDER_THICK,
  },
  subjectLabel: {
    fontFamily: FONT_BOLD,
  },

  /* ---------- Table ---------- */
  tableHeader: {
    flexDirection: 'row',
    paddingLeft: PADDING_SMALL,
    paddingRight: PADDING_SMALL,
    backgroundColor: COLOR_GRAY_50,
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZE_SMALL,
    alignItems: 'stretch',
  },
  tableRow: {
    flexDirection: 'row',
    paddingLeft: PADDING_SMALL,
    paddingRight: PADDING_SMALL,
    borderBottom: BORDER_LIGHT,
    fontSize: FONT_SIZE_SMALL,
    alignItems: 'stretch',
  },
  tableColumnNumber: {
    width: WIDTH_COL_NARROW,
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
  },
  tableColumnItemDescription: {
    width: WIDTH_COL_WIDE,
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
  },
  tableColumnQuantity: {
    width: WIDTH_COL_MEDIUM,
    textAlign: 'right',
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
  },
  tableColumnRate: {
    width: WIDTH_COL_MEDIUM,
    textAlign: 'right',
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
  },
  tableColumnAmount: {
    width: WIDTH_COL_MEDIUM,
    textAlign: 'right',
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
  },
  cellContent: {
    paddingTop: PADDING_SMALL,
    paddingBottom: PADDING_SMALL,
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZE_SMALL,
  },
  itemName: {
    fontFamily: FONT_BOLD,
  },
  discount: {
    fontSize: FONT_SIZE_TINY,
    color: COLOR_GRAY_600,
  },
  itemDescription: {
    fontSize: FONT_SIZE_TINY,
    color: COLOR_GRAY_500,
    lineHeight: 1.4,
  },
  totalsSection: {
    flexDirection: 'row',
    borderTop: BORDER_THICK,
  },
  totalsLeft: {
    width: WIDTH_HALF,
    padding: PADDING_SMALL,
  },
  totalsRight: {
    width: WIDTH_HALF,
    borderLeft: BORDER_THICK,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: PADDING_SMALL,
    borderBottom: BORDER_LIGHT,
  },
  totalRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: PADDING_SMALL,
    backgroundColor: COLOR_GRAY_50,
  },
  totalLabel: {
    fontFamily: FONT_BOLD,
  },
  totalValue: {
    fontFamily: FONT_BOLD,
  },
  totalInWordsLabel: {
    fontFamily: FONT_BOLD,
  },
  totalInWordsValue: {
    fontStyle: 'italic',
  },
  notesSection: {
    padding: PADDING_SMALL,
    borderTop: BORDER_THICK,
  },
  notesLabel: {
    fontFamily: FONT_BOLD,
  },
  termsSection: {
    padding: PADDING_SMALL,
    borderTop: BORDER_THICK,
    fontSize: FONT_SIZE_SMALL,
  },
  footer: {
    textAlign: 'center',
    fontSize: FONT_SIZE_SMALL,
    color: COLOR_GRAY_600,
  },
});

