import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { type AppSection, navigationItems } from './config/navigation';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeItem = navigationItems.find((item) => item.id === activeSection) ?? navigationItems[0];

  return (
    <AppShell
      activeSection={activeSection}
      activeItem={activeItem}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'dashboard' ? <DashboardPage /> : <ComingSoonPage sectionLabel={activeItem.label} />}
    </AppShell>
  );
}

export default App;