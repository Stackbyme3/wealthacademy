import { MONTHS, DEFAULT_LABELS, LIST_KEYS } from './constants.js';

/** Fills in any list of labels a stored month is missing (older saves, new lists). */
export function ensureLabels(month = {}) {
  const labels = { ...(month.labels || {}) };
  for (const key of LIST_KEYS) {
    if (!Array.isArray(labels[key])) labels[key] = DEFAULT_LABELS[key].slice();
  }
  return labels;
}

export function labelsFor(month, key) {
  const labels = month?.labels?.[key];
  return Array.isArray(labels) ? labels : DEFAULT_LABELS[key];
}

const zeros = (labels) => labels.map(() => 0);

/** The month that follows the given one; today's month when there is no history. */
export function nextMonth(lastLabel, lastYear) {
  if (lastLabel == null) {
    const now = new Date();
    return { label: MONTHS[now.getMonth()], year: now.getFullYear() };
  }
  const index = MONTHS.indexOf(lastLabel);
  return index === 11
    ? { label: MONTHS[0], year: lastYear + 1 }
    : { label: MONTHS[index + 1], year: lastYear };
}

/**
 * A fresh draft month. Budget figures start at zero; assets, debts and the
 * user's own label edits carry over from the last locked month.
 */
export function createMonth(previous) {
  const { label, year } = nextMonth(previous?.label ?? null, previous?.year ?? null);
  const labels = ensureLabels(previous || {});
  return {
    id: `${label}-${year}-${Date.now()}`,
    label,
    year,
    status: 'draft',
    labels,
    income: zeros(labels.income),
    costs: zeros(labels.costs),
    buffer: zeros(labels.buffer),
    extraDebt: 0,
    assets: previous ? previous.assets.slice() : zeros(labels.assets),
    debts: previous ? previous.debts.slice() : zeros(labels.debts),
  };
}

export function blankValues(key) {
  return zeros(DEFAULT_LABELS[key]);
}

/** Locked months in calendar order. */
export function sortByDate(months) {
  return months
    .slice()
    .sort((a, b) => a.year - b.year || MONTHS.indexOf(a.label) - MONTHS.indexOf(b.label));
}
