import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { type AppSection, navigationItems } from './config/navigation';
import { appLogoUrl } from './config/branding';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const existingIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const existingAppleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');

    const iconLink = existingIcon ?? document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.type = 'image/png';
    iconLink.href = appLogoUrl;

    if (!existingIcon) {
      document.head.appendChild(iconLink);
    }

    const appleIconLink = existingAppleIcon ?? document.createElement('link');
    appleIconLink.rel = 'apple-touch-icon';
    appleIconLink.href = appLogoUrl;

    if (!existingAppleIcon) {
      document.head.appendChild(appleIconLink);
    }
  }, []);

  const activeItem = navigationItems.find((item) => item.id === activeSection) ?? navigationItems[0];

  return (
    <AppShell
      activeSection={activeSection}
      activeItem={activeItem}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'dashboard' ? (
        <DashboardPage />
      ) : activeSection === 'transactions' ? (
        <TransactionsPage />
      ) : (
        <ComingSoonPage sectionLabel={activeItem.label} />
      )}
    </AppShell>
  );
}

export default App;