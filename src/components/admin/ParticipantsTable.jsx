import { useState } from 'react';
import SorteoStore from '../../store/sorteoStore';
import { Q } from '../../utils/format';
import Icon from '../ui/Icon';

export default function ParticipantsTable() {
  const [q, setQ] = useState('');
  const [toggling, setToggling] = useState(null);
  const active = SorteoStore.activeSorteo();
  const base = SorteoStore.currentParticipants();
  const list = base.filter((p) =>
    !q || p.nombre.toLowerCase().includes(q.toLowerCase()) || p.coupons.some((c) => c.includes(q))
  );

  async function toggleEstado(p) {
    setToggling(p.id);
    try {
      await SorteoStore.setEstado(p.id, p.estado === 'confirmado' ? 'pendiente' : 'confirmado');
    } finally {
      setToggling(null);
    }
  }

  if (!active) {
    return (
      <div className="card anim-up" style={{ padding: 48, textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--surface-2)', color: 'var(--muted)',
          display: 'grid', placeItems: 'center', margin: '0 auto 14px',
        }}>
          <Icon name="users" size={26} />
        </div>
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>No hay sorteo activo</h3>
        <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 500 }}>
          Creá un sorteo para empezar a recibir participantes.
        </p>
      </div>
    );
  }

  return (
    <div className="anim-up col gap-4">
      <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', maxWidth: 320, flex: 1, minWidth: 220 }}>
          <Icon name="search" size={18} style={{ position: 'absolute', left: 13, top: 13, color: 'var(--muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 42 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrar por nombre o cupón…"
          />
        </div>
        <span className="chip brand">
          <Icon name="trophy" size={14} /> Sorteo {SorteoStore.sorteoLabel(active.numero)} · {base.length} participantes
        </span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="scroll-y" style={{ maxHeight: 560, overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Participante</th>
                <th>Contacto</th>
                <th>Monto</th>
                <th>Cupones</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const conf = p.estado === 'confirmado';
                const busy = toggling === p.id;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.nombre}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {new Date(p.fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short' })}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{SorteoStore.maskPhone(p.telefono)}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--ink)', fontWeight: 700 }}>{Q(p.monto)}</div>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 5, flexWrap: 'wrap', maxWidth: 200 }}>
                        {p.coupons.map((c) => (
                          <span key={c} className="coupon-code" style={{
                            fontSize: 12.5, background: 'var(--surface-2)',
                            border: '1px solid var(--line-2)', borderRadius: 6,
                            padding: '3px 7px', color: 'var(--brand-ink)',
                          }}>{c}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={'chip ' + (conf ? 'ok' : 'warn')}>
                        <i className="dot"></i>{conf ? 'Confirmado' : 'Pendiente'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '7px 12px', fontSize: 13 }}
                        disabled={busy}
                        onClick={() => toggleEstado(p)}
                      >
                        {busy
                          ? <Icon name="refresh" size={14} className="spin" />
                          : conf ? 'Marcar pend.' : 'Confirmar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>
              Sin participantes que coincidan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
