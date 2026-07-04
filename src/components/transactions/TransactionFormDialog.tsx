import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cn';
import type { Category, Transaction, TransactionInput, TransactionType } from '../../types/finance';

interface TransactionFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  categories: Category[];
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (values: TransactionInput) => void;
}

interface TransactionFormState {
  title: string;
  amount: string;
  date: string;
  type: TransactionType;
  categoryId: string;
  subcategoryId: string;
  note: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  date?: string;
  categoryId?: string;
}

const typeOptions: Array<{ value: TransactionType; label: string }> = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'saving', label: 'Saving' },
  { value: 'investment', label: 'Investment' },
  { value: 'remittance', label: 'Remittance' },
];

function createInitialState(transaction: Transaction | null, categories: Category[]): TransactionFormState {
  const type = transaction?.type ?? 'expense';
  const matchingCategory = transaction ? categories.find((category) => category.id === transaction.categoryId) : categories.find((category) => category.type === type);

  return {
    title: transaction?.title ?? '',
    amount: transaction?.amount.toString() ?? '',
    date: transaction?.date ?? new Date().toISOString().slice(0, 10),
    type,
    categoryId: matchingCategory?.id ?? categories.find((category) => category.type === type)?.id ?? '',
    subcategoryId: transaction?.subcategoryId ?? '',
    note: transaction?.note ?? '',
  };
}

export function TransactionFormDialog({ open, mode, categories, transaction, onClose, onSubmit }: TransactionFormDialogProps) {
  const [draft, setDraft] = useState<TransactionFormState>(() => createInitialState(transaction, categories));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft(createInitialState(transaction, categories));
    setErrors({});
  }, [open, transaction, categories]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const filteredCategories = categories.filter((category) => category.type === draft.type);

  const updateType = (nextType: TransactionType) => {
    const matchingCategories = categories.filter((category) => category.type === nextType);

    setDraft((current) => ({
      ...current,
      type: nextType,
      categoryId: matchingCategories.some((category) => category.id === current.categoryId) ? current.categoryId : matchingCategories[0]?.id ?? '',
    }));
  };

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};

    if (!draft.title.trim()) nextErrors.title = 'Enter a transaction title.';
    if (!draft.amount || Number.isNaN(Number(draft.amount)) || Number(draft.amount) <= 0) nextErrors.amount = 'Enter an amount greater than zero.';
    if (!draft.date) nextErrors.date = 'Choose a transaction date.';
    if (!draft.categoryId) nextErrors.categoryId = 'Choose a category.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: draft.title.trim(),
      amount: Number(draft.amount),
      date: draft.date,
      type: draft.type,
      categoryId: draft.categoryId,
      subcategoryId: draft.subcategoryId.trim() || undefined,
      note: draft.note.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-text/30 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-6">
      <div className="w-full max-w-3xl" role="dialog" aria-modal="true" aria-labelledby="transaction-form-title">
        <Card className="max-h-[calc(100vh-1.5rem)] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{mode === 'create' ? 'Create transaction' : 'Edit transaction'}</p>
              <h2 id="transaction-form-title" className="mt-2 text-2xl font-semibold tracking-tight text-text">
                {mode === 'create' ? 'Add a new transaction' : 'Update this transaction'}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">Use this form to capture the amount, category, and note for a financial record.</p>
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

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-text">Title</span>
              <input
                className={cn('finora-input w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary', errors.title ? 'border-danger/40' : 'border-border/80')}
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="Monthly salary"
              />
              {errors.title ? <p className="text-sm text-danger">{errors.title}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Amount</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                className={cn('finora-input w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary', errors.amount ? 'border-danger/40' : 'border-border/80')}
                value={draft.amount}
                onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
                placeholder="0.00"
              />
              {errors.amount ? <p className="text-sm text-danger">{errors.amount}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Date</span>
              <input
                type="date"
                className={cn('finora-input w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary', errors.date ? 'border-danger/40' : 'border-border/80')}
                value={draft.date}
                onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
              />
              {errors.date ? <p className="text-sm text-danger">{errors.date}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Type</span>
              <select
                className="finora-input w-full rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                value={draft.type}
                onChange={(event) => updateType(event.target.value as TransactionType)}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Category</span>
              <select
                className={cn('finora-input w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary', errors.categoryId ? 'border-danger/40' : 'border-border/80')}
                value={draft.categoryId}
                onChange={(event) => setDraft((current) => ({ ...current, categoryId: event.target.value }))}
              >
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? <p className="text-sm text-danger">{errors.categoryId}</p> : null}
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-text">Subcategory</span>
              <input
                className="finora-input w-full rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                value={draft.subcategoryId}
                onChange={(event) => setDraft((current) => ({ ...current, subcategoryId: event.target.value }))}
                placeholder="Optional subcategory"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-text">Note</span>
              <textarea
                className="finora-input min-h-[120px] w-full rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                placeholder="Optional note for context"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border/80 pt-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {mode === 'create' ? 'Add transaction' : 'Save changes'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
