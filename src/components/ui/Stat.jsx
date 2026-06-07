import Icon from './Icon';

export default function Stat({ icon, label, value, sub }) {
  return (
    <div className="card" style={{ padding: 'clamp(14px, 3vw, 20px)', minWidth: 0, overflow: 'hidden' }}>
      <div className="row gap-2" style={{ color: 'var(--brand-ink)', marginBottom: 10, minWidth: 0 }}>
        <Icon name={icon} size={17} style={{ flex: '0 0 auto' }} />
        <span style={{
          fontSize: 'clamp(10.5px, 2.6vw, 12.5px)', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: 'var(--muted)', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 5vw, 26px)',
        letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: 'clamp(11px, 2.4vw, 12.5px)', color: 'var(--muted)', marginTop: 3, fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{sub}</div>
      )}
    </div>
  );
}
