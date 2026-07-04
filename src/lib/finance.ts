import { categories as seedCategories, savingsGoals as seedSavingsGoals, transactions as seedTransactions } from '../data/seedData';
import type {
  Category,
  CategoryTotal,
  FinancialSummary,
  FinancialSummaryComparison,
  IncomeExpenseComparison,
  InvestmentContributionPoint,
  MonthlyGroup,
  PercentageChange,
  SavingsGoal,
  SavingsTrendPoint,
  Transaction,
  TransactionType,
} from '../types/finance';

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

function normalizeDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function getMonthKey(date: string) {
  const parsedDate = normalizeDate(date);
  const year = parsedDate.getUTCFullYear();
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');

  return { monthKey: `${year}-${month}`, year, month };
}

function getCategoryMap(categories: Category[] = seedCategories) {
  return new Map(categories.map((category) => [category.id, category]));
}

function sumValues(transactions: Transaction[]) {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}

function summaryFromMonthlyGroup(group: MonthlyGroup): FinancialSummary {
  return {
    totalBalance: group.income - group.expenses - group.savings - group.investments - group.remittances,
    monthlyIncome: group.income,
    monthlyExpenses: group.expenses,
    totalSavings: group.savings,
    totalInvestments: group.investments,
    totalRemittances: group.remittances,
  };
}

export function getTransactionsByType(transactions: Transaction[] = seedTransactions, type: TransactionType) {
  return transactions.filter((transaction) => transaction.type === type);
}

export function getTotalIncome(transactions: Transaction[] = seedTransactions) {
  return sumValues(getTransactionsByType(transactions, 'income'));
}

export function getTotalExpenses(transactions: Transaction[] = seedTransactions) {
  return sumValues(getTransactionsByType(transactions, 'expense'));
}

export function getTotalSavings(transactions: Transaction[] = seedTransactions) {
  return sumValues(getTransactionsByType(transactions, 'saving'));
}

export function getTotalInvestments(transactions: Transaction[] = seedTransactions) {
  return sumValues(getTransactionsByType(transactions, 'investment'));
}

export function getTotalRemittances(transactions: Transaction[] = seedTransactions) {
  return sumValues(getTransactionsByType(transactions, 'remittance'));
}

export function getCurrentBalance(transactions: Transaction[] = seedTransactions) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions) - getTotalSavings(transactions) - getTotalInvestments(transactions) - getTotalRemittances(transactions);
}

export function getFinancialSummary(transactions: Transaction[] = seedTransactions): FinancialSummary {
  return {
    totalBalance: getCurrentBalance(transactions),
    monthlyIncome: getTotalIncome(transactions),
    monthlyExpenses: getTotalExpenses(transactions),
    totalSavings: getTotalSavings(transactions),
    totalInvestments: getTotalInvestments(transactions),
    totalRemittances: getTotalRemittances(transactions),
  };
}

export function getCategoryTotals(
  transactions: Transaction[] = seedTransactions,
  categories: Category[] = seedCategories,
  type?: TransactionType,
): CategoryTotal[] {
  const categoryMap = getCategoryMap(categories);
  const totals = new Map<string, CategoryTotal>();

  transactions.forEach((transaction) => {
    if (type && transaction.type !== type) {
      return;
    }

    const category = categoryMap.get(transaction.categoryId);
    const categoryName = category?.name ?? transaction.categoryId;
    const existing = totals.get(transaction.categoryId);

    if (existing) {
      existing.total += transaction.amount;
      existing.transactionCount += 1;
      return;
    }

    totals.set(transaction.categoryId, {
      categoryId: transaction.categoryId,
      categoryName,
      type: transaction.type,
      total: transaction.amount,
      transactionCount: 1,
    });
  });

  return Array.from(totals.values()).sort((left, right) => right.total - left.total);
}

