import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PillButton } from '../components/ui.jsx';
import { isApiConfigured } from '../lib/api.js';
import { createUserViaPost } from '../lib/createUser.js';
import { friendlyAuthError, getStackAccessToken } from '../lib/authToken.js';
import { auth0Config } from './config.js';

function extractName(user) {
  let firstName = user?.given_name;
  let lastName = user?.family_name;

  if ((!firstName || !lastName) && user?.name) {
    const isEmail = user.name.includes('@') && user.name.includes('.');
    if (!isEmail) {
      const parts = user.name.split(' ');
      firstName ??= parts[0];
      if (!lastName && parts.length > 1) {
        lastName = parts.slice(1).join(' ');
      }
    }
  }

  return { firstName, lastName };
}

export default function StackUserBootstrap({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout, user } = useAuth0();
  const { audience } = auth0Config();
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const ensuredRef = useRef(false);

  const ensureStackUser = useCallback(async () => {
    if (!isApiConfigured()) {
      setPhase('ready');
      return;
    }

    const email = user?.email;
    const sub = user?.sub;
    if (!email || !sub) {
      throw new Error('Auth0-profil mangler e-post eller bruker-ID');
    }

    const token = await getStackAccessToken(getAccessTokenSilently, audience);

    const { firstName, lastName } = extractName(user);

    await createUserViaPost({
      accessToken: token,
      email,
      avatar: user.picture,
      firstName,
      lastName,
      auth0UserId: sub,
    });
  }, [audience, getAccessTokenSilently, user]);

  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      setPhase('idle');
      ensuredRef.current = false;
      return;
    }

    if (ensuredRef.current) {
      setPhase('ready');
      return;
    }

    let cancelled = false;

    (async () => {
      setPhase('ensuring');
      setError(null);
      try {
        await ensureStackUser();
        if (!cancelled) {
          ensuredRef.current = true;
          setPhase('ready');
        }
      } catch (err) {
        if (!cancelled) {
          setPhase('error');
          setError(friendlyAuthError(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, ensureStackUser, retryKey]);

  // Auth0 still hydrating
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

  // Not logged in — render App → AuthGate (do not trap on idle spinner)
  if (!isAuthenticated) {
    return children;
  }

  if (phase === 'ensuring') {
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
        Kobler til Stack-konto…
      </div>
    );
  }

  if (phase === 'error') {
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
          <div className="s-display-md" style={{ color: '#fff' }}>
            Kunne ikke koble konto
          </div>
          <div className="s-body-sm" style={{ color: 'var(--pink-100)' }}>
            {error}
          </div>
          <PillButton
            variant="lemon"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            style={{ padding: '14px 22px', fontSize: 15 }}
          >
            Logg ut og prøv på nytt
          </PillButton>
          <PillButton
            variant="outline"
            onClick={() => {
              ensuredRef.current = false;
              setRetryKey((k) => k + 1);
            }}
            style={{ padding: '14px 22px', fontSize: 15 }}
          >
            Prøv igjen
          </PillButton>
        </div>
      </div>
    );
  }

  return children;
}
