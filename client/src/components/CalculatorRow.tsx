import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { CalculatorRow as CalculatorRowType } from '../../../shared/types';
import { calculateLineTotal, formatCurrency } from '@/lib/calculator';

interface CalculatorRowProps {
  row: CalculatorRowType;
  onUpdate: (id: string, updates: Partial<CalculatorRowType>) => void;
  onDelete: (id: string) => void;
}

export default function CalculatorRow({ row, onUpdate, onDelete }: CalculatorRowProps) {
  const { displayAmount, originalAmount } = calculateLineTotal(row);
  const showOriginal = row.paymentType === 'deposit' && !row.convertToSubscription;
  const showToggle = row.paymentType === 'deposit';

  const handleToggle = () => {
    onUpdate(row.id, { convertToSubscription: !row.convertToSubscription });
  };

  return (
    <div className="grid grid-cols-12 gap-3 items-center py-3 border-b border-border">
      <div className="col-span-3 text-sm font-medium">{row.name}</div>
      <div className="col-span-2 text-sm text-muted-foreground">
        {formatCurrency(row.price)}
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          value={row.quantity}
          onChange={(e) => onUpdate(row.id, { quantity: parseInt(e.target.value) || 0 })}
          className="h-9"
        />
      </div>
      <div className="col-span-2">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="0"
            max="100"
            value={row.discount}
            onChange={(e) => onUpdate(row.id, { discount: parseFloat(e.target.value) || 0 })}
            className="h-9"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>
      <div className="col-span-1 flex justify-center">
        {showToggle ? (
          <Button
            variant={row.convertToSubscription ? "default" : "outline"}
            size="sm"
            onClick={handleToggle}
            className="h-8 px-3 text-xs"
            title={row.convertToSubscription ? "Convert to subscription" : "50% deposit"}
          >
            {row.convertToSubscription ? "🔄" : "🏦"}
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground" title={row.paymentType}>
            {row.paymentType === 'subscription' && '🔄'}
            {row.paymentType === 'full' && '💵'}
          </span>
        )}
      </div>
      <div className="col-span-1 text-sm font-semibold text-right">
        {showOriginal ? (
          <span>
            {formatCurrency(displayAmount)}
            <span className="text-xs text-muted-foreground ml-1">
              ({formatCurrency(originalAmount)})
            </span>
          </span>
        ) : (
          formatCurrency(displayAmount)
        )}
      </div>
      <div className="col-span-1 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

