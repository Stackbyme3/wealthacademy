import { useAuth0 } from '@auth0/auth0-react';
import { PillButton } from '../components/ui.jsx';
import { auth0Config } from './config.js';

const TERMS_URL = 'https://stackby.me/betingelser-og-vilkar';

function LoginConsent() {
  return (
    <p
      className="s-body-sm"
      style={{
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      Ved å opprette en profil godtar du{' '}
      <a
        href={TERMS_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        vilkår og betingelser
      </a>{' '}
      og abonnement på vårt nyhetsbrev
    </p>
  );
}

export default function AuthGate() {
  const { loginWithRedirect, isLoading, error } = useAuth0();
  const { configured } = auth0Config();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--gradient-hero)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        Laster…
      </div>
    );
  }

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
          maxWidth: 420,
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
        <div className="s-display-md" style={{ color: '#fff' }}>
          Budsjett &amp; formue
        </div>
        <div className="s-body" style={{ color: 'var(--text-inverse-dim)' }}>
          Logg inn eller opprett Stack-konto for å bruke budsjettverktøyet. Data lagres på
          kontoen din.
        </div>

        {!configured && (
          <div className="s-body-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Auth0 er ikke konfigurert. Sett <code>VITE_AUTH0_DOMAIN</code> og{' '}
            <code>VITE_AUTH0_CLIENT_ID</code> ved build.
          </div>
        )}

        {error && (
          <div className="s-body-sm" style={{ color: 'var(--pink-100)' }}>
            {error.message}
          </div>
        )}

        <LoginConsent />

        <PillButton
          variant="lemon"
          disabled={!configured}
          onClick={() =>
            loginWithRedirect({
              authorizationParams: { prompt: 'login' },
            })
          }
          style={{ padding: '14px 22px', fontSize: 15 }}
        >
          Logg inn
        </PillButton>
      </div>
    </div>
  );
}
