import { VIEWS } from '../lib/constants.js';
import { PillButton } from './ui.jsx';

export default function Header({ view, onChangeView, profileName, onLogout }) {
  return (
    <div
      style={{
        background: 'var(--plum-100)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <div className="s-eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Stack Wealth Academy · Modul
        </div>
        <div className="s-display-md" style={{ color: '#fff', fontSize: 26 }}>
          Budsjett &amp; formue
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {VIEWS.map(({ id, label }) => (
          <PillButton
            key={id}
            variant={view === id ? 'light' : 'ghost'}
            onClick={() => onChangeView(id)}
            style={{ padding: '9px 16px' }}
          >
            {label}
          </PillButton>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="s-body-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Hei, {profileName}
        </div>
        {onLogout && (
          <PillButton variant="ghost" onClick={onLogout} style={{ padding: '8px 14px' }}>
            Logg ut
          </PillButton>
        )}
      </div>
    </div>
  );
}
