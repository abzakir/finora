export type TransactionType = 'income' | 'expense' | 'saving' | 'investment' | 'remittance';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  parentId?: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  subcategoryId?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalRemittances: number;
}

export interface PercentageChange {
  current: number;
  previous: number;
  difference: number;
  percentage: number | null;
  direction: 'increase' | 'decrease' | 'neutral';
}

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  total: number;
  transactionCount: number;
}

export interface MonthlyGroup {
  month: string;
  year: number;
  label: string;
  total: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  remittances: number;
  transactionCount: number;
}

export interface IncomeExpenseComparison {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number | null;
}

export interface FinancialSummaryComparison {
  currentPeriod: string;
  previousPeriod: string | null;
  current: FinancialSummary;
  previous: FinancialSummary | null;
  changes: Partial<Record<keyof FinancialSummary, PercentageChange>>;
}

export interface SavingsTrendPoint {
  month: string;
  year: number;
  label: string;
  totalSavings: number;
  cumulativeSavings: number;
}

export interface InvestmentContributionPoint {
  month: string;
  year: number;
  label: string;
  totalInvestments: number;
}