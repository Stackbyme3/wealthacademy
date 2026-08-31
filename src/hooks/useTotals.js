import { useMemo } from 'react';
import { sum, shareOfIncome } from '../lib/format.js';
import { labelsFor, blankValues } from '../lib/months.js';
import { LIST_KEYS } from '../lib/constants.js';

/** Derived figures for the month on screen. Pure — no state, no side effects. */
export function useTotals(month) {
  return useMemo(() => {
    const labels = {};
    const values = {};
    for (const key of LIST_KEYS) {
      labels[key] = labelsFor(month, key);
      values[key] = month ? month[key] : blankValues(key);
    }

    const extraDebt = month ? month.extraDebt : 0;
    const income = sum(values.income);
    const costs = sum(values.costs);
    const buffer = sum(values.buffer);
    const assets = sum(values.assets);
    const debts = sum(values.debts);

    const investable = income - (costs + buffer + extraDebt);

    return {
      labels,
      values,
      extraDebt,
      income,
      costs,
      buffer,
      assets,
      debts,
      investable,
      netWorth: assets - debts,
      savings: Math.max(investable, 0),
      needsPct: shareOfIncome(costs, income),
      wantsPct: shareOfIncome(buffer, income),
      savingsPct: shareOfIncome(Math.max(investable, 0), income),
    };
  }, [month]);
}
