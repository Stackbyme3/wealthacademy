/** Auth0 session errors that need a fresh login (stale cache, missing refresh token). */
export function isAuthSessionError(err) {
  const msg = (err?.message ?? String(err)).toLowerCase();
  return (
    msg.includes('missing refresh token') ||
    msg.includes('login required') ||
    msg.includes('consent required') ||
    msg.includes('invalid_grant')
  );
}

export function authTokenOptions(audience) {
  return audience ? { authorizationParams: { audience } } : {};
}

/**
 * Access token for Stack API calls. Without refresh tokens, Auth0 uses silent iframe auth.
 */
export async function getStackAccessToken(getAccessTokenSilently, audience) {
  const tokenPromise = getAccessTokenSilently(authTokenOptions(audience));
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Kunne ikke hente access token i tide')), 15_000);
  });
  return Promise.race([tokenPromise, timeoutPromise]);
}

export function friendlyAuthError(err) {
  if (isAuthSessionError(err)) {
    return 'Innloggingen er utløpt eller ugyldig. Logg ut og logg inn på nytt.';
  }
  return err?.message ?? 'Kunne ikke koble til Stack-konto';
}
