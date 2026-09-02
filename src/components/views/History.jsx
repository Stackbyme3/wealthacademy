import { Fragment } from 'react';
import { Card } from '../ui.jsx';
import { nok, signedNok, sum } from '../../lib/format.js';

const COLUMNS = ['Måned', 'Eiendeler', 'Gjeld', 'Netto formue', 'Endring'];

const cell = {
  padding: '10px 0',
  borderTop: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
};

/** Each month's net worth and the change from the month before it. */
function buildRows(months) {
  return months.map((month, i) => {
    const assets = sum(month.assets);
    const debts = sum(month.debts);
    const net = assets - debts;
    const previous =
      i > 0 ? sum(months[i - 1].assets) - sum(months[i - 1].debts) : null;
    const delta = previous === null ? null : net - previous;

    return {
      id: month.id,
      label: `${month.label} ${month.year}`,
      finished: month.status === 'locked',
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

export default function History({ months, selectedId, onSelect }) {
  const rows = buildRows(months);

  return (
    <Card style={{ overflowX: 'auto' }}>
      <div className="s-label" style={{ color: 'var(--text-primary)' }}>Måned for måned</div>
      <div className="s-body-sm" style={{ color: 'var(--text-tertiary)', marginBottom: 12 }}>
        Klikk en måned for å åpne og redigere den.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
          gap: 8,
          minWidth: 560,
        }}
      >
        {COLUMNS.map((c) => (
          <div key={c} className="s-eyebrow" style={{ color: 'var(--text-tertiary)' }}>{c}</div>
        ))}

        {rows.map((row) => {
          const selected = row.id === selectedId;
          const rowStyle = {
            ...cell,
            background: selected ? 'var(--sand-5)' : 'transparent',
            cursor: 'pointer',
          };
          return (
            <Fragment key={row.id}>
              <div style={rowStyle} onClick={() => onSelect(row.id)}>
                <span className="s-body">{row.label}</span>
                {!row.finished && (
                  <span
                    className="s-caption"
                    style={{ color: 'var(--plum-100)', marginLeft: 8 }}
                  >
                    under arbeid
                  </span>
                )}
              </div>
              <div className="s-body" style={rowStyle} onClick={() => onSelect(row.id)}>
                {row.assets}
              </div>
              <div className="s-body" style={rowStyle} onClick={() => onSelect(row.id)}>
                {row.debts}
              </div>
              <div className="s-body" style={rowStyle} onClick={() => onSelect(row.id)}>
                {row.net}
              </div>
              <div
                className="s-body"
                style={{ ...rowStyle, color: row.changeColor }}
                onClick={() => onSelect(row.id)}
              >
                {row.change}
              </div>
            </Fragment>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="s-body" style={{ color: 'var(--text-tertiary)', marginTop: 16 }}>
          Ingen måneder ennå. Start en måned for å se den her.
        </div>
      )}
    </Card>
  );
}
