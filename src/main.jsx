import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import App from './App.jsx';
import StackUserBootstrap from './auth/StackUserBootstrap.jsx';
import { auth0Config } from './auth/config.js';
import { configureRemotePersistence } from './lib/storage.js';
import { getStackAccessToken } from './lib/authToken.js';

import './styles/tokens/colors.css';
import './styles/tokens/typography.css';
import './styles/tokens/spacing.css';
import './styles/tokens/radii.css';
import './styles/tokens/shadows.css';
import './styles/styles.css';
import './styles/global.css';

const { domain, clientId, audience, configured } = auth0Config();

function RemotePersistenceSetup({ children }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      configureRemotePersistence({});
      return;
    }

    configureRemotePersistence({
      getAccessToken: () => getStackAccessToken(getAccessTokenSilently, audience),
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  return children;
}

function Root() {
  if (!configured) {
    return <App authBypass />;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        ...(audience ? { audience } : {}),
        scope: 'openid profile email',
      }}
    >
      <StackUserBootstrap>
        <RemotePersistenceSetup>
          <App />
        </RemotePersistenceSetup>
      </StackUserBootstrap>
    </Auth0Provider>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
