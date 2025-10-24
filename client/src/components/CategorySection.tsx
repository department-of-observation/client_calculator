import type { CalculatorRow as CalculatorRowType } from '../../../shared/types';
import CalculatorRow from './CalculatorRow';
import { formatCurrency } from '@/lib/calculator';

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  rows: CalculatorRowType[];
  total: number;
  originalTotal?: number;
  onUpdate: (id: string, updates: Partial<CalculatorRowType>) => void;
  onDelete: (id: string) => void;
}

export default function CategorySection({
  title,
  subtitle,
  rows,
  total,
  originalTotal,
  onUpdate,
  onDelete
}: CategorySectionProps) {
  if (rows.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-12 gap-3 pb-3 border-b border-border font-semibold text-sm text-muted-foreground">
          <div className="col-span-4">Item</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Discount</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1"></div>
        </div>

        {rows.map((row) => (
          <CalculatorRow
            key={row.id}
            row={row}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}

        <div className="mt-4 pt-4 border-t border-border flex justify-end">
          <div className="text-right">
            <div className="text-lg font-bold">
              Subtotal: {formatCurrency(total)}
              {originalTotal !== undefined && originalTotal !== total && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Full: {formatCurrency(originalTotal)})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

