import { ArrowRight, BarChart3, CircleDashed, CreditCard, HandCoins, PiggyBank, Wallet } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartEmptyState } from '../components/charts/ChartEmptyState';
import { ChartPanel } from '../components/charts/ChartPanel';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  getExpenseCategoryBreakdown,
  getFinancialDistribution,
  getLatestMonthlySummaryComparison,
  getSeedFinancialSummary,
  getSeedMonthlyGroups,
} from '../lib/finance';
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

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

const chartTextColor = '#4C5A60';

function renderCurrency(value: number) {
  return currencyFormatter.format(value);
}

function renderPercentage(value: number) {
  return `${percentFormatter.format(value)}%`;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: { name?: string; categoryName?: string; percentage?: number } }>; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface px-4 py-3 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{item?.categoryName ?? item?.name ?? label ?? 'Value'}</p>
      <p className="mt-1 text-sm font-semibold text-text">{renderCurrency(payload[0]?.value ?? 0)}</p>
      {typeof item?.percentage === 'number' ? <p className="mt-1 text-xs text-text-secondary">{renderPercentage(item.percentage)}</p> : null}
    </div>
  );
}

export function DashboardPage() {
  const summary = getLatestMonthlySummaryComparison();
  const historicalSummary = getSeedFinancialSummary();
  const monthlyGroups = getSeedMonthlyGroups();
  const financialDistribution = getFinancialDistribution();
  const expenseCategoryBreakdown = getExpenseCategoryBreakdown();

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
              value={renderCurrency(currentValue)}
              icon={metric.icon}
              periodLabel={summary.currentPeriod}
              change={change}
              tone={metric.tone}
            />
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <ChartPanel
          title="Overall financial distribution"
          description="Where your money is allocated across expenses, savings, investments, and remittances."
          className="min-h-[420px]"
        >
          {financialDistribution.length > 0 ? (
            <div className="space-y-5">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={108}
                      paddingAngle={3}
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth={2}
                    >
                      {financialDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      formatter={(value) => <span className="text-sm text-text-secondary">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {financialDistribution.map((entry) => (
                  <div key={entry.name} className="rounded-2xl border border-border/80 bg-surface-alt/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <p className="text-sm font-medium text-text">{entry.name}</p>
                      </div>
                      <p className="text-sm font-semibold text-text-secondary">{renderPercentage(entry.percentage)}</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-text">{renderCurrency(entry.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ChartEmptyState
              title="No allocation data"
              description="Add transactions for expenses, savings, investments, or remittances to populate the overall distribution chart."
            />
          )}
        </ChartPanel>

        <ChartPanel
          title="Expense category breakdown"
          description="Which expense categories consume the most of your money."
          className="min-h-[420px]"
        >
          {expenseCategoryBreakdown.length > 0 ? (
            <div className="space-y-5">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseCategoryBreakdown} layout="vertical" margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                    <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                    <YAxis
                      type="category"
                      dataKey="categoryName"
                      width={100}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: chartTextColor, fontSize: 12 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="total" radius={[0, 10, 10, 0]} barSize={14}>
                      {expenseCategoryBreakdown.map((entry) => (
                        <Cell key={entry.categoryId} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {expenseCategoryBreakdown.map((entry) => (
                  <div key={entry.categoryId} className="flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-surface-alt/70 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="truncate text-sm font-medium text-text">{entry.categoryName}</span>
                    </div>
                    <span className="text-sm font-semibold text-text-secondary">{renderPercentage(entry.percentage)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ChartEmptyState
              title="No expense categories"
              description="Create expense transactions to see the category breakdown and spending concentration."
            />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
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
                Balance {renderCurrency(summary.current.totalBalance)} from {renderCurrency(summary.current.monthlyIncome)} in income.
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-border/80 bg-surface-alt/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Previous month</p>
              <p className="mt-2 text-lg font-semibold text-text">{summary.previousPeriod ?? 'No prior month'}</p>
              <p className="mt-2 text-sm text-text-secondary">
                {summary.previous
                  ? `Balance ${renderCurrency(summary.previous.totalBalance)} and ${renderCurrency(summary.previous.monthlyExpenses)} in expenses.`
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
            `Historical totals: ${renderCurrency(historicalSummary.totalBalance)} balance`,
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