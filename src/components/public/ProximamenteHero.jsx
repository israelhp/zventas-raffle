import Icon from '../ui/Icon';

export default function ProximamenteHero() {
  return (
    <div className="card anim-pop" style={{
      padding: 'clamp(36px, 6vw, 72px) 24px',
      textAlign: 'center',
      maxWidth: 680,
      margin: '0 auto',
    }}>
      <div style={{
        width: 74, height: 74, borderRadius: '50%',
        background: 'var(--brand-soft)', color: 'var(--brand-ink)',
        display: 'grid', placeItems: 'center', margin: '0 auto 22px',
      }}>
        <Icon name="clock" size={36} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--brand-ink)' }}>
        Próximamente
      </span>
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', marginTop: 10, marginBottom: 12 }}>
        No hay un sorteo activo
      </h1>
      <p style={{ fontSize: 16, color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.55, maxWidth: 440, margin: '0 auto' }}>
        En este momento no hay un sorteo en curso. Volvé pronto: estamos preparando el próximo premio. Mientras tanto, podés consultar tus cupones más abajo.
      </p>
    </div>
  );
}
