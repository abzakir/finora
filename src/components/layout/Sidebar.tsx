import { ChevronLeft, ChevronRight } from 'lucide-react';
import { appLogoUrl, appName } from '../../config/branding';
import { navigationItems, type AppSection } from '../../config/navigation';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SidebarProps {
  activeSection: AppSection;
  collapsed: boolean;
  onSectionChange: (section: AppSection) => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeSection, collapsed, onSectionChange, onToggleCollapse }: SidebarProps) {
  return (
    <div className="sticky top-6 h-[calc(100vh-3rem)] px-4 pb-6">
      <Card className={cn('flex h-full flex-col gap-6 overflow-hidden p-4', collapsed ? 'items-center' : 'items-stretch')}>
        <div className={cn('flex w-full items-center gap-3', collapsed ? 'justify-center' : 'justify-between')}>
          <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : 'min-w-0')}>
            <img src={appLogoUrl} alt="" className="h-11 w-11 rounded-2xl border border-border/70 bg-surface object-cover shadow-sm" />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-wide text-text">{appName}</p>
                <p className="text-xs text-text-muted">Personal finance dashboard</p>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 text-text-secondary transition hover:bg-surface-alt"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          ) : null}
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  isActive
                    ? 'border-primary/20 bg-primary/6 text-text shadow-[0_0_0_1px_rgba(38,78,91,0.08)]'
                    : 'border-transparent text-text-secondary hover:border-border/80 hover:bg-surface-alt hover:text-text',
                  collapsed ? 'justify-center px-0' : '',
                )}
                onClick={() => onSectionChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-surface-alt text-text-secondary group-hover:bg-surface group-hover:text-text',
                  )}
                >
                  <Icon size={18} />
                </span>

                {!collapsed ? (
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-text">{item.label}</span>
                    <span className="block text-xs leading-5 text-text-muted">{item.description}</span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="w-full pt-2">
          <Button
            className={cn('w-full', collapsed ? 'px-0' : '')}
            variant="secondary"
            icon={<ChevronRight size={16} />}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '' : 'Collapse'}
          </Button>
        </div>
      </Card>
    </div>
  );
}