import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useBudget } from './hooks/useBudget.js';
import { useTotals } from './hooks/useTotals.js';
import AuthGate from './auth/AuthGate.jsx';
import Onboarding from './components/Onboarding.jsx';
import Header from './components/Header.jsx';
import MonthBar from './components/MonthBar.jsx';
import Dashboard from './components/views/Dashboard.jsx';
import Budget from './components/views/Budget.jsx';
import Rule from './components/views/Rule.jsx';
import NetWorth from './components/views/NetWorth.jsx';
import History from './components/views/History.jsx';
import LoadingShell from './components/LoadingShell.jsx';

function BudgetApp({ defaultName = '', onLogout }) {
  const budget = useBudget();
  const totals = useTotals(budget.displayed);
  const [view, setView] = useState('dashboard');

  if (!budget.loaded) {
    return (
      <LoadingShell message="Henter budsjett…" onLogout={onLogout} />
    );
  }
  if (!budget.profileName) {
    return <Onboarding onSubmit={budget.setProfileName} defaultName={defaultName} />;
  }

  const locked = !budget.isEditable;
  const actions = {
    setLabel: budget.setLabel,
    setAmount: budget.setAmount,
    addRow: budget.addRow,
    removeRow: budget.removeRow,
    setExtraDebt: budget.setExtraDebt,
  };

  const views = {
    dashboard: (
      <Dashboard
        totals={totals}
        lockedMonths={budget.lockedMonths}
        onChangeView={setView}
      />
    ),
    budget: (
      <Budget
        totals={totals}
        locked={locked}
        actions={actions}
        onStart={budget.startMonth}
      />
    ),
    rule: <Rule totals={totals} />,
    networth: <NetWorth totals={totals} locked={locked} actions={actions} />,
    history: <History lockedMonths={budget.lockedMonths} />,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {budget.syncError && (
        <div
          className="s-body-sm"
          style={{
            background: 'rgba(255, 80, 120, 0.15)',
            borderBottom: '1px solid rgba(255, 80, 120, 0.35)',
            color: '#fff',
            padding: '10px 24px',
            textAlign: 'center',
          }}
        >
          {budget.syncError} — data vises fra nettleser til API er tilgjengelig.
        </div>
      )}
      <Header
        view={view}
        onChangeView={setView}
        profileName={budget.profileName}
        onLogout={onLogout}
      />
      <MonthBar
        month={budget.displayed}
        isEditable={budget.isEditable}
        onStart={budget.startMonth}
        onLock={budget.lockMonth}
      />
      <main
        style={{
          flex: 1,
          padding: '28px 24px 60px',
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {views[view]}
      </main>
    </div>
  );
}

function AuthenticatedBudgetApp() {
  const { isAuthenticated, isLoading, user, logout } = useAuth0();

  const onLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) {
    return <LoadingShell onLogout={onLogout} />;
  }
  if (!isAuthenticated) return <AuthGate />;

  const defaultName = user?.given_name || user?.name || '';

  return <BudgetApp defaultName={defaultName} onLogout={onLogout} />;
}

export default function App({ authBypass = false }) {
  if (authBypass) return <BudgetApp />;
  return <AuthenticatedBudgetApp />;
}