export function groupTransactionsByMonth(transactions: Transaction[] = seedTransactions): MonthlyGroup[] {
  const monthlyGroups = new Map<string, MonthlyGroup>();

  transactions.forEach((transaction) => {
    const { monthKey, year, month } = getMonthKey(transaction.date);
    const existing = monthlyGroups.get(monthKey);

    if (existing) {
      existing.total += transaction.amount;
      existing.transactionCount += 1;
      if (transaction.type === 'income') existing.income += transaction.amount;
      if (transaction.type === 'expense') existing.expenses += transaction.amount;
      if (transaction.type === 'saving') existing.savings += transaction.amount;
      if (transaction.type === 'investment') existing.investments += transaction.amount;
      if (transaction.type === 'remittance') existing.remittances += transaction.amount;
      return;
    }

    monthlyGroups.set(monthKey, {
      month,
      year,
      label: monthFormatter.format(normalizeDate(transaction.date)),
      total: transaction.amount,
      income: transaction.type === 'income' ? transaction.amount : 0,
      expenses: transaction.type === 'expense' ? transaction.amount : 0,
      savings: transaction.type === 'saving' ? transaction.amount : 0,
      investments: transaction.type === 'investment' ? transaction.amount : 0,
      remittances: transaction.type === 'remittance' ? transaction.amount : 0,
      transactionCount: 1,
    });
  });

  return Array.from(monthlyGroups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, group]) => group);
}

export function groupTransactionsByDateRange(
  transactions: Transaction[] = seedTransactions,
  startDate: string,
  endDate: string,
) : MonthlyGroup[] {
  const normalizedStartDate = normalizeDate(startDate);
  const normalizedEndDate = normalizeDate(endDate);

  return groupTransactionsByMonth(
    transactions.filter((transaction) => {
      const transactionDate = normalizeDate(transaction.date);
      return transactionDate >= normalizedStartDate && transactionDate <= normalizedEndDate;
    }),
  );
}

export function calculatePercentageChange(current: number, previous: number): PercentageChange {
  const difference = current - previous;

  if (current === previous) {
    return {
      current,
      previous,
      difference,
      percentage: 0,
      direction: 'neutral',
    };
  }

  if (previous === 0) {
    return {
      current,
      previous,
      difference,
      percentage: null,
      direction: current > 0 ? 'increase' : current < 0 ? 'decrease' : 'neutral',
    };
  }

  const percentage = (difference / Math.abs(previous)) * 100;

  return {
    current,
    previous,
    difference,
    percentage,
    direction: difference > 0 ? 'increase' : 'decrease',
  };
}

export function compareIncomeVsExpenses(transactions: Transaction[] = seedTransactions): IncomeExpenseComparison {
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    savingsRate: income > 0 ? ((income - expenses) / income) * 100 : null,
  };
}

export function getSavingsTrends(transactions: Transaction[] = seedTransactions): SavingsTrendPoint[] {
  const monthlyGroups = groupTransactionsByMonth(transactions);
  let cumulativeSavings = 0;

  return monthlyGroups.map((group) => {
    cumulativeSavings += group.savings;

    return {
      month: group.month,
      year: group.year,
      label: group.label,
      totalSavings: group.savings,
      cumulativeSavings,
    };
  });
}

export function getInvestmentContributionTotals(
  transactions: Transaction[] = seedTransactions,
): InvestmentContributionPoint[] {
  return groupTransactionsByMonth(transactions).map((group) => ({
    month: group.month,
    year: group.year,
    label: group.label,
    totalInvestments: group.investments,
  }));
}

export function getCategoriesByType(categories: Category[] = seedCategories, type?: TransactionType) {
  return type ? categories.filter((category) => category.type === type) : categories;
}

export function getSeedFinancialSummary() {
  return getFinancialSummary(seedTransactions);
}

export function getSeedCategoryTotals(type?: TransactionType) {
  return getCategoryTotals(seedTransactions, seedCategories, type);
}

export function getSeedMonthlyGroups() {
  return groupTransactionsByMonth(seedTransactions);
}

export function getSeedSavingsGoals(): SavingsGoal[] {
  return seedSavingsGoals;
}

export function getLatestMonthlySummaryComparison(transactions: Transaction[] = seedTransactions): FinancialSummaryComparison {
  const monthlyGroups = groupTransactionsByMonth(transactions);
  const currentMonth = monthlyGroups[monthlyGroups.length - 1] ?? null;
  const previousMonth = monthlyGroups[monthlyGroups.length - 2] ?? null;

  const current = currentMonth ? summaryFromMonthlyGroup(currentMonth) : getFinancialSummary([]);
  const previous = previousMonth ? summaryFromMonthlyGroup(previousMonth) : null;
  const changes: FinancialSummaryComparison['changes'] = {};

  if (previous) {
    (Object.keys(current) as Array<keyof FinancialSummary>).forEach((metric) => {
      changes[metric] = calculatePercentageChange(current[metric], previous[metric]);
    });
  }

  return {
    currentPeriod: currentMonth?.label ?? 'No data',
    previousPeriod: previousMonth?.label ?? null,
    current,
    previous,
    changes,
  };
}