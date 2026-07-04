import { navigationItems, type AppSection } from '../../config/navigation';
import { cn } from '../../lib/cn';

interface MobileNavProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

export function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg">
      <div className="mx-auto grid max-w-4xl grid-cols-5 gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeSection;

          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                active ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:bg-surface-alt hover:text-text',
              )}
              onClick={() => onSectionChange(item.id)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={17} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}