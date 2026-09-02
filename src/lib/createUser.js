import { getApiHost } from './api.js';

const CREATE_USER_TIMEOUT_MS = 30_000;
const DEFAULT_APP_COUNTRY = 'NO';

/** Skip firstName when Auth0/autofill sent the email as the given name (Stack app parity). */
export function validatedFirstName(firstName, email) {
  const trimmed = firstName?.trim();
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase() === email.trim().toLowerCase()) return undefined;
  return trimmed;
}

/**
 * Creates or links a Stack user via gateway POST /createuser (same contract as stack_app native auth).
 * @returns {'created' | 'exists' | 'updated'} status from gateway
 */
export async function createUserViaPost({
  accessToken,
  email,
  avatar,
  firstName,
  lastName,
  auth0UserId,
  appCountry = DEFAULT_APP_COUNTRY,
}) {
  const apiHost = getApiHost();
  if (!apiHost) {
    throw new Error('VITE_API_HOST is not configured');
  }

  const safeFirst = validatedFirstName(firstName, email);
  const body = {
    email: email.trim(),
    auth0UserId,
    appCountry: (appCountry?.trim() || DEFAULT_APP_COUNTRY).toUpperCase(),
  };
  if (avatar) body.avatar = avatar;
  if (safeFirst) body.firstName = safeFirst;
  if (lastName?.trim()) body.lastName = lastName.trim();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CREATE_USER_TIMEOUT_MS);

  try {
    const response = await fetch(`${apiHost}/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (response.status !== 200 && response.status !== 201) {
      let message = `Failed to create user: ${response.status}`;
      try {
        const err = await response.json();
        if (err?.error) message = err.error;
      } catch {
        /* ignore parse errors */
      }
      throw new Error(message);
    }

    const data = await response.json().catch(() => ({}));
    return data.status ?? 'exists';
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`createUser timed out after ${CREATE_USER_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
