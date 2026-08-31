import { Fragment } from 'react';
import { Card } from '../ui.jsx';
import { nok, signedNok, sum } from '../../lib/format.js';

const COLUMNS = ['Måned', 'Eiendeler', 'Gjeld', 'Netto formue', 'Endring'];

const cell = {
  padding: '8px 0',
  borderTop: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
};

/** Locked months with their net worth and the change from the month before. */
function buildRows(lockedMonths) {
  return lockedMonths.map((month, i) => {
    const assets = sum(month.assets);
    const debts = sum(month.debts);
    const net = assets - debts;
    const previous = i > 0
      ? sum(lockedMonths[i - 1].assets) - sum(lockedMonths[i - 1].debts)
      : null;
    const delta = previous === null ? null : net - previous;

    return {
      id: month.id,
      label: `${month.label} ${month.year}`,
      assets: nok(assets),
      debts: nok(debts),
      net: nok(net),
      change: delta === null ? '–' : signedNok(delta),
      changeColor:
        delta === null
          ? 'var(--text-tertiary)'
          : delta >= 0
            ? 'var(--green-100)'
            : 'var(--red-100)',
    };
  });
}

export default function History({ lockedMonths }) {
  const rows = buildRows(lockedMonths);

  return (
    <Card style={{ overflowX: 'auto' }}>
      <div className="s-label" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
        Måned for måned
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr',
          gap: 8,
          minWidth: 560,
        }}
      >
        {COLUMNS.map((c) => (
          <div key={c} className="s-eyebrow" style={{ color: 'var(--text-tertiary)' }}>{c}</div>
        ))}

        {rows.map((row) => (
          <Fragment key={row.id}>
            <div className="s-body" style={cell}>{row.label}</div>
            <div className="s-body" style={cell}>{row.assets}</div>
            <div className="s-body" style={cell}>{row.debts}</div>
            <div className="s-body" style={cell}>{row.net}</div>
            <div className="s-body" style={{ ...cell, color: row.changeColor }}>{row.change}</div>
          </Fragment>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="s-body" style={{ color: 'var(--text-tertiary)', marginTop: 16 }}>
          Ingen låste måneder ennå. Lås en måned for å se den her.
        </div>
      )}
    </Card>
  );
}
