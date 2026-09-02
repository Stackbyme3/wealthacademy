import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../lib/storage.js';
import { createMonth, ensureLabels, sortByDate } from '../lib/months.js';
import { toAmount } from '../lib/format.js';

const SAVE_DEBOUNCE_MS = 800;

/**
 * App state: profile name + months. Any month can be selected and edited —
 * "locked" only marks a month as finished, it never blocks editing.
 * Persists to Mongo when API is configured, else localStorage.
 */
export function useBudget() {
  const [data, setData] = useState({ profileName: null, months: [], currentMonthId: null });
  const [loaded, setLoaded] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const saveTimer = useRef(null);
  const pendingSave = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { budget, syncError: loadSyncError } = await load();
        if (!cancelled) {
          setData(budget);
          setSyncError(loadSyncError);
        }
      } catch (err) {
        if (!cancelled) {
          setSyncError(err instanceof Error ? err.message : 'Kunne ikke laste data');
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const flushSave = useCallback(async (next) => {
    try {
      await save(next);
      setSyncError(null);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Kunne ikke lagre data');
    }
  }, []);

  const scheduleSave = useCallback(
    (next) => {
      pendingSave.current = next;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const payload = pendingSave.current;
        pendingSave.current = null;
        if (payload) flushSave(payload);
      }, SAVE_DEBOUNCE_MS);
    },
    [flushSave],
  );

  const commit = useCallback(
    (updater) => {
      setData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  /** Every month in calendar order — drafts and finished ones alike. */
  const months = useMemo(() => sortByDate(data.months), [data.months]);

  const lockedMonths = useMemo(() => months.filter((m) => m.status === 'locked'), [months]);

  /** The month on screen: the selected one, falling back to the most recent. */
  const displayed = useMemo(
    () => months.find((m) => m.id === data.currentMonthId) || months[months.length - 1] || null,
    [months, data.currentMonthId],
  );

  const selectedIndex = displayed ? months.findIndex((m) => m.id === displayed.id) : -1;

  /** Applies a change to the selected month, finished or not. */
  const editSelected = useCallback(
    (mutate) => {
      commit((prev) => {
        const ordered = sortByDate(prev.months);
        const target =
          ordered.find((m) => m.id === prev.currentMonthId) || ordered[ordered.length - 1];
        if (!target) return prev;
        return {
          ...prev,
          currentMonthId: target.id,
          months: prev.months.map((m) => (m.id === target.id ? mutate(m) : m)),
        };
      });
    },
    [commit],
  );

  const setProfileName = useCallback((name) => commit({ profileName: name.trim() }), [commit]);

  const selectMonth = useCallback((id) => commit({ currentMonthId: id }), [commit]);

  const stepMonth = useCallback(
    (delta) => {
      const target = months[selectedIndex + delta];
      if (target) selectMonth(target.id);
    },
    [months, selectedIndex, selectMonth],
  );

  const startMonth = useCallback(() => {
    commit((prev) => {
      const ordered = sortByDate(prev.months);
      const month = createMonth(ordered[ordered.length - 1]);
      return { ...prev, months: [...prev.months, month], currentMonthId: month.id };
    });
  }, [commit]);

  /** Marks the selected month finished (or reopens it) — editing stays available either way. */
  const setMonthStatus = useCallback(
    (status) => editSelected((m) => ({ ...m, status })),
    [editSelected],
  );

  const lockMonth = useCallback(() => setMonthStatus('locked'), [setMonthStatus]);
  const unlockMonth = useCallback(() => setMonthStatus('draft'), [setMonthStatus]);

  const setAmount = useCallback(
    (listKey, index, value) =>
      editSelected((m) => {
        const list = m[listKey].slice();
        list[index] = toAmount(value);
        return { ...m, [listKey]: list };
      }),
    [editSelected],
  );

  const setLabel = useCallback(
    (listKey, index, value) =>
      editSelected((m) => {
        const labels = ensureLabels(m);
        labels[listKey] = labels[listKey].slice();
        labels[listKey][index] = value;
        return { ...m, labels };
      }),
    [editSelected],
  );

  const addRow = useCallback(
    (listKey) =>
      editSelected((m) => {
        const labels = ensureLabels(m);
        labels[listKey] = [...labels[listKey], ''];
        return { ...m, labels, [listKey]: [...(m[listKey] || []), 0] };
      }),
    [editSelected],
  );

  const removeRow = useCallback(
    (listKey, index) =>
      editSelected((m) => {
        const labels = ensureLabels(m);
        labels[listKey] = labels[listKey].filter((_, i) => i !== index);
        return { ...m, labels, [listKey]: (m[listKey] || []).filter((_, i) => i !== index) };
      }),
    [editSelected],
  );

  const setExtraDebt = useCallback(
    (value) => editSelected((m) => ({ ...m, extraDebt: toAmount(value) })),
    [editSelected],
  );

  return {
    loaded,
    syncError,
    profileName: data.profileName,
    months,
    lockedMonths,
    displayed,
    isFinished: displayed?.status === 'locked',
    hasPrevious: selectedIndex > 0,
    hasNext: selectedIndex >= 0 && selectedIndex < months.length - 1,
    setProfileName,
    selectMonth,
    stepMonth,
    startMonth,
    lockMonth,
    unlockMonth,
    setAmount,
    setLabel,
    addRow,
    removeRow,
    setExtraDebt,
  };
}
