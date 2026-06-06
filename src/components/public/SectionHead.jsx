export default function SectionHead({ kicker, title, center }) {
  return (
    <div className="col gap-2" style={{
      alignItems: center ? 'center' : 'flex-start',
      marginBottom: 22,
      textAlign: center ? 'center' : 'left',
    }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-ink)' }}>
        {kicker}
      </span>
      <h2 style={{ fontSize: 'clamp(24px, 3.4vw, 32px)' }}>{title}</h2>
    </div>
  );
}
