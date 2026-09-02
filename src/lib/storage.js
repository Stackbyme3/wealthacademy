import { STORAGE_KEY } from './constants.js';
import { fetchBudget, isApiConfigured, persistBudget } from './api.js';

const EMPTY = { profileName: null, months: [], currentMonthId: null };

let getAccessToken = null;

export function configureRemotePersistence({ getAccessToken: getter } = {}) {
  getAccessToken = typeof getter === 'function' ? getter : null;
}

export function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function saveLocal(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profileName: data.profileName,
        months: data.months,
        currentMonthId: data.currentMonthId,
      }),
    );
  } catch {
    /* private mode or quota */
  }
}

function hasLocalData(data) {
  return Boolean(
    data.profileName ||
      data.currentMonthId ||
      (Array.isArray(data.months) && data.months.length > 0),
  );
}

function isRemoteEmpty(data) {
  return !hasLocalData(data);
}

/** Load budget — remote when API + token available, else localStorage. */
export async function load() {
  if (isApiConfigured() && getAccessToken) {
    try {
      const token = await getAccessToken();
      const remote = await fetchBudget(token);
      const local = loadLocal();

      if (isRemoteEmpty(remote) && hasLocalData(local)) {
        await persistBudget(token, local);
        clearLocal();
        return local;
      }

      return remote;
    } catch (err) {
      console.warn('Remote budget load failed, using localStorage', err);
      return loadLocal();
    }
  }

  return loadLocal();
}

/** Save budget — remote when configured, always mirror to localStorage as offline cache. */
export async function save(data) {
  saveLocal(data);

  if (isApiConfigured() && getAccessToken) {
    try {
      const token = await getAccessToken();
      await persistBudget(token, data);
    } catch (err) {
      console.warn('Remote budget save failed', err);
      throw err;
    }
  }
}
