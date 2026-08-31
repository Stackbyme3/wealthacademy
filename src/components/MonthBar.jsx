import { PillButton } from './ui.jsx';

export default function MonthBar({ month, isEditable, onStart, onLock }) {
  const title = month ? `${month.label} ${month.year}` : 'Ingen måned startet';
  const status = isEditable ? 'Under arbeid' : month ? 'Låst' : 'Start din første måned';

  return (
    <div
      style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="s-label" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <span
          style={{
            fontWeight: 600,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 10px',
            borderRadius: 999,
            background: isEditable ? 'var(--lemon-100)' : 'var(--sand-10)',
            color: isEditable ? 'var(--plum-140)' : 'var(--sand-100)',
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!isEditable && <PillButton onClick={onStart}>Start ny måned</PillButton>}
        {isEditable && (
          <PillButton variant="solid" onClick={onLock}>Lås måneden</PillButton>
        )}
      </div>
    </div>
  );
}
