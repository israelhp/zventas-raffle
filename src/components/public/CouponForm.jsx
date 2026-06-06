import { useState } from 'react';
import { createPortal } from 'react-dom';
import SorteoStore from '../../store/sorteoStore';
import { Q } from '../../utils/format';
import Icon from '../ui/Icon';
import Field from '../ui/Field';
import { useToast } from '../ui/Toast';

function TerminosModal({ onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modal-bar">
          <div className="col">
            <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-ink)' }}>
              Sorteo
            </span>
            <h2 style={{ fontSize: 20 }}>Términos y condiciones</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </div>

        <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6, fontWeight: 500, margin: '0 0 20px' }}>
          Al participar en este sorteo, el participante acepta los siguientes términos y condiciones:
        </p>

        <div className="col gap-4" style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7, fontWeight: 500 }}>

          <section className="col gap-2">
            <h3 style={{ fontSize: 14.5, color: 'var(--ink)', margin: 0 }}>1. Recopilación de información</h3>
            <p style={{ margin: 0 }}>Para participar en el sorteo se solicitarán los siguientes datos personales:</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Nombre completo</li>
              <li>Número de teléfono</li>
              <li>Correo electrónico</li>
            </ul>
          </section>

          <section className="col gap-2">
            <h3 style={{ fontSize: 14.5, color: 'var(--ink)', margin: 0 }}>2. Uso de la información</h3>
            <p style={{ margin: 0 }}>La información proporcionada será utilizada exclusivamente para:</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Validar la participación en el sorteo.</li>
              <li>Contactar al ganador en caso de resultar seleccionado.</li>
              <li>Verificar la identidad del ganador durante la entrega del premio.</li>
            </ul>
          </section>

          <section className="col gap-2">
            <h3 style={{ fontSize: 14.5, color: 'var(--ink)', margin: 0 }}>3. Protección de datos</h3>
            <p style={{ margin: 0 }}>
              Los datos recopilados serán tratados de forma confidencial y no serán vendidos, alquilados ni compartidos con terceros ajenos a la organización del sorteo.
            </p>
          </section>

          <section className="col gap-2">
            <h3 style={{ fontSize: 14.5, color: 'var(--ink)', margin: 0 }}>4. Participación voluntaria</h3>
            <p style={{ margin: 0 }}>
              La participación en el sorteo es completamente voluntaria. Al enviar sus datos, el participante confirma que la información proporcionada es verídica y actualizada.
            </p>
          </section>

          <section className="col gap-2">
            <h3 style={{ fontSize: 14.5, color: 'var(--ink)', margin: 0 }}>5. Selección del ganador</h3>
            <p style={{ margin: 0 }}>
              El ganador será seleccionado de manera aleatoria entre todos los participantes que cumplan con los requisitos establecidos para el sorteo.
            </p>
          </section>

          <section className="col gap-2">
            <h3 style={{ fontSize: 14.5, color: 'var(--ink)', margin: 0 }}>6. Aceptación de los términos</h3>
            <p style={{ margin: 0 }}>
              Al completar y enviar el formulario de participación, el participante declara haber leído y aceptado estos términos y condiciones.
            </p>
          </section>

        </div>

        <div className="modal-actions" style={{ marginTop: 8 }}>
          <button className="btn btn-primary btn-block" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function CouponSuccess({ participant, onReset }) {
  const [toast, showToast] = useToast();
  const copy = (txt) => { navigator.clipboard?.writeText(txt); showToast('Copiado'); };

  return (
    <div className="card anim-pop" style={{ padding: 'clamp(24px, 3vw, 32px)', textAlign: 'center' }}>
      <div style={{
        width: 62, height: 62, borderRadius: '50%',
        background: 'var(--ok-soft)', color: 'var(--ok)',
        display: 'grid', placeItems: 'center', margin: '0 auto 16px',
      }}>
        <Icon name="checkCircle" size={32} />
      </div>
      <h2 style={{ fontSize: 25, marginBottom: 8 }}>¡Listo, {participant.nombre.split(' ')[0]}!</h2>
      <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 500, marginBottom: 22 }}>
        Tu factura <b className="coupon-code" style={{ color: 'var(--ink)' }}>#{participant.factura}</b> por {Q(participant.monto)} te dio{' '}
        <b>{participant.coupons.length}</b> {participant.coupons.length === 1 ? 'cupón' : 'cupones'}.
      </p>

      <div className="row" style={{ flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 22 }}>
        {participant.coupons.map((c) => (
          <div
            key={c}
            onClick={() => copy(c)}
            title="Copiar"
            style={{
              cursor: 'pointer', background: 'var(--black)', color: 'var(--brand)',
              borderRadius: 'var(--r-md)', padding: '12px 18px',
              boxShadow: 'var(--sh-2)', border: '1px solid var(--line-2)',
            }}
          >
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', opacity: .7, marginBottom: 3, color: '#fff' }}>CUPÓN</div>
            <div className="coupon-code" style={{ fontSize: 26 }}>{c}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 16, textAlign: 'left', background: 'var(--warn-soft)', border: 'none', marginBottom: 20 }}>
        <div className="row gap-2" style={{ color: 'oklch(0.5 0.12 70)', marginBottom: 6 }}>
          <Icon name="clock" size={16} />
          <b style={{ fontSize: 13.5 }}>Validación pendiente</b>
        </div>
        <p style={{ fontSize: 12.5, color: 'oklch(0.45 0.08 70)', lineHeight: 1.5, fontWeight: 500 }}>
          Presentá tu factura física para validar tus cupones. Una vez confirmada, tu estado pasará a <b>confirmado</b> y entrás al sorteo.
        </p>
      </div>

      <div className="row gap-3" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => copy(participant.coupons.join(', '))}>
          <Icon name="copy" size={18} /> Copiar mis números
        </button>
        <button className="btn btn-ghost" onClick={onReset}>
          <Icon name="ticket" size={18} /> Registrar otra factura
        </button>
      </div>
      {toast}
    </div>
  );
}

