import { ArrowRight, CircleDashed, CreditCard, LayoutGrid, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const summaryCards = [
  { label: 'Total Balance', value: 'Ready for data', icon: Wallet },
  { label: 'Monthly Income', value: 'Ready for data', icon: CreditCard },
  { label: 'Monthly Expenses', value: 'Ready for data', icon: LayoutGrid },
  { label: 'Savings', value: 'Ready for data', icon: CircleDashed },
];

export function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,246,242,0.92))]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Foundation phase</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              A clean starting point for Finora&apos;s financial dashboard.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
              This shell is intentionally empty for now. Phase 2 will connect real financial data and calculations,
              and later phases will add charts, transactions, and analytics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" icon={<ArrowRight size={16} />}>
              View roadmap
            </Button>
            <Button icon={<ArrowRight size={16} />}>Quick Add Transaction</Button>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label} className="min-h-[150px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-muted">{card.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-text">{card.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-alt text-text-secondary">
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-6 h-2 rounded-full bg-surface-alt" />
            </Card>
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
              <h3 className="text-lg font-semibold tracking-tight text-text">Activity snapshot</h3>
              <p className="mt-1 text-sm text-text-secondary">A future transaction feed and useful empty states.</p>
            </div>
          }
          className="min-h-[340px]"
        >
          <div className="flex h-[250px] items-center justify-center rounded-[1.1rem] border border-dashed border-border/80 bg-surface-alt/70 text-center text-sm text-text-muted">
            Transaction history will appear here in Phase 5
          </div>
        </Card>
      </section>

      <Card
        header={
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-text">Dashboard structure</h3>
            <p className="mt-1 text-sm text-text-secondary">
              The shell is ready for summary cards, charts, and transaction insights without mixing business logic into the UI.
            </p>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {['Income vs expense comparison', 'Category analysis', 'Goal tracking'].map((label) => (
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