import { useState } from 'react';
import { PillButton } from './ui.jsx';

export default function Onboarding({ onSubmit, defaultName = '' }) {
  const [name, setName] = useState(defaultName);
  const submit = () => name.trim() && onSubmit(name);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--glass-fill)',
          border: '1px solid var(--border-glass)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-hero)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div className="s-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Stack Wealth Academy
        </div>
        <div className="s-display-md" style={{ color: '#fff' }}>Velkommen</div>
        <div className="s-body" style={{ color: 'var(--text-inverse-dim)' }}>
          Skriv inn navnet ditt slik vi viser det i verktøyet. Budsjettdata lagres
          foreløpig i nettleseren — synk til konto kommer snart.
        </div>
        <input
          placeholder="Ditt navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-input)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border-glass)',
            color: '#fff',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <PillButton variant="lemon" onClick={submit} style={{ padding: '14px 22px', fontSize: 15 }}>
          Start
        </PillButton>
      </div>
    </div>
  );
}
