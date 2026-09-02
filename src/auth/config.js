export function auth0Config() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN?.trim() ?? '';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim() ?? '';
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim() ?? '';
  return {
    domain,
    clientId,
    audience,
    configured: Boolean(domain && clientId),
  };
}
