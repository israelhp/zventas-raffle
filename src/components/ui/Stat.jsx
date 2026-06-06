import Icon from './Icon';

export default function Stat({ icon, label, value, sub }) {
  return (
    <div className="card" style={{ padding: '18px 20px', flex: 1, minWidth: 0 }}>
      <div className="row gap-2" style={{ color: 'var(--brand-ink)', marginBottom: 10 }}>
        <Icon name={icon} size={18} />
        <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, fontWeight: 600 }}>{sub}</div>
      )}
    </div>
  );
}
