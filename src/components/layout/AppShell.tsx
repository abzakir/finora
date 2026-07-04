import type { ReactNode } from 'react';
import { navigationItems, type AppSection } from '../../config/navigation';
import { cn } from '../../lib/cn';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
  activeSection: AppSection;
  activeItem: (typeof navigationItems)[number];
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onSectionChange: (section: AppSection) => void;
}

export function AppShell({
  children,
  activeSection,
  activeItem,
  sidebarCollapsed,
  onSidebarToggle,
  onSectionChange,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-0 lg:gap-6 xl:gap-8">
        <aside className={cn('hidden lg:block', sidebarCollapsed ? 'w-[92px]' : 'w-[290px]')}>
          <Sidebar
            activeSection={activeSection}
            collapsed={sidebarCollapsed}
            onSectionChange={onSectionChange}
            onToggleCollapse={onSidebarToggle}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-8">
          <Header
            activeLabel={activeItem.label}
            onSectionChange={onSectionChange}
            onSidebarToggle={onSidebarToggle}
          />

          <main className="flex-1 px-4 pb-6 pt-5 sm:px-6 lg:px-0 lg:pr-6 xl:pr-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileNav activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t from-background to-transparent lg:block" />
    </div>
  );
}