import { STORAGE_KEY } from './constants.js';

const EMPTY = { profileName: null, months: [], currentMonthId: null };

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function save({ profileName, months, currentMonthId }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profileName, months, currentMonthId }));
  } catch {
    /* private mode or quota — the session still works, it just won't persist */
  }
}
