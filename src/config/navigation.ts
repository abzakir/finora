import {
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Settings,
  Wallet,
} from 'lucide-react';

export type AppSection = 'dashboard' | 'transactions' | 'analytics' | 'goals' | 'settings';

export const navigationItems: Array<{
  id: AppSection;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview and key financial questions',
    icon: LayoutDashboard,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    description: 'Track income and expenses',
    icon: Wallet,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Explore trends and comparisons',
    icon: LineChart,
  },
  {
    id: 'goals',
    label: 'Savings Goals',
    description: 'Monitor progress toward targets',
    icon: PiggyBank,
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Adjust preferences and defaults',
    icon: Settings,
  },
];