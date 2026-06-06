import SorteoStore from '../../store/sorteoStore';
import Icon from '../ui/Icon';

export default function WinnersList() {
  // TODO: replace with Supabase query — supabase.from('winners').select('*').order('fecha', { ascending: false })
  const winners = SorteoStore.winners();

  if (!winners.length) {
    return (
      <div className="card anim-up" style={{ padding: 48, textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--surface-2)', color: 'var(--muted)',
          display: 'grid', placeItems: 'center', margin: '0 auto 14px',
        }}>
          <Icon name="trophy" size={26} />
        </div>
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>Aún no hay ganadores</h3>
        <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 500 }}>
          Realizá un sorteo para registrar al primer ganador.
        </p>
      </div>
    );
  }

  return (
    <div className="col gap-4 anim-up">
      {winners.map((w, i) => (
        <div key={i} className="card row" style={{ padding: 20, justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div className="row gap-4">
            <div style={{
              width: 50, height: 50, borderRadius: 13,
              background: 'var(--brand-soft)', color: 'var(--brand-ink)',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name="trophy" size={24} />
            </div>
            <div className="col gap-2">
              <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 18 }}>{w.nombre}</h3>
                <span className="chip brand" style={{ padding: '3px 10px', fontSize: 11.5 }}>
                  Sorteo {SorteoStore.sorteoLabel(w.sorteoNumero || 0)}
                </span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                {w.premio} · {new Date(w.fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="col" style={{ alignItems: 'flex-end' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--muted)' }}>CUPÓN</span>
            <span className="coupon-code" style={{ fontSize: 26, color: 'var(--brand-ink)' }}>{w.code}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
