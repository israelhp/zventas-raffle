import { useState, useRef } from 'react';
import SorteoStore, { uploadSorteoImage } from '../../store/sorteoStore';
import Icon from '../ui/Icon';
import Field from '../ui/Field';

export default function CreateSorteoForm() {
  const cfg = SorteoStore.config();
  const last = SorteoStore.sorteos().find((s) => s.estado === 'finalizado' || s.estado === 'cancelado');
  const [data, setData] = useState({
    premio: cfg.premio || '',
    valorPremio: cfg.valorPremio || '',
    subtitulo: cfg.subtitulo || '',
    fechaSorteo: (cfg.fechaSorteo || '').slice(0, 10),
    specs: (cfg.specs || []).join('\n'),
  });
  const [err, setErr] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const fileRef = useRef(null);
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  function handleImagen(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  }

  function quitarImagen() {
    setImagenFile(null);
    setImagenPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (data.premio.trim().length < 3) er.premio = 'Ingresá el premio.';
    if (!data.fechaSorteo) er.fechaSorteo = 'Elegí la fecha del sorteo.';
    setErr(er);
    if (Object.keys(er).length) return;
    setSubmitting(true);
    try {
      let imagenUrl = null;
      if (imagenFile) imagenUrl = await uploadSorteoImage(imagenFile, nextNum);
      const res = await SorteoStore.createSorteo({
        premio: data.premio,
        valorPremio: parseFloat(String(data.valorPremio).replace(/[^\d.]/g, '')) || 0,
        subtitulo: data.subtitulo,
        specs: data.specs,
        fechaSorteo: data.fechaSorteo + 'T20:00:00',
        imagenUrl,
      });
      if (res.error) setErr({ global: res.error });
    } catch (e) {
      console.error('[CreateSorteo]', e);
      setErr({ global: 'Error al subir la imagen. Verificá tu conexión e intentá de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  }

  const nextNum = SorteoStore.sorteos().reduce((m, s) => Math.max(m, s.numero), 0) + 1;

  return (
    <div className="anim-up" style={{ maxWidth: 620 }}>
      {last && (
        last.estado === 'cancelado' ? (
          <div className="card" style={{ padding: 18, marginBottom: 18, background: 'var(--warn-soft)', border: 'none' }}>
            <div className="row gap-2" style={{ color: 'oklch(0.5 0.12 70)' }}>
              <Icon name="x" size={18} />
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                Sorteo {SorteoStore.sorteoLabel(last.numero)} cancelado · sin ganador
              </span>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 18, marginBottom: 18, background: 'var(--ok-soft)', border: 'none' }}>
            <div className="row gap-2" style={{ color: 'oklch(0.45 0.13 152)' }}>
              <Icon name="checkCircle" size={18} />
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                Sorteo {SorteoStore.sorteoLabel(last.numero)} finalizado · ganador{' '}
                {last.ganador && last.ganador.nombre} (cupón {last.ganador && last.ganador.code})
              </span>
            </div>
          </div>
        )
      )}

      <form className="card" style={{ padding: 'clamp(22px, 3vw, 32px)' }} onSubmit={submit} noValidate>
        <span className="chip brand" style={{ marginBottom: 14 }}>
          <Icon name="sparkle" size={14} /> Nuevo sorteo {SorteoStore.sorteoLabel(nextNum)}
        </span>
        <h2 style={{ fontSize: 24, marginBottom: 6 }}>Crear sorteo</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 22, fontWeight: 500 }}>
          No hay un sorteo activo. Definí el premio y la fecha para abrir un nuevo sorteo. Solo puede haber un sorteo activo a la vez.
        </p>

        {err.global && (
          <div className="card" style={{ padding: 14, marginBottom: 18, background: 'var(--warn-soft)', border: 'none' }}>
            <span className="row gap-2" style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.5 0.12 70)' }}>
              <Icon name="lock" size={16} /> {err.global}
            </span>
          </div>
        )}

        <div className="col gap-4">
          <Field label="Premio" error={err.premio}>
            <input
              className={'input' + (err.premio ? ' err' : '')}
              value={data.premio}
              onChange={(e) => set('premio', e.target.value)}
              placeholder="Ej. Sistema de Audio Premium para Carro"
            />
          </Field>
          <Field label="Descripción corta">
            <input
              className="input"
              value={data.subtitulo}
              onChange={(e) => set('subtitulo', e.target.value)}
              placeholder="Detalle del premio"
            />
          </Field>
          <div className="two-col">
            <Field label="Valor del premio">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: 13, color: 'var(--muted)', fontWeight: 700, fontSize: 15 }}>Q</span>
                <input
                  className="input"
                  style={{ paddingLeft: 28 }}
                  value={data.valorPremio}
                  inputMode="decimal"
                  onChange={(e) => set('valorPremio', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </Field>
            <Field label="Fecha del sorteo" error={err.fechaSorteo}>
              <input
                className={'input' + (err.fechaSorteo ? ' err' : '')}
                type="date"
                value={data.fechaSorteo}
                onChange={(e) => set('fechaSorteo', e.target.value)}
              />
            </Field>
          </div>
          <Field label="Qué incluye el premio" hint="Una característica por línea — aparece en la página del sorteo.">
            <textarea
              className="input"
              value={data.specs}
              rows={5}
              style={{ resize: 'vertical', lineHeight: 1.5 }}
              onChange={(e) => set('specs', e.target.value)}
              placeholder={'Pantalla táctil de 10"\nAmplificador 1,000W\nInstalación incluida'}
            />
          </Field>
          <Field label="Foto del premio" hint="Opcional · JPG o PNG · Se mostrará en la página pública.">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleImagen}
            />
            {!imagenPreview ? (
              <button
                type="button"
                className="btn btn-ghost btn-block"
                style={{ height: 100, borderStyle: 'dashed', flexDirection: 'column', gap: 8 }}
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="share" size={22} style={{ color: 'var(--muted)' }} />
                <span style={{ fontSize: 13.5, color: 'var(--muted)', fontWeight: 600 }}>Clic para seleccionar imagen</span>
              </button>
            ) : (
              <div style={{ position: 'relative', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                <img
                  src={imagenPreview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={quitarImagen}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    border: 'none', cursor: 'pointer',
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
            )}
          </Field>

          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
            {submitting
              ? <><Icon name="refresh" size={20} className="spin" /> Creando…</>
              : <><Icon name="sparkle" size={20} /> Crear sorteo {SorteoStore.sorteoLabel(nextNum)}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
