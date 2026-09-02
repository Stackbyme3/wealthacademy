import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../lib/storage.js';
import { createMonth, ensureLabels, sortByDate } from '../lib/months.js';
import { toAmount } from '../lib/format.js';

const SAVE_DEBOUNCE_MS = 800;

/**
 * App state: profile name + months (at most one editable draft).
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

  const current = useMemo(
    () => data.months.find((m) => m.id === data.currentMonthId) || null,
    [data.months, data.currentMonthId],
  );

  const lockedMonths = useMemo(
    () => sortByDate(data.months.filter((m) => m.status === 'locked')),
    [data.months],
  );

  const displayed = current || lockedMonths[lockedMonths.length - 1] || null;

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
    syncError,
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
