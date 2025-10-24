# Client Pricing Calculator

A web-based pricing calculator for generating custom quotes with quantity and discount controls. Built with React, TypeScript, and Tailwind CSS.

## Features

- **CSV Import**: Import pricing items from CSV files
- **Dynamic Calculations**: Real-time calculation of totals with quantity and discount inputs
- **Category Separation**: Automatically splits items into Subscription and One-Shot packages
- **Deposit Handling**: One-shot packages show 50% deposit with full amount in parentheses
- **Export Quotes**: Export calculated quotes as JSON
- **Responsive Design**: Works on desktop and mobile devices

## CSV Format

The calculator expects CSV files with the following columns:

```csv
name,price,category
WordPress Package A (per page),250,oneshot
Organic Social Media Management,1000,subscription
```

- **name**: Item name/description
- **price**: Unit price (numeric)
- **category**: Either `subscription` or `oneshot`

A sample CSV file is included at `client/public/sample-pricing.csv`.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Build static files for GitHub Pages
pnpm buildstatic
```

## Static Build for GitHub Pages

To deploy to GitHub Pages:

1. Run the static build:
   ```bash
   pnpm buildstatic
   ```

2. The output will be in `dist/public/` directory

3. Configure GitHub Pages to serve from this directory, or copy contents to your `gh-pages` branch

4. If deploying to a subdirectory (e.g., `https://username.github.io/client_calculator/`), you may need to set the base path in `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: '/client_calculator/',
     // ... other config
   });
   ```

## Payment Terms

The calculator follows these business rules:

- **Subscription Packages**: Paid in full at start of month
- **One-Shot Packages**: 50% deposit upfront, balance on delivery
  - Display format: `$1,000 ($2,000)` where first amount is deposit, parentheses show full amount

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui components
- papaparse for CSV parsing
- Wouter for routing

## License

MIT

