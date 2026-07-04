import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { TransactionDeleteDialog } from './components/transactions/TransactionDeleteDialog';
import { TransactionFormDialog } from './components/transactions/TransactionFormDialog';
import { categories as seedCategories, transactions as seedTransactions } from './data/seedData';
import { DashboardPage } from './pages/DashboardPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { type AppSection, navigationItems } from './config/navigation';
import { appLogoUrl } from './config/branding';
import type { Transaction, TransactionInput } from './types/finance';

type EditorState =
  | { mode: 'create' }
  | { mode: 'edit'; transactionId: string }
  | null;

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => seedTransactions);
  const [transactionEditor, setTransactionEditor] = useState<EditorState>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
  const activeTransaction = transactionEditor?.mode === 'edit'
    ? transactions.find((transaction) => transaction.id === transactionEditor.transactionId) ?? null
    : null;
  const deleteTarget = deleteTargetId ? transactions.find((transaction) => transaction.id === deleteTargetId) ?? null : null;

  const openCreateTransaction = () => {
    setDeleteTargetId(null);
    setTransactionEditor({ mode: 'create' });
  };

  const openEditTransaction = (transactionId: string) => {
    setDeleteTargetId(null);
    setTransactionEditor({ mode: 'edit', transactionId });
  };

  const openDeleteTransaction = (transactionId: string) => {
    setTransactionEditor(null);
    setDeleteTargetId(transactionId);
  };

  const closeTransactionDialog = () => setTransactionEditor(null);
  const closeDeleteDialog = () => setDeleteTargetId(null);

  const submitTransaction = (values: TransactionInput) => {
    const now = new Date().toISOString();

    if (transactionEditor?.mode === 'edit') {
      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === transactionEditor.transactionId
            ? { ...transaction, ...values, updatedAt: now }
            : transaction,
        ),
      );
      setTransactionEditor(null);
      return;
    }

    setTransactions((currentTransactions) => [
      {
        id: crypto.randomUUID(),
        ...values,
        createdAt: now,
      },
      ...currentTransactions,
    ]);
    setTransactionEditor(null);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) {
      return;
    }

    setTransactions((currentTransactions) => currentTransactions.filter((transaction) => transaction.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  return (
    <>
      <AppShell
        activeSection={activeSection}
        activeItem={activeItem}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
        onSectionChange={setActiveSection}
        onQuickAddTransaction={openCreateTransaction}
      >
        {activeSection === 'dashboard' ? (
          <DashboardPage
            transactions={transactions}
            categories={seedCategories}
            onViewTransactions={() => setActiveSection('transactions')}
            onQuickAddTransaction={openCreateTransaction}
          />
        ) : activeSection === 'transactions' ? (
          <TransactionsPage
            transactions={transactions}
            categories={seedCategories}
            onCreateTransaction={openCreateTransaction}
            onEditTransaction={(transaction) => openEditTransaction(transaction.id)}
            onDeleteTransaction={(transaction) => openDeleteTransaction(transaction.id)}
          />
        ) : (
          <ComingSoonPage sectionLabel={activeItem.label} />
        )}
      </AppShell>

      <TransactionFormDialog
        open={transactionEditor !== null}
        mode={transactionEditor?.mode ?? 'create'}
        categories={seedCategories}
        transaction={activeTransaction}
        onClose={closeTransactionDialog}
        onSubmit={submitTransaction}
      />

      <TransactionDeleteDialog
        open={deleteTarget !== null}
        transaction={deleteTarget}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default App;