import { useState, useEffect } from 'react';
import SorteoStore from '../store/sorteoStore';
import { Q } from '../utils/format';
import Icon from '../components/ui/Icon';
import Countdown from '../components/ui/Countdown';
import ProximamenteHero from '../components/public/ProximamenteHero';
import CouponForm from '../components/public/CouponForm';
import SearchSection from '../components/public/SearchSection';
import SectionHead from '../components/public/SectionHead';

export default function Home() {
  const [, force] = useState(0);
  useEffect(() => SorteoStore.subscribe(() => force((n) => n + 1)), []);

  const cfg = SorteoStore.config();
  const st = SorteoStore.stats();
  const sorteo = SorteoStore.activeSorteo();
  const info = sorteo || cfg;
  const specs = (info.specs && info.specs.length) ? info.specs : cfg.specs;

  const steps = [
    { icon: 'ticket', t: 'Comprá en la tienda', d: `Por cada ${Q(cfg.montoPorCupon)} de consumo ganás 1 cupón para el sorteo.` },
    { icon: 'bolt', t: 'Registrá tu compra', d: 'Ingresá tus datos y el monto de tu compra en el formulario.' },
    { icon: 'trophy', t: 'Participá en el sorteo', d: 'El día del sorteo transmitimos en vivo y elegimos el cupón ganador.' },
  ];

  return (
    <div className="col anim-up">
      {/* ============ HERO: info + form ============ */}
      <section className="wrap" style={{ paddingTop: 32, paddingBottom: 30 }}>
        {!sorteo ? (
          <ProximamenteHero />
        ) : (
          <div className="hero-grid">
            {/* ---- left: sorteo info ---- */}
            <div className="col" style={{ gap: 20 }}>
              <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
                <span className="chip brand">
                  <i className="dot" style={{ animation: 'pulse 1.4s infinite' }}></i>
                  Sorteo {SorteoStore.sorteoLabel(sorteo.numero)} activo
                </span>
                <span className="chip"><Icon name="shield" size={14} /> Sorteo en vivo</span>
              </div>

              <h1 style={{ fontSize: 'clamp(30px, 4.2vw, 46px)', lineHeight: 1.05 }}>
                Gana un <span style={{ color: 'var(--brand-ink)' }}>{info.premio}</span>
              </h1>

              <p style={{ fontSize: 16.5, color: 'var(--ink-2)', maxWidth: 480, lineHeight: 1.5, fontWeight: 500 }}>
                {info.subtitulo}. Premio valorado en{' '}
                <b style={{ color: 'var(--ink)' }}>{Q(info.valorPremio)}</b>.
                Registrá tu compra y obtené tus cupones para participar.
              </p>

              {/* prize image */}
              <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-2)' }}>
                {sorteo.imagenUrl ? (
                  <img
                    src={sorteo.imagenUrl}
                    alt={info.premio}
                    style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div className="img-slot" style={{ width: '100%', height: 240 }}>
                    <Icon name="trophy" size={36} style={{ opacity: 0.3 }} />
                  </div>
                )}
                <span className="chip" style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(6px)',
                }}>
                  <Icon name="coins" size={14} /> Valor {Q(info.valorPremio)}
                </span>
              </div>

              {/* countdown + progress */}
              <div className="card" style={{ padding: 20 }}>
                <div className="col gap-2" style={{ marginBottom: 18 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>
                    Termina en
                  </span>
                  <Countdown target={info.fechaSorteo} />
                </div>
                <div className="col gap-2">
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>Progreso del sorteo</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--brand-ink)' }}>
                      {st.totalCupones}/{st.meta}
                    </span>
                  </div>
                  <div className="progress"><i style={{ width: st.pct + '%' }}></i></div>
                  <div className="row gap-4" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>{st.participantes} participantes</span>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>{st.totalCupones} cupones emitidos</span>
                  </div>
                </div>
              </div>

              {/* specs */}
              <div className="card" style={{ padding: 20 }}>
                <span className="row gap-2" style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-ink)', marginBottom: 12 }}>
                  <Icon name="speaker" size={16} /> Qué incluye el premio
                </span>
                <ul className="col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {specs.map((s, i) => (
                    <li key={i} className="row gap-3" style={{ alignItems: 'flex-start' }}>
                      <Icon name="checkCircle" size={18} style={{ color: 'var(--ok)', flex: '0 0 auto', marginTop: 1 }} />
                      <span style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---- right: form ---- */}
            <div style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
              <CouponForm />
            </div>
          </div>
        )}
      </section>

      {/* ============ HOW IT WORKS ============ */}
      {sorteo && (
        <section className="wrap" style={{ paddingTop: 24, paddingBottom: 30 }}>
          <SectionHead kicker="Cómo participar" title="Tus cupones en 3 pasos" />
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="card" style={{ padding: 24, position: 'relative' }}>
                <span style={{
                  position: 'absolute', top: 18, right: 20,
                  fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 40,
                  color: 'var(--brand-soft)',
                }}>
                  {i + 1}
                </span>
                <div style={{
                  width: 48, height: 48, borderRadius: 13,
                  background: 'var(--brand-soft)', color: 'var(--brand-ink)',
                  display: 'grid', placeItems: 'center', marginBottom: 16,
                }}>
                  <Icon name={s.icon} size={24} />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 7 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, fontWeight: 500 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ SEARCH ============ */}
      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 52 }} id="buscar">
        <SearchSection />
      </section>
    </div>
  );
}
