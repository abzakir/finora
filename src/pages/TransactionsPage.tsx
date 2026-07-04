import { ArrowDownRight, ArrowUpRight, Clock3, CreditCard, PencilLine, Plus, Trash2, Wallet } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/cn';
import {
  formatTransactionAmount,
  formatTransactionDate,
  getLatestTransaction,
  getTransactionCategory,
  getTransactionTypeLabel,
  sortTransactionsByNewest,
} from '../lib/transactions';
import type { Category, Transaction, TransactionType } from '../types/finance';

const typeStyles: Record<TransactionType, string> = {
  income: 'bg-success/10 text-success border-success/20',
  expense: 'bg-danger/10 text-danger border-danger/20',
  saving: 'bg-primary/10 text-primary border-primary/20',
  investment: 'bg-secondary/10 text-text-secondary border-border/80',
  remittance: 'bg-warning/10 text-warning border-warning/20',
};

interface TransactionsPageProps {
  transactions: Transaction[];
  categories: Category[];
  onCreateTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
}

function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold', typeStyles[type])}>{getTransactionTypeLabel(type)}</span>;
}

export function TransactionsPage({ transactions, categories, onCreateTransaction, onEditTransaction, onDeleteTransaction }: TransactionsPageProps) {
  const sortedTransactions = sortTransactionsByNewest(transactions);
  const latestTransaction = getLatestTransaction(transactions);

  const summaryTiles = [
    {
      label: 'Total transactions',
      value: String(sortedTransactions.length),
      description: 'Records currently stored in memory',
      icon: CreditCard,
    },
    {
      label: 'Latest activity',
      value: latestTransaction ? formatTransactionDate(latestTransaction.date) : 'No data',
      description: latestTransaction ? latestTransaction.title : 'No transactions available',
      icon: Clock3,
    },
    {
      label: 'Categories used',
      value: String(categories.length),
      description: 'Income, expense, saving, investment, remittance',
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,246,242,0.92))]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Transaction history</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Track every financial movement in one place.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
              Phase 5A introduced a responsive read-only history view. Phase 5B and 5C now add the creation, editing, and deletion flows on top of the same list.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            {summaryTiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <div key={tile.label} className="rounded-2xl border border-border/80 bg-surface px-4 py-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{tile.label}</p>
                      <p className="mt-2 text-lg font-semibold text-text">{tile.value}</p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-alt text-text-secondary">
                      <Icon size={16} />
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">{tile.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card
        header={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-text">Desktop table</h3>
              <p className="mt-1 text-sm text-text-secondary">Sorted by newest first for quick review and comparison.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              onClick={onCreateTransaction}
            >
              <Plus size={16} />
              Add transaction
            </button>
          </div>
        }
      >
        {sortedTransactions.length > 0 ? (
          <>
            <div className="hidden overflow-hidden rounded-[1.1rem] border border-border/80 md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/80">
                  <thead className="bg-surface-alt/70">
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70 bg-surface">
                    {sortedTransactions.map((transaction) => {
                      const category = getTransactionCategory(transaction, categories);
                      const isPositive = transaction.type === 'income';

                      return (
                        <tr key={transaction.id} className="align-top">
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-text-secondary">{formatTransactionDate(transaction.date)}</td>
                          <td className="px-4 py-4">
                            <div className="max-w-[280px]">
                              <p className="text-sm font-semibold text-text">{transaction.title}</p>
                              <p className="mt-1 text-sm text-text-muted">{transaction.note ?? 'No note provided'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <TransactionTypeBadge type={transaction.type} />
                          </td>
                          <td className="px-4 py-4 text-sm text-text-secondary">{category?.name ?? 'Uncategorized'}</td>
                          <td className={cn('whitespace-nowrap px-4 py-4 text-right text-sm font-semibold', isPositive ? 'text-success' : 'text-text')}>
                            <span className="inline-flex items-center gap-1">
                              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                              {formatTransactionAmount(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface-alt px-3 py-1.5 text-sm font-semibold text-text-secondary transition hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                onClick={() => onEditTransaction(transaction)}
                              >
                                <PencilLine size={14} />
                                Edit
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-danger/20 bg-danger/10 px-3 py-1.5 text-sm font-semibold text-danger transition hover:bg-danger/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
                                onClick={() => onDeleteTransaction(transaction)}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {sortedTransactions.map((transaction) => {
                const category = getTransactionCategory(transaction, categories);
                const isIncome = transaction.type === 'income';

                return (
                  <article key={transaction.id} className="rounded-[1.1rem] border border-border/80 bg-surface p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">{transaction.title}</p>
                        <p className="mt-1 text-xs text-text-muted">{formatTransactionDate(transaction.date)}</p>
                      </div>
                      <TransactionTypeBadge type={transaction.type} />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Category</p>
                        <p className="mt-1 font-medium text-text-secondary">{category?.name ?? 'Uncategorized'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Amount</p>
                        <p className={cn('mt-1 inline-flex items-center gap-1 font-semibold', isIncome ? 'text-success' : 'text-text')}>
                          {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {formatTransactionAmount(transaction.amount)}
                        </p>
                      </div>
                    </div>

                    {transaction.note ? <p className="mt-3 text-sm leading-6 text-text-muted">{transaction.note}</p> : null}

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-border/80 bg-surface-alt px-3 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface hover:text-text"
                        onClick={() => onEditTransaction(transaction)}
                      >
                        <PencilLine size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-danger/20 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger transition hover:bg-danger/15"
                        onClick={() => onDeleteTransaction(transaction)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-[1.1rem] border border-dashed border-border/80 bg-surface-alt/70 p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">No transactions yet</p>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Start by adding your first transaction. The dashboard and analytics will update immediately from the same in-memory data.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              onClick={onCreateTransaction}
            >
              <Plus size={16} />
              Add transaction
            </button>
          </div>
        )}
      </Card>

      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-surface-alt/70 p-4">
            <p className="text-sm font-medium text-text">Desktop behavior</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">Transactions are shown in a clean table for dense scanning and comparison.</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-surface-alt/70 p-4">
            <p className="text-sm font-medium text-text">Mobile behavior</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">Cards replace the table so the list stays readable and touch-friendly.</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-surface-alt/70 p-4">
            <p className="text-sm font-medium text-text">Next steps</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">Phase 6 will add local persistence so this in-memory store survives refreshes.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
