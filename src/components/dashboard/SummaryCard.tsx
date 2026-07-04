import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from '../ui/Card';

interface SummaryCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  periodLabel: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  change?: {
    direction: 'increase' | 'decrease' | 'neutral';
    percentage: number | null;
    difference: number;
  };
}

const toneStyles: Record<NonNullable<SummaryCardProps['tone']>, string> = {
  default: 'text-text-secondary bg-surface-alt',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
};

export function SummaryCard({ label, value, icon: Icon, periodLabel, tone = 'default', change }: SummaryCardProps) {
  const changeTone = change?.direction === 'increase' ? 'success' : change?.direction === 'decrease' ? 'danger' : 'default';
  const ChangeIcon = change?.direction === 'increase' ? ArrowUpRight : change?.direction === 'decrease' ? ArrowDownRight : Minus;

  return (
    <Card className="min-h-[170px]">
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-muted">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-text">{value}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-text-muted">{periodLabel}</p>
          </div>
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', toneStyles[tone])}>
            <Icon size={18} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          {change ? (
            <div
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                changeTone === 'success'
                  ? 'bg-success/10 text-success'
                  : changeTone === 'danger'
                    ? 'bg-danger/10 text-danger'
                    : 'bg-surface-alt text-text-secondary',
              )}
            >
              <ChangeIcon size={13} />
              <span>
                {change.percentage === null ? 'New this month' : `${change.percentage >= 0 ? '+' : ''}${change.percentage.toFixed(1)}%`}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-text-secondary">
              No previous period
            </div>
          )}

          <span className="text-xs text-text-muted">{change ? `Δ ${change.difference >= 0 ? '+' : ''}${change.difference.toFixed(0)}` : 'Insufficient history'}</span>
        </div>
      </div>
    </Card>
  );
}