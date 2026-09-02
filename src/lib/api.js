const API_HOST = (import.meta.env.VITE_API_HOST ?? '').replace(/\/$/, '');
const API_TIMEOUT_MS = 20_000;

export function getApiHost() {
  return API_HOST;
}

export function isApiConfigured() {
  return Boolean(API_HOST);
}

async function fetchWithTimeout(url, options, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`API forespørsel tidsavbrutt etter ${timeoutMs / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendAcademyEvent(accessToken, event) {
  if (!API_HOST) {
    throw new Error('VITE_API_HOST is not configured');
  }

  const response = await fetchWithTimeout(`${API_HOST}/api/sendEventToServiceJWT`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      event: {
        to: 'AcademyService',
        ...event,
      },
    }),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = json?.error ?? json?.data?.error ?? `API error ${response.status}`;
    throw new Error(message);
  }

  if (json?.data?.error) {
    throw new Error(json.data.error);
  }

  return json;
}

export async function fetchBudget(accessToken) {
  const json = await sendAcademyEvent(accessToken, {
    type: 'GetWealthAcademyBudgetEvent',
  });
  return normalizeBudgetPayload(json?.data);
}

export async function persistBudget(accessToken, budget) {
  await sendAcademyEvent(accessToken, {
    type: 'SaveWealthAcademyBudgetEvent',
    profileName: budget.profileName,
    months: budget.months,
    currentMonthId: budget.currentMonthId,
  });
}

function normalizeBudgetPayload(data) {
  if (!data || typeof data !== 'object' || data.error) {
    return { profileName: null, months: [], currentMonthId: null };
  }
  return {
    profileName: data.profileName ?? null,
    months: Array.isArray(data.months) ? data.months : [],
    currentMonthId: data.currentMonthId ?? null,
  };
}
