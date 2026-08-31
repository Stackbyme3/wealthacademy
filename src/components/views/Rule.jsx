import { Card } from '../ui.jsx';
import { nok } from '../../lib/format.js';

/** A guideline only — each share is applied to total income, nothing is compared. */
const ROWS = [
  {
    name: 'Behov',
    share: 0.5,
    color: 'var(--plum-100)',
    hint: 'Husleie, mat, strøm, lån, transport – det du må betale.',
  },
  {
    name: 'Ønsker',
    share: 0.3,
    color: 'var(--pink-100)',
    hint: 'Reiser, restaurant, shopping, abonnement – det som gjør livet gøy.',
  },
  {
    name: 'Sparing',
    share: 0.2,
    color: 'var(--green-100)',
    hint: 'Buffer, investering, nedbetaling av dyr gjeld – penger til deg selv.',
  },
];

export default function Rule({ totals }) {
  return (
    <Card>
      <div className="s-label" style={{ color: 'var(--text-primary)' }}>50/30/20-regelen</div>
      <div className="s-body" style={{ color: 'var(--text-tertiary)', marginTop: 4 }}>
        En pekepinn på hvordan inntekten din kan fordeles. Med sum inntekt {nok(totals.income)} blir
        det slik.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 16,
          marginTop: 24,
        }}
      >
        {ROWS.map(({ name, share, color, hint }) => (
          <div
            key={name}
            style={{ background: 'var(--sand-5)', borderRadius: 'var(--radius-card)', padding: 20 }}
          >
            <div className="s-eyebrow" style={{ color }}>
              {share * 100} % · {name}
            </div>
            <div
              className="s-numeric"
              style={{ fontSize: 26, color: 'var(--text-primary)', marginTop: 4 }}
            >
              {nok(totals.income * share)}
            </div>
            <div className="s-body-sm" style={{ color: 'var(--text-tertiary)', marginTop: 8 }}>
              {hint}
            </div>
          </div>
        ))}
      </div>

      <div className="s-caption" style={{ marginTop: 16 }}>
        Dette er en tommelfingerregel, ikke en fasit. Bor du dyrt, blir behov ofte større – det
        viktige er at sparingen ikke blir null.
      </div>
    </Card>
  );
}
