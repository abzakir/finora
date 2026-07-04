import { ChevronDown, Menu, Plus } from 'lucide-react';
import { type AppSection } from '../../config/navigation';
import { appLogoUrl, appName } from '../../config/branding';
import { Button } from '../ui/Button';

interface HeaderProps {
  activeLabel: string;
  onSidebarToggle: () => void;
  onSectionChange: (section: AppSection) => void;
  onQuickAddTransaction: () => void;
}

export function Header({ activeLabel, onSidebarToggle, onSectionChange, onQuickAddTransaction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 px-4 py-4 backdrop-blur md:px-6 lg:px-0 lg:pt-6 lg:pb-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="finora-pill">Personal finance</span>
              <span className="hidden sm:inline">/</span>
              <span className="hidden sm:block">{activeLabel}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-surface p-2 text-text-secondary transition hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:hidden"
                onClick={onSidebarToggle}
                aria-label="Toggle navigation"
              >
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-3">
                <img src={appLogoUrl} alt="" className="h-10 w-10 rounded-2xl border border-border/70 bg-surface object-cover shadow-sm" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{appName}</h1>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                    Visualize your money. Understand your habits. Build your future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              className="finora-pill gap-1.5 px-4 py-2 text-sm text-text"
              onClick={() => onSectionChange('dashboard')}
            >
              <span>This month</span>
              <ChevronDown size={14} />
            </button>
            <Button icon={<Plus size={16} />} onClick={onQuickAddTransaction}>
              Quick Add Transaction
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:hidden">
          <button
            type="button"
            className="finora-pill w-full justify-between px-4 py-2.5 text-sm text-text"
            onClick={() => onSectionChange('dashboard')}
          >
            <span>This month</span>
            <ChevronDown size={14} />
          </button>
          <Button className="w-full" icon={<Plus size={16} />} onClick={onQuickAddTransaction}>
            Quick Add Transaction
          </Button>
        </div>
      </div>
    </header>
  );
}