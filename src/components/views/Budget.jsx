import { Card, HeroCard, TotalRow, PillButton } from '../ui.jsx';
import LineItems from '../LineItems.jsx';
import { nok } from '../../lib/format.js';

export default function Budget({ totals, isFinished, actions, onReopen }) {
  const list = (listKey, addLabel) => (
    <LineItems
      listKey={listKey}
      addLabel={addLabel}
      labels={totals.labels[listKey]}
      values={totals.values[listKey]}
      onLabelChange={actions.setLabel}
      onAmountChange={actions.setAmount}
      onRemove={actions.removeRow}
      onAdd={actions.addRow}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {isFinished && (
        <div
          style={{
            background: 'var(--sand-10)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div className="s-body-sm" style={{ color: 'var(--text-primary)' }}>
            Denne måneden er markert som ferdig. Du kan fortsatt endre tall og navn – alt lagres.
          </div>
          <PillButton onClick={onReopen}>Åpne igjen</PillButton>
        </div>
      )}

      <Card>
        <div className="s-label" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Inntekter (per måned)
        </div>
        {list('income', 'Legg til inntekt')}
        <TotalRow label="Sum inntekt" value={nok(totals.income)} />
      </Card>

      <Card>
        <div className="s-label" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Månedlige faste kostnader
        </div>
        {list('costs', 'Legg til fast kostnad')}
        <TotalRow label="Sum faste kostnader" value={nok(totals.costs)} />
      </Card>

      <Card>
        <div className="s-label" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Bufferkonto/ad-hoc kostnader
        </div>
        {list('buffer', 'Legg til post')}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '9px 0',
            marginTop: 10,
            borderBottom: '1px solid var(--border-subtle)',
            gap: 12,
          }}
        >
          <div className="s-body" style={{ color: 'var(--text-primary)' }}>
            − ekstra nedbetaling dyr gjeld
          </div>
          <input
            type="number"
            value={totals.extraDebt}
            onChange={(e) => actions.setExtraDebt(e.target.value)}
            style={{
              width: 130,
              textAlign: 'right',
              padding: '8px 10px',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--border-default)',
              fontSize: 14,
            }}
          />
        </div>
        <TotalRow label="Sum bufferkonto" value={nok(totals.buffer)} />
      </Card>

      <HeroCard
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div className="s-eyebrow" style={{ opacity: 0.7 }}>
            Til overs → tilgjengelig for investering
          </div>
          <div className="s-display-md" style={{ color: '#fff' }}>{nok(totals.investable)}</div>
        </div>
      </HeroCard>
    </div>
  );
}
