import { categories, transactions } from '../data/seedData';
import type { Category, Transaction, TransactionType } from '../types/finance';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const transactionTypeLabels: Record<TransactionType, string> = {
  income: 'Income',
  expense: 'Expense',
  saving: 'Saving',
  investment: 'Investment',
  remittance: 'Remittance',
};

export function sortTransactionsByNewest(items: Transaction[] = transactions) {
  return [...items].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

export function formatTransactionAmount(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatTransactionDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

export function getTransactionTypeLabel(type: TransactionType) {
  return transactionTypeLabels[type];
}

export function getTransactionCategory(transaction: Transaction, categoryList: Category[] = categories) {
  return categoryList.find((category) => category.id === transaction.categoryId);
}

export function getLatestTransaction(items: Transaction[] = transactions) {
  return sortTransactionsByNewest(items)[0] ?? null;
}
