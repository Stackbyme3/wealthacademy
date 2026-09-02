import { Card, HeroCard, TotalRow } from '../ui.jsx';
import LineItems from '../LineItems.jsx';
import { nok } from '../../lib/format.js';

export default function NetWorth({ totals, actions }) {
  const list = (listKey, addLabel) => (
    <LineItems
      listKey={listKey}
      addLabel={addLabel}
      labels={totals.labels[listKey]}
      values={totals.values[listKey]}
      amountWidth={150}
      onLabelChange={actions.setLabel}
      onAmountChange={actions.setAmount}
      onRemove={actions.removeRow}
      onAdd={actions.addRow}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <div className="s-label" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Eiendeler – det du eier
        </div>
        {list('assets', 'Legg til eiendel')}
        <TotalRow label="Sum eiendeler" value={nok(totals.assets)} />
      </Card>

      <Card>
        <div className="s-label" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Gjeld – det du skylder
        </div>
        {list('debts', 'Legg til gjeld')}
        <TotalRow label="Sum gjeld" value={nok(totals.debts)} />
      </Card>

      <HeroCard>
        <div className="s-eyebrow" style={{ opacity: 0.7 }}>Netto formue</div>
        <div className="s-display-md" style={{ color: '#fff' }}>{nok(totals.netWorth)}</div>
        <div
          className="s-body-sm"
          style={{ color: 'var(--text-inverse-dim)', marginTop: 6 }}
        >
          Negativt er helt normalt med studielån. Det viktige er at tallet stiger.
        </div>
      </HeroCard>
    </div>
  );
}