export default function CouponForm() {
  const cfg = SorteoStore.config();
  const sorteo = SorteoStore.activeSorteo();
  const [data, setData] = useState({ nombre: '', telefono: '', correo: '', factura: '', monto: '', acepto: false });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showTerminos, setShowTerminos] = useState(false);
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  if (!sorteo && !done) {
    return (
      <div className="card" style={{ padding: 'clamp(24px, 3vw, 34px)', textAlign: 'center' }}>
        <div style={{
          width: 58, height: 58, borderRadius: '50%',
          background: 'var(--warn-soft)', color: 'oklch(0.55 0.12 70)',
          display: 'grid', placeItems: 'center', margin: '0 auto 16px',
        }}>
          <Icon name="clock" size={28} />
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Próximamente</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 500 }}>
          No hay un sorteo activo en este momento. Volvé pronto: estamos preparando el próximo sorteo.
        </p>
      </div>
    );
  }

  const montoNum = parseFloat(String(data.monto).replace(/[^\d.]/g, '')) || 0;
  const cupones = Math.floor(montoNum / cfg.montoPorCupon);

  function validate() {
    const e = {};
    if (data.nombre.trim().length < 4) e.nombre = 'Ingresá tu nombre completo.';
    if (data.telefono.replace(/\D/g, '').length < 8) e.telefono = 'Teléfono de 8 dígitos.';
    if (data.correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.correo)) e.correo = 'Correo no válido.';
    if (data.factura.trim().length < 3) e.factura = 'Ingresá el número de factura.';
    if (montoNum < cfg.montoPorCupon) e.monto = `El monto mínimo es ${Q(cfg.montoPorCupon)} (1 cupón).`;
    if (!data.acepto) e.acepto = 'Debés aceptar los términos.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const p = await SorteoStore.addParticipant({ ...data, monto: montoNum });
      setDone(p);
    } catch {
      setErrors({ global: 'Ocurrió un error al registrar. Intentá de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <CouponSuccess
        participant={done}
        onReset={() => { setData({ nombre: '', telefono: '', correo: '', factura: '', monto: '', acepto: false }); setDone(null); }}
      />
    );
  }

  return (
    <form className="card" style={{ padding: 'clamp(22px, 3vw, 30px)' }} onSubmit={submit} noValidate>
      <span className="chip brand" style={{ marginBottom: 14 }}>
        <Icon name="ticket" size={14} /> Obtené tus cupones
      </span>
      <h2 style={{ fontSize: 24, marginBottom: 6 }}>Registrá tu factura</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 20, fontWeight: 500 }}>
        Completá tus datos y los de tu factura. Tus cupones se generan al instante.
      </p>

      {errors.global && (
        <div className="card" style={{ padding: 14, marginBottom: 16, background: 'var(--warn-soft)', border: 'none' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.5 0.12 70)' }}>{errors.global}</span>
        </div>
      )}

      <div className="row gap-3" style={{
        background: 'var(--brand-soft)', borderRadius: 'var(--r-md)',
        padding: '12px 14px', marginBottom: 20,
      }}>
        <Icon name="bolt" size={18} style={{ color: 'var(--brand-ink)', flex: '0 0 auto' }} />
        <span style={{ fontSize: 13.5, color: 'var(--brand-ink)', fontWeight: 700 }}>
          Regla: por {Q(cfg.montoPorCupon)} consumidos = 1 Cupón
        </span>
      </div>

      <div className="col gap-4">
        <Field label="Nombre completo" error={errors.nombre}>
          <input
            className={'input' + (errors.nombre ? ' err' : '')}
            value={data.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            placeholder="Ej. María José Castillo"
          />
        </Field>
        <div className="two-col">
          <Field label="Teléfono / WhatsApp" error={errors.telefono}>
            <input
              className={'input' + (errors.telefono ? ' err' : '')}
              value={data.telefono}
              inputMode="numeric"
              onChange={(e) => set('telefono', e.target.value)}
              placeholder="5555-5555"
            />
          </Field>
          <Field label="Correo (opcional)" error={errors.correo}>
            <input
              className={'input' + (errors.correo ? ' err' : '')}
              value={data.correo}
              onChange={(e) => set('correo', e.target.value)}
              placeholder="tucorreo@correo.com"
            />
          </Field>
        </div>
        <div className="two-col">
          <Field label="Número de factura" error={errors.factura}>
            <input
              className={'input' + (errors.factura ? ' err' : '')}
              value={data.factura}
              onChange={(e) => set('factura', e.target.value)}
              placeholder="Ej. 458210"
            />
          </Field>
          <Field label="Monto de la factura" error={errors.monto}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: 13, color: 'var(--muted)', fontWeight: 700, fontSize: 15 }}>Q</span>
              <input
                className={'input' + (errors.monto ? ' err' : '')}
                value={data.monto}
                inputMode="decimal"
                style={{ paddingLeft: 28 }}
                onChange={(e) => set('monto', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </Field>
        </div>

        <div className="row" style={{
          justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 'var(--r-md)', padding: '14px 16px',
        }}>
          <span style={{ fontSize: 13.5, color: 'var(--ink-2)', fontWeight: 600 }}>Cupones que obtenés</span>
          <span className="row gap-2" style={{
            fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 22,
            color: cupones > 0 ? 'var(--brand-ink)' : 'var(--muted)',
          }}>
            <Icon name="ticket" size={20} /> {cupones}
          </span>
        </div>

        <label className="row gap-3" style={{ cursor: 'pointer', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            checked={data.acepto}
            onChange={(e) => set('acepto', e.target.checked)}
            style={{ width: 20, height: 20, accentColor: 'var(--brand)', marginTop: 1, flex: '0 0 auto' }}
          />
          <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>
            Acepto los{' '}
            <button
              type="button"
              onClick={() => setShowTerminos(true)}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--brand-ink)', fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              términos del sorteo
            </button>
            {' '}y autorizo el contacto por WhatsApp.
            {errors.acepto && <b style={{ color: 'var(--danger)', display: 'block' }}>{errors.acepto}</b>}
          </span>
        </label>

        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
          {submitting
            ? <><Icon name="refresh" size={20} className="spin" /> Guardando…</>
            : <><Icon name="ticket" size={20} /> Obtener mis cupones</>}
        </button>
      </div>
      {showTerminos && <TerminosModal onClose={() => setShowTerminos(false)} />}
    </form>
  );
}
