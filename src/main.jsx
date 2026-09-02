import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx';
import { auth0Config } from './auth/config.js';

import './styles/tokens/colors.css';
import './styles/tokens/typography.css';
import './styles/tokens/spacing.css';
import './styles/tokens/radii.css';
import './styles/tokens/shadows.css';
import './styles/styles.css';
import './styles/global.css';

const { domain, clientId, audience, configured } = auth0Config();

function Root() {
  if (!configured) {
    return <App authBypass />;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      useRefreshTokens
      authorizationParams={{
        redirect_uri: window.location.origin,
        ...(audience ? { audience } : {}),
        scope: 'openid profile email',
      }}
    >
      <App />
    </Auth0Provider>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
