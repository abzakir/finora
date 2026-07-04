import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatTransactionAmount, formatTransactionDate, getTransactionTypeLabel } from '../../lib/transactions';
import type { Transaction } from '../../types/finance';

interface TransactionDeleteDialogProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function TransactionDeleteDialog({ open, transaction, onClose, onConfirm }: TransactionDeleteDialogProps) {
  if (!open || !transaction) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-text/30 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-6">
      <div className="w-full max-w-lg" role="dialog" aria-modal="true" aria-labelledby="transaction-delete-title">
        <Card>
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <AlertTriangle size={18} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Delete transaction</p>
                <h2 id="transaction-delete-title" className="mt-2 text-2xl font-semibold tracking-tight text-text">
                  Remove this record?
                </h2>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-text-secondary transition hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-border/80 bg-surface-alt/70 p-4">
            <p className="text-sm font-semibold text-text">{transaction.title}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {getTransactionTypeLabel(transaction.type)} · {formatTransactionDate(transaction.date)} · {formatTransactionAmount(transaction.amount)}
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 text-text-secondary">
            This removes the transaction from the current session. The dashboard and charts will update immediately.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border/80 pt-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
              onClick={onConfirm}
            >
              Delete transaction
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
