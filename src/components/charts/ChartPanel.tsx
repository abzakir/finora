import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface ChartPanelProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function ChartPanel({ title, description, children, className }: ChartPanelProps) {
  return (
    <Card
      header={
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-text">{title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
      }
      className={className}
    >
      {children}
    </Card>
  );
}