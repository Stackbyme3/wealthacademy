import { PillButton } from './ui.jsx';

const labelInput = {
  flex: 1,
  minWidth: 0,
  padding: '8px 10px',
  borderRadius: 'var(--radius-input)',
  border: '1px solid transparent',
  background: 'transparent',
  fontSize: 15,
  color: 'var(--text-primary)',
};

const amountInput = (width) => ({
  width,
  textAlign: 'right',
  padding: '8px 10px',
  borderRadius: 'var(--radius-input)',
  border: '1px solid var(--border-default)',
  fontSize: 14,
});

/**
 * An editable list of budget rows: the row name and its amount are both
 * editable while the month is a draft, and rows can be added or removed.
 */
export default function LineItems({
  listKey,
  labels,
  values,
  locked,
  amountWidth = 130,
  addLabel,
  onLabelChange,
  onAmountChange,
  onRemove,
  onAdd,
}) {
  return (
    <>
      {labels.map((label, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: '1px solid var(--border-subtle)',
            gap: 8,
          }}
        >
          <input
            value={label}
            placeholder="Navn på post"
            disabled={locked}
            onChange={(e) => onLabelChange(listKey, i, e.target.value)}
            style={labelInput}
            onFocus={(e) => {
              e.target.style.border = '1px solid var(--border-default)';
              e.target.style.background = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid transparent';
              e.target.style.background = 'transparent';
            }}
          />
          <input
            type="number"
            value={values[i] || 0}
            disabled={locked}
            onChange={(e) => onAmountChange(listKey, i, e.target.value)}
            style={amountInput(amountWidth)}
          />
          <button
            title="Fjern post"
            disabled={locked}
            onClick={() => onRemove(listKey, i)}
            style={{
              width: 28,
              height: 28,
              flex: 'none',
              borderRadius: 999,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-tertiary)',
              fontSize: 15,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      ))}

      <PillButton
        variant="dashed"
        disabled={locked}
        onClick={() => onAdd(listKey)}
        style={{ marginTop: 10, padding: '8px 14px' }}
      >
        + {addLabel}
      </PillButton>
    </>
  );
}
