import { PillButton } from './ui.jsx';

const arrow = (enabled) => ({
  width: 32,
  height: 32,
  flex: 'none',
  borderRadius: 999,
  border: '1px solid var(--border-default)',
  background: '#fff',
  color: 'var(--plum-100)',
  fontSize: 15,
  lineHeight: 1,
  cursor: enabled ? 'pointer' : 'default',
  opacity: enabled ? 1 : 0.35,
});

/**
 * Month navigator: step or jump between months, and mark the selected one
 * finished or reopen it. Every month stays editable regardless of status.
 */
export default function MonthBar({
  month,
  months = [],
  isFinished,
  hasPrevious,
  hasNext,
  onSelect,
  onStep,
  onStart,
  onLock,
  onUnlock,
}) {
  if (!month) {
    return (
      <div style={bar}>
        <span className="s-label" style={{ color: 'var(--text-primary)' }}>
          Ingen måned startet
        </span>
        <PillButton variant="solid" onClick={onStart}>Start din første måned</PillButton>
      </div>
    );
  }

  return (
    <div style={bar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button
          title="Forrige måned"
          disabled={!hasPrevious}
          onClick={() => onStep(-1)}
          style={arrow(hasPrevious)}
        >
          ‹
        </button>

        <select
          value={month.id}
          onChange={(e) => onSelect(e.target.value)}
          className="s-label"
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--border-default)',
            background: '#fff',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          {months.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} {m.year}
              {m.status === 'locked' ? ' — ferdig' : ''}
            </option>
          ))}
        </select>

        <button
          title="Neste måned"
          disabled={!hasNext}
          onClick={() => onStep(1)}
          style={arrow(hasNext)}
        >
          ›
        </button>

        <span
          style={{
            fontWeight: 600,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 10px',
            borderRadius: 999,
            background: isFinished ? 'var(--sand-10)' : 'var(--lemon-100)',
            color: isFinished ? 'var(--sand-100)' : 'var(--plum-140)',
          }}
        >
          {isFinished ? 'Ferdig' : 'Under arbeid'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {isFinished ? (
          <PillButton onClick={onUnlock}>Åpne igjen</PillButton>
        ) : (
          <PillButton onClick={onLock}>Marker som ferdig</PillButton>
        )}
        <PillButton variant="solid" onClick={onStart}>Ny måned</PillButton>
      </div>
    </div>
  );
}

const bar = {
  padding: '16px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'var(--bg-surface)',
  borderBottom: '1px solid var(--border-subtle)',
  flexWrap: 'wrap',
  gap: 10,
};
