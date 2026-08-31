/** Rounded Norwegian kroner, e.g. 12 400 kr */
export const nok = (n) => Math.round(n || 0).toLocaleString('nb-NO') + ' kr';

/** Signed kroner for deltas, e.g. +12 400 kr */
export const signedNok = (n) => (n >= 0 ? '+' : '') + nok(n);

export const sum = (list = []) => list.reduce((a, b) => a + (b || 0), 0);

/** Share of income, clamped to 0–100 and rendered as a percent string. */
export const shareOfIncome = (part, income) =>
  income > 0 ? Math.max(0, Math.min(100, (part / income) * 100)).toFixed(0) + '%' : '0%';

/** Polyline points for a 200×40 sparkline. */
export function sparklinePoints(series) {
  if (!series.length) return '0,20 200,20';
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const lastIndex = Math.max(series.length - 1, 1);
  return series
    .map((v, i) => {
      const x = ((i / lastIndex) * 200).toFixed(1);
      const y = (38 - ((v - min) / range) * 36).toFixed(1);
      return x + ',' + y;
    })
    .join(' ');
}

export const toAmount = (value) => parseFloat(value) || 0;
