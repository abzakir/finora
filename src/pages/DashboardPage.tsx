import { ArrowRight, BarChart3, CircleDashed, CreditCard, HandCoins, PiggyBank, Wallet } from 'lucide-react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getLatestMonthlySummaryComparison, getSeedFinancialSummary, getSeedMonthlyGroups } from '../lib/finance';
import type { FinancialSummary } from '../types/finance';

const metricConfig: Array<{
  key: keyof FinancialSummary;
  label: string;
  icon: typeof Wallet;
  tone: 'default' | 'success' | 'warning' | 'danger';
}> = [
  { key: 'totalBalance', label: 'Total Balance', icon: Wallet, tone: 'default' as const },
  { key: 'monthlyIncome', label: 'Monthly Income', icon: CreditCard, tone: 'success' as const },
  { key: 'monthlyExpenses', label: 'Monthly Expenses', icon: HandCoins, tone: 'danger' as const },
  { key: 'totalSavings', label: 'Total Savings', icon: PiggyBank, tone: 'success' as const },
  { key: 'totalInvestments', label: 'Total Investments', icon: BarChart3, tone: 'default' as const },
  { key: 'totalRemittances', label: 'Remittances', icon: CircleDashed, tone: 'warning' as const },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function DashboardPage() {
  const summary = getLatestMonthlySummaryComparison();
  const historicalSummary = getSeedFinancialSummary();
  const monthlyGroups = getSeedMonthlyGroups();

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,246,242,0.92))]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Dashboard overview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              A focused monthly snapshot of your financial activity.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
              Finora highlights the current month first, then compares it to the previous month so the dashboard answers
              useful questions about balance, spending, saving, and investing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" icon={<ArrowRight size={16} />}>
              View transactions
            </Button>
            <Button icon={<ArrowRight size={16} />}>Quick Add Transaction</Button>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metricConfig.map((metric) => {
          const currentValue = summary.current[metric.key];
          const change = summary.changes[metric.key];

          return (
            <SummaryCard
              key={metric.key}
              label={metric.label}
              value={formatCurrency(currentValue)}
              icon={metric.icon}
              periodLabel={summary.currentPeriod}
              change={change}
              tone={metric.tone}
            />
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card
          header={
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-text">Financial distribution</h3>
              <p className="mt-1 text-sm text-text-secondary">Reserved for the overall spending and allocation chart.</p>
            </div>
          }
          className="min-h-[340px]"
        >
          <div className="flex h-[250px] items-center justify-center rounded-[1.1rem] border border-dashed border-border/80 bg-surface-alt/70 text-center text-sm text-text-muted">
            Chart placeholder for Phase 4
          </div>
        </Card>

        <Card
          header={
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-text">Period context</h3>
              <p className="mt-1 text-sm text-text-secondary">A quick look at the current and previous months.</p>
            </div>
          }
          className="min-h-[340px]"
        >
          <div className="grid h-[250px] gap-3">
            <div className="rounded-[1.1rem] border border-border/80 bg-surface-alt/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Current month</p>
              <p className="mt-2 text-lg font-semibold text-text">{summary.currentPeriod}</p>
              <p className="mt-2 text-sm text-text-secondary">
                Balance {formatCurrency(summary.current.totalBalance)} from {formatCurrency(summary.current.monthlyIncome)} in income.
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-border/80 bg-surface-alt/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Previous month</p>
              <p className="mt-2 text-lg font-semibold text-text">{summary.previousPeriod ?? 'No prior month'}</p>
              <p className="mt-2 text-sm text-text-secondary">
                {summary.previous
                  ? `Balance ${formatCurrency(summary.previous.totalBalance)} and ${formatCurrency(summary.previous.monthlyExpenses)} in expenses.`
                  : 'Not enough history for a comparison.'}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Card
        header={
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-text">Dashboard structure</h3>
            <p className="mt-1 text-sm text-text-secondary">
              The shell is ready for charts and transaction insights without mixing business logic into the UI.
            </p>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            `Income vs expense comparison across ${monthlyGroups.length} months`,
            `Historical totals: ${formatCurrency(historicalSummary.totalBalance)} balance`,
            'Goal tracking and transaction drill-down reserved for later phases',
          ].map((label) => (
            <div key={label} className="rounded-2xl border border-border/80 bg-surface-alt/70 p-4">
              <p className="text-sm font-medium text-text">{label}</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">Reserved for a focused dashboard module in a later phase.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}