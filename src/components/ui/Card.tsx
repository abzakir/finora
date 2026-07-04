import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ className, header, footer, children, ...props }: CardProps) {
  return (
    <section className={cn('finora-card p-5 sm:p-6', className)} {...props}>
      {header ? <div className="mb-4">{header}</div> : null}
      <div>{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}