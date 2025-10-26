import XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the pricing.xlsx file
const workbook = XLSX.readFile(join(__dirname, '../client/public/pricing.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Skip header row and map to pricing items
const pricingItems = rawData.slice(1).map((row) => ({
  name: String(row[0] || ''),
  price: parseFloat(String(row[1])) || 0,
  category: String(row[2] || ''),
  description: String(row[3] || ''),
  shortDescription: String(row[4] || ''),
  paymentType: (String(row[5] || 'deposit').toLowerCase())
})).filter(item => item.name); // Filter out empty rows

// Ensure output directory exists
const outputDir = join(__dirname, '../client/src/data');
mkdirSync(outputDir, { recursive: true });

// Write to JSON file
const outputPath = join(outputDir, 'pricing-data.json');
writeFileSync(outputPath, JSON.stringify(pricingItems, null, 2));

console.log(`✅ Generated pricing data: ${pricingItems.length} items written to ${outputPath}`);

