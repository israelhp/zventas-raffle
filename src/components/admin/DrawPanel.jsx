import { useState } from 'react';
import SorteoStore from '../../store/sorteoStore';
import Icon from '../ui/Icon';
import CreateSorteoForm from './CreateSorteoForm';

export default function DrawPanel() {
  const active = SorteoStore.activeSorteo();
  const [onlyConf, setOnlyConf] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [digits, setDigits] = useState(['0', '0', '0', '0']);
  const [winner, setWinner] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [drawSorteo, setDrawSorteo] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [saving, setSaving] = useState(false);
  const st = SorteoStore.stats();
  const poolCount = onlyConf ? st.cuponesConfirmados : st.totalCupones;

  if (!active && !winner) return <CreateSorteoForm />;

  const sorteo = active || drawSorteo;

  function run() {
    const w = SorteoStore.drawWinner(onlyConf);
    if (!w) { alert('No hay cupones disponibles para sortear con este filtro.'); return; }
    setDrawSorteo(active);
    setWinner(null); setConfirmed(false); setRolling(true);
    const target = w.code.split('');
    const startT = Date.now();
    const dur = 2600;
    const id = setInterval(() => {
      const elapsed = Date.now() - startT;
      const p = elapsed / dur;
      setDigits((prev) => prev.map((_, i) => {
        const lockAt = 0.4 + i * 0.15;
        if (p >= lockAt) return target[i];
        return String(Math.floor(Math.random() * 10));
      }));
      if (elapsed >= dur) {
        clearInterval(id);
        setDigits(target);
        setRolling(false);
        setWinner(w);
      }
    }, 70);
  }

  async function confirm() {
    setSaving(true);
    try {
      await SorteoStore.confirmWinner(winner);
      setConfirmed(true);
    } catch {
      alert('Error al registrar el ganador. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  function nuevo() { setWinner(null); setDigits(['0', '0', '0', '0']); setConfirmed(false); setDrawSorteo(null); }

  async function cancelar() {
    setSaving(true);
    try {
      await SorteoStore.cancelSorteo();
    } catch {
      alert('Error al cancelar el sorteo. Intentá de nuevo.');
    } finally {
      setSaving(false);
      setConfirmingCancel(false);
    }
  }

  const fecha = sorteo && new Date(sorteo.fechaSorteo).toLocaleDateString('es-GT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="anim-up">
      <div className="card" style={{ padding: 'clamp(24px, 4vw, 44px)', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <div className="row gap-2" style={{ justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
          <span className="chip brand"><Icon name="trophy" size={14} /> Sorteo {SorteoStore.sorteoLabel(sorteo.numero)}</span>
          <span className="chip"><Icon name="ticket" size={14} /> {poolCount} cupones en la tómbola</span>
          <span className="chip"><Icon name="clock" size={14} /> {fecha}</span>
        </div>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: 4 }}>{sorteo.premio}</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 500, marginBottom: 28 }}>
          {confirmed ? 'Sorteo finalizado. Ganador registrado.' : 'Presioná el botón para elegir el cupón ganador al azar.'}
        </p>

        {/* digit reels */}
        <div className="row" style={{ gap: 'clamp(8px,2vw,16px)', justifyContent: 'center', marginBottom: 28 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              width: 'clamp(60px, 16vw, 92px)', height: 'clamp(84px, 22vw, 124px)',
              borderRadius: 'var(--r-lg)', background: 'var(--black)',
              color: winner ? 'var(--brand)' : '#fff',
              border: '1px solid var(--line-2)',
              display: 'grid', placeItems: 'center',
              boxShadow: winner ? '0 0 0 3px var(--brand-soft), var(--sh-3)' : 'var(--sh-3)',
              transition: 'box-shadow .4s ease, color .4s ease', position: 'relative',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                fontSize: 'clamp(40px, 11vw, 64px)', lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                filter: rolling ? 'blur(0.4px)' : 'none',
              }}>
                {d}
              </span>
            </div>
          ))}
        </div>

        {!winner && (
          <>
            <label className="row gap-3" style={{ justifyContent: 'center', marginBottom: 20, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyConf}
                onChange={(e) => setOnlyConf(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--brand)' }}
                disabled={rolling}
              />
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)', fontWeight: 600 }}>Solo cupones con pago confirmado</span>
            </label>
            {!confirmingCancel ? (
              <div className="row gap-3" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-lg" onClick={run} disabled={rolling || saving} style={{ minWidth: 220 }}>
                  {rolling
                    ? <><Icon name="refresh" size={20} className="spin" /> Sorteando…</>
                    : <><Icon name="trophy" size={20} /> Realizar sorteo</>}
                </button>
                {!rolling && (
                  <button className="btn btn-ghost btn-lg" onClick={() => setConfirmingCancel(true)} style={{ color: 'var(--danger)' }} disabled={saving}>
                    <Icon name="x" size={18} /> Cancelar sorteo
                  </button>
                )}
              </div>
            ) : (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 600 }}>
                  ¿Cancelar el sorteo {SorteoStore.sorteoLabel(sorteo.numero)}? No se elegirá ganador.
                </span>
                <div className="row gap-3" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="btn btn-ghost" onClick={() => setConfirmingCancel(false)} disabled={saving}>Volver</button>
                  <button
                    className="btn btn-primary"
                    style={{ background: 'var(--danger)', color: '#fff' }}
                    onClick={cancelar}
                    disabled={saving}
                  >
                    {saving
                      ? <><Icon name="refresh" size={18} className="spin" /> Cancelando…</>
                      : <><Icon name="x" size={18} /> Sí, cancelar sorteo</>}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {winner && (
          <div className="anim-pop col" style={{ alignItems: 'center', gap: 6 }}>
            <Icon name="sparkle" size={26} style={{ color: 'var(--brand-ink)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)' }}>
              Cupón ganador · Sorteo {SorteoStore.sorteoLabel(sorteo.numero)}
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', marginBottom: 4 }}>{winner.participant.nombre}</h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 600 }}>
              {SorteoStore.maskPhone(winner.participant.telefono)} · Factura #{winner.participant.factura}
            </p>
            <div className="row gap-3" style={{ marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
              {!confirmed ? (
                <button className="btn btn-primary" onClick={confirm} disabled={saving}>
                  {saving
                    ? <><Icon name="refresh" size={18} className="spin" /> Guardando…</>
                    : <><Icon name="check" size={18} /> Registrar ganador y finalizar</>}
                </button>
              ) : (
                <>
                  <span className="chip ok"><Icon name="check" size={14} /> Ganador registrado</span>
                  <button className="btn btn-ghost" onClick={nuevo}>
                    <Icon name="sparkle" size={17} /> Crear nuevo sorteo
                  </button>
                </>
              )}
              {!confirmed && (
                <button className="btn btn-ghost" onClick={nuevo} disabled={saving}>
                  <Icon name="refresh" size={17} /> Repetir
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
