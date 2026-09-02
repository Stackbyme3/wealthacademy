const API_HOST = (import.meta.env.VITE_API_HOST ?? '').replace(/\/$/, '');

export function isApiConfigured() {
  return Boolean(API_HOST);
}

export async function sendAcademyEvent(accessToken, event) {
  if (!API_HOST) {
    throw new Error('VITE_API_HOST is not configured');
  }

  const response = await fetch(`${API_HOST}/api/sendEventToServiceJWT`, {
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
