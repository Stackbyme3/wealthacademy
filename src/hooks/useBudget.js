import { useCallback, useEffect, useMemo, useState } from 'react';
import { load, save } from '../lib/storage.js';
import { createMonth, ensureLabels, sortByDate } from '../lib/months.js';
import { toAmount } from '../lib/format.js';

/**
 * The whole app state: a profile name and a list of months, of which at most
 * one is an editable draft. Everything persists to localStorage on change.
 */
export function useBudget() {
  const [data, setData] = useState({ profileName: null, months: [], currentMonthId: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(load());
    setLoaded(true);
  }, []);

  const commit = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      save(next);
      return next;
    });
  }, []);

  const current = useMemo(
    () => data.months.find((m) => m.id === data.currentMonthId) || null,
    [data.months, data.currentMonthId],
  );

  const lockedMonths = useMemo(
    () => sortByDate(data.months.filter((m) => m.status === 'locked')),
    [data.months],
  );

  /** The month shown on screen: the open draft, else the most recent locked one. */
  const displayed = current || lockedMonths[lockedMonths.length - 1] || null;

  /** Applies a change to the draft month only — locked months are immutable. */
  const editDraft = useCallback(
    (mutate) => {
      commit((prev) => ({
        ...prev,
        months: prev.months.map((m) => (m.id === prev.currentMonthId ? mutate(m) : m)),
      }));
    },
    [commit],
  );

  const setProfileName = useCallback((name) => commit({ profileName: name.trim() }), [commit]);

  const startMonth = useCallback(() => {
    commit((prev) => {
      const locked = sortByDate(prev.months.filter((m) => m.status === 'locked'));
      const month = createMonth(locked[locked.length - 1]);
      return { ...prev, months: [...prev.months, month], currentMonthId: month.id };
    });
  }, [commit]);

  const lockMonth = useCallback(() => {
    commit((prev) => ({
      ...prev,
      months: prev.months.map((m) =>
        m.id === prev.currentMonthId ? { ...m, status: 'locked' } : m,
      ),
      currentMonthId: null,
    }));
  }, [commit]);

  const setAmount = useCallback(
    (listKey, index, value) =>
      editDraft((m) => {
        const list = m[listKey].slice();
        list[index] = toAmount(value);
        return { ...m, [listKey]: list };
      }),
    [editDraft],
  );

  const setLabel = useCallback(
    (listKey, index, value) =>
      editDraft((m) => {
        const labels = ensureLabels(m);
        labels[listKey] = labels[listKey].slice();
        labels[listKey][index] = value;
        return { ...m, labels };
      }),
    [editDraft],
  );

  const addRow = useCallback(
    (listKey) =>
      editDraft((m) => {
        const labels = ensureLabels(m);
        labels[listKey] = [...labels[listKey], ''];
        return { ...m, labels, [listKey]: [...(m[listKey] || []), 0] };
      }),
    [editDraft],
  );

  const removeRow = useCallback(
    (listKey, index) =>
      editDraft((m) => {
        const labels = ensureLabels(m);
        labels[listKey] = labels[listKey].filter((_, i) => i !== index);
        return { ...m, labels, [listKey]: (m[listKey] || []).filter((_, i) => i !== index) };
      }),
    [editDraft],
  );

  const setExtraDebt = useCallback(
    (value) => editDraft((m) => ({ ...m, extraDebt: toAmount(value) })),
    [editDraft],
  );

  return {
    loaded,
    profileName: data.profileName,
    current,
    displayed,
    lockedMonths,
    isEditable: !!current,
    setProfileName,
    startMonth,
    lockMonth,
    setAmount,
    setLabel,
    addRow,
    removeRow,
    setExtraDebt,
  };
}
