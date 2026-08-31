import { Card, Bar } from '../ui.jsx';
import { nok } from '../../lib/format.js';

const ROWS = [
  { key: 'needs', name: 'Behov – det du må ha', color: 'var(--plum-100)', target: '50%' },
  { key: 'wants', name: 'Ønsker – det som er gøy', color: 'var(--pink-100)', target: '30%' },
  { key: 'savings', name: 'Sparing', color: 'var(--green-100)', target: '20%' },
];

export default function Rule({ totals }) {
  const amounts = { needs: totals.costs, wants: totals.buffer, savings: totals.savings };
  const percents = { needs: totals.needsPct, wants: totals.wantsPct, savings: totals.savingsPct };

  return (
    <Card>
      <div className="s-label" style={{ color: 'var(--text-primary)' }}>50/30/20-regelen</div>
      <div className="s-body" style={{ color: 'var(--text-tertiary)', marginTop: 4 }}>
        «Du planla» hentes fra budsjettet ditt. Tommelfingerregelen er 50/30/20 — bare et pekepinn.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
        {ROWS.map(({ key, name, color, target }) => (
          <div key={key}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
              }}
            >
              <span className="s-body" style={{ color: 'var(--text-primary)' }}>{name}</span>
              <span
                className="s-numeric"
                style={{ fontSize: 16, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
              >
                {nok(amounts[key])} ({percents[key]})
              </span>
            </div>
            <Bar pct={percents[key]} color={color} />
            <div className="s-caption">Tommelfingerregel: {target}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
