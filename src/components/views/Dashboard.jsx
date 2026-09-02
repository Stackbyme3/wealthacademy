import { Card, Eyebrow, PillButton } from '../ui.jsx';
import { nok, sparklinePoints, sum } from '../../lib/format.js';

export default function Dashboard({ totals, months, onChangeView }) {
  const netSeries = months.map((m) => sum(m.assets) - sum(m.debts));

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {[
              ['50 % Behov', 0.5],
              ['30 % Ønsker', 0.3],
              ['20 % Sparing', 0.2],
            ].map(([label, share]) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <span className="s-body-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
                <span
                  className="s-numeric"
                  style={{ fontSize: 15, color: 'var(--text-primary)' }}
                >
                  {nok(totals.income * share)}
                </span>
              </div>
            ))}
            <div className="s-caption">Pekepinn ut fra sum inntekt</div>
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
