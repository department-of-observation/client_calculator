// styles.ts
import { StyleSheet } from '@react-pdf/renderer';

// Colors
const COLOR_BLACK = '#000000';
const COLOR_WHITE = '#ffffff';
const COLOR_GRAY_50 = '#f3f4f6'; // Light gray background
const COLOR_GRAY_300 = '#d1d5db'; // Medium gray border
const COLOR_GRAY_500 = '#6b7280'; // Medium gray text
const COLOR_GRAY_600 = '#4b5563'; // Dark gray text

// Borders
const BORDER_THICK = `2px solid ${COLOR_BLACK}`;
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
const PADDING_XXSMALL = 3;

// Layout
const WIDTH_HALF = '50%';

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

  /* ---------- Header ---------- */
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
    flexGrow: 1,
    paddingRight: 12,
  },
  logo: {
    maxWidth: 100,
    maxHeight: 50,
    objectFit: 'contain',
  },
  companyInfo: {
    gap: 4,
    borderRight: '1px solid transparent',
  },
  companyName: {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: FONT_BOLD,
  },
  headerRight: {
    alignItems: 'flex-end',
    minWidth: 160,
  },
  invoiceTitle: {
    fontSize: FONT_SIZE_XLARGE,
    fontFamily: FONT_BOLD,
  },

  /* ---------- Info Sections ---------- */
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
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontFamily: FONT_BOLD,
    width: 100,
    flexShrink: 0,
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

  // Main priced row
  tableRow: {
    flexDirection: 'row',
    paddingLeft: PADDING_SMALL,
    paddingRight: PADDING_SMALL,
    borderBottom: BORDER_LIGHT,
    fontSize: FONT_SIZE_SMALL,
    alignItems: 'stretch',
  },

  // Main priced row when it has detail rows below (border moved to last detail row)
  tableRowNoBorder: {
    flexDirection: 'row',
    paddingLeft: PADDING_SMALL,
    paddingRight: PADDING_SMALL,
    borderBottom: 0,
    fontSize: FONT_SIZE_SMALL,
    alignItems: 'stretch',
  },

  // Continuation rows for description lines (no pricing)
  tableRowDetail: {
    flexDirection: 'row',
    paddingLeft: PADDING_SMALL,
    paddingRight: PADDING_SMALL,
    fontSize: FONT_SIZE_TINY,
    alignItems: 'stretch',
    borderBottom: 0,
  },

  // Last continuation row (adds the divider after the whole item block)
  tableRowDetailLast: {
    flexDirection: 'row',
    paddingLeft: PADDING_SMALL,
    paddingRight: PADDING_SMALL,
    fontSize: FONT_SIZE_TINY,
    alignItems: 'stretch',
    borderBottom: BORDER_LIGHT,
  },

  // ✅ Use flex columns (stable, no overlap)
  tableColumnNumber: {
    flex: 0.6,
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
    alignSelf: 'stretch',
  },
  tableColumnItemDescription: {
    flex: 4.2,
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
    alignSelf: 'stretch',
  },
  tableColumnQuantity: {
    flex: 1.2,
    textAlign: 'right',
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
    alignSelf: 'stretch',
  },
  tableColumnRate: {
    flex: 1.4,
    textAlign: 'right',
    borderRight: BORDER_COLUMN,
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
    alignSelf: 'stretch',
  },
  tableColumnAmount: {
    flex: 1.4,
    textAlign: 'right',
    paddingLeft: PADDING_XSMALL,
    paddingRight: PADDING_XSMALL,
    alignSelf: 'stretch',
  },

  // Main row content (nice centered numbers)
  cellContentCenter: {
    paddingTop: PADDING_SMALL,
    paddingBottom: PADDING_SMALL,
    justifyContent: 'center',
    flexGrow: 1,
    alignSelf: 'stretch',
  },

  // Detail rows (tighter + top aligned)
  cellContentDetail: {
    paddingTop: PADDING_XXSMALL,
    paddingBottom: PADDING_XXSMALL,
    justifyContent: 'flex-start',
    flexGrow: 1,
    alignSelf: 'stretch',
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

  /* ---------- Totals ---------- */
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
