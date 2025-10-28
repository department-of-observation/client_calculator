import { Button } from '@/components/ui/button';
import { X, Trash2, FileText, Printer, Mail } from 'lucide-react';
import type { CalculatorRow } from '../../../shared/types';
import { calculateLineTotal, formatCurrency } from '@/lib/calculator';

interface CartTabProps {
  rows: CalculatorRow[];
  onUpdateRow: (id: string, updates: Partial<CalculatorRow>) => void;
  onDeleteRow: (id: string) => void;
  onClearAll: () => void;
  totals: {
    subscriptionTotal: number;
    depositTotal: number;
    depositOriginalTotal: number;
    fullTotal: number;
    grandTotal: number;
  };
  onShowInvoice: () => void;
  onPrintInvoice: () => void;
  onSendInvoice: () => void;
  isMobile: boolean;
}

export default function CartTab({
  rows,
  onUpdateRow,
  onDeleteRow,
  onClearAll,
  totals,
  onShowInvoice,
  onPrintInvoice,
  onSendInvoice,
  isMobile,
}: CartTabProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileText className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm mt-2">Add items from the calculator to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Cart ({rows.length} items)</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-3">
          {rows.map((row) => {
            const { displayAmount } = calculateLineTotal(row);
            
            return (
              <div
                key={row.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="font-semibold text-sm leading-tight">
                      {row.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unit Price: {formatCurrency(row.price)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteRow(row.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Quantity */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          onUpdateRow(row.id, {
                            quantity: Math.max(0, row.quantity - 1),
                          })
                        }
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min="0"
                        value={row.quantity}
                        onChange={(e) =>
                          onUpdateRow(row.id, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full h-8 px-2 text-center border border-border rounded bg-background"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          onUpdateRow(row.id, { quantity: row.quantity + 1 })
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.discount}
                      onChange={(e) =>
                        onUpdateRow(row.id, {
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full h-8 px-2 border border-border rounded bg-background"
                    />
                  </div>
                </div>

                {/* Payment Type Toggle */}
                {row.paymentType === 'deposit' && (
                  <div className="mb-3">
                    <Button
                      variant={row.convertToSubscription ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        onUpdateRow(row.id, {
                          convertToSubscription: !row.convertToSubscription,
                        })
                      }
                      className="w-full"
                    >
                      {row.convertToSubscription
                        ? '🔄 Subscription'
                        : '🏦 50% Deposit'}
                    </Button>
                  </div>
                )}

                {/* Line Total */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {row.paymentType === 'subscription' && '🔄 Recurring'}
                    {row.paymentType === 'deposit' && '🏦 Deposit'}
                    {row.paymentType === 'full' && '💵 Full Payment'}
                  </span>
                  <span className="font-bold text-primary">
                    {formatCurrency(displayAmount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom: Totals & Actions */}
      <div className="border-t border-border pt-4 bg-background">
        {/* Totals Breakdown */}
        <div className="space-y-2 mb-4">
          {totals.subscriptionTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">🔄 Subscription Total</span>
              <span className="font-semibold">
                {formatCurrency(totals.subscriptionTotal)}
              </span>
            </div>
          )}
          {totals.depositTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">🏦 Deposit Total</span>
              <span className="font-semibold">
                {formatCurrency(totals.depositTotal)}
              </span>
            </div>
          )}
          {totals.fullTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">💵 Full Payment Total</span>
              <span className="font-semibold">
                {formatCurrency(totals.fullTotal)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Grand Total</span>
            <span className="text-primary">
              {formatCurrency(totals.grandTotal)}
            </span>
          </div>
          {totals.depositOriginalTotal > totals.depositTotal && (
            <div className="text-xs text-muted-foreground text-right">
              Balance due:{' '}
              {formatCurrency(totals.depositOriginalTotal - totals.depositTotal)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onShowInvoice}
            >
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onPrintInvoice}
            >
              <Printer className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={onSendInvoice}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Invoice to Client
          </Button>
        </div>
      </div>
    </div>
  );
}

