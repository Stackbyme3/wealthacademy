/** Small presentational primitives shared by the views. */

export const Card = ({ children, style }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      padding: 24,
      boxShadow: 'var(--shadow-md)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const HeroCard = ({ children, style }) => (
  <div
    style={{
      background: 'var(--gradient-hero)',
      borderRadius: 'var(--radius-hero)',
      padding: 32,
      color: '#fff',
      ...style,
    }}
  >
    {children}
  </div>
);

export function PillButton({ children, variant = 'outline', style, ...rest }) {
  const variants = {
    solid: { background: 'var(--plum-100)', color: '#fff', border: 'none' },
    outline: {
      background: '#fff',
      color: 'var(--plum-100)',
      border: '1px solid var(--border-default)',
    },
    ghost: {
      background: 'rgba(255,255,255,0.12)',
      color: '#fff',
      border: 'none',
    },
    light: { background: '#fff', color: 'var(--plum-100)', border: 'none' },
    lemon: { background: 'var(--lemon-100)', color: 'var(--plum-140)', border: 'none' },
    dashed: {
      background: 'transparent',
      color: 'var(--plum-100)',
      border: '1px dashed var(--border-default)',
    },
  };
  return (
    <button
      {...rest}
      style={{
        padding: '10px 18px',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Horizontal progress bar. `pct` is a percent string like '42%'. */
export const Bar = ({ pct, color, height = 12 }) => (
  <svg width="100%" height={height} style={{ marginTop: 6, display: 'block' }}>
    <rect width="100%" height={height} rx={height / 2} fill="var(--sand-10)" />
    <rect width={pct} height={height} rx={height / 2} fill={color} />
  </svg>
);

export const Eyebrow = ({ children, style }) => (
  <div className="s-eyebrow" style={{ color: 'var(--text-tertiary)', ...style }}>
    {children}
  </div>
);

export const TotalRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
    <span className="s-label" style={{ color: 'var(--text-primary)' }}>{label}</span>
    <span className="s-numeric" style={{ color: 'var(--text-primary)' }}>{value}</span>
  </div>
);
