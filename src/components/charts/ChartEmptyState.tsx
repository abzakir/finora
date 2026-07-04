interface ChartEmptyStateProps {
  title: string;
  description: string;
}

export function ChartEmptyState({ title, description }: ChartEmptyStateProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[1.1rem] border border-dashed border-border/80 bg-surface-alt/70 p-6 text-center">
      <div className="max-w-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">{title}</p>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
      </div>
    </div>
  );
}