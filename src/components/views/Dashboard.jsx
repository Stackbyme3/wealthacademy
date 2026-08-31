import { Card, Bar, Eyebrow, PillButton } from '../ui.jsx';
import { nok, sparklinePoints, sum } from '../../lib/format.js';

export default function Dashboard({ totals, lockedMonths, onChangeView }) {
  const netSeries = lockedMonths.map((m) => sum(m.assets) - sum(m.debts));

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: 16,
        }}
      >
        <Card>
          <Eyebrow>Tilgjengelig til investering</Eyebrow>
          <div className="s-numeric" style={{ fontSize: 34, color: 'var(--text-primary)' }}>
            {nok(totals.investable)}
          </div>
          <div className="s-body-sm" style={{ color: 'var(--text-tertiary)' }}>denne måneden</div>
        </Card>

        <Card>
          <Eyebrow>Netto formue</Eyebrow>
          <div className="s-numeric" style={{ fontSize: 34, color: 'var(--text-primary)' }}>
            {nok(totals.netWorth)}
          </div>
          <svg
            width="100%"
            height="40"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
            style={{ marginTop: 8 }}
          >
            <polyline
              points={sparklinePoints(netSeries)}
              fill="none"
              stroke="var(--ocean-100)"
              strokeWidth="2.5"
            />
          </svg>
        </Card>

        <Card>
          <Eyebrow>50/30/20</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {[
              ['Behov', totals.needsPct, 'var(--plum-100)'],
              ['Ønsker', totals.wantsPct, 'var(--pink-100)'],
              ['Sparing', totals.savingsPct, 'var(--green-100)'],
            ].map(([label, pct, color]) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="s-body-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
                  <span className="s-body-sm" style={{ color: 'var(--text-tertiary)' }}>{pct}</span>
                </div>
                <Bar pct={pct} color={color} height={8} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <PillButton onClick={() => onChangeView('budget')} style={{ padding: '12px 20px' }}>
          Åpne budsjett
        </PillButton>
        <PillButton onClick={() => onChangeView('rule')} style={{ padding: '12px 20px' }}>
          Se 50/30/20
        </PillButton>
        <PillButton onClick={() => onChangeView('networth')} style={{ padding: '12px 20px' }}>
          Oppdater formue
        </PillButton>
      </div>
    </>
  );
}
