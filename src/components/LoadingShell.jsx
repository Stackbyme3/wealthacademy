export default function LoadingShell({ message = 'Laster…', onLogout }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        color: '#fff',
        padding: 32,
      }}
    >
      <div className="s-body">{message}</div>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 999,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            padding: '10px 18px',
          }}
        >
          Logg ut
        </button>
      )}
    </div>
  );
}
