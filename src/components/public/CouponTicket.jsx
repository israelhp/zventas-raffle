import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import SorteoStore from '../../store/sorteoStore';
import Icon from '../ui/Icon';
import { useToast } from '../ui/Toast';

function CouponTicket({ entry }) {
  const sorteo = SorteoStore.activeSorteo();
  const cfg = SorteoStore.config();
  const p = entry.participant;
  const conf = p.estado === 'confirmado';
  const serial = 'GT-' + entry.code + '-' + (p.factura || '000000');

  // Usar fecha del sorteo activo; si no hay sorteo activo buscar en todos
  const allSorteos = SorteoStore.sorteos();
  const sorteoDelParticipante = allSorteos.find((s) => s.numero === p.sorteoNumero);
  const fechaRaw = sorteo?.fechaSorteo || sorteoDelParticipante?.fechaSorteo;
  const fecha = fechaRaw
    ? new Date(fechaRaw).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';
  const premio = sorteo?.premio || sorteoDelParticipante?.premio || '';

  return (
    <div className="ticket">
      <div className="ticket-main">
        <div className="ticket-head">
          <div className="row gap-3">
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'var(--black)', color: 'var(--brand)',
              display: 'grid', placeItems: 'center', flex: '0 0 auto',
            }}>
              <Icon name="speaker" size={19} />
            </div>
            <div className="col" style={{ lineHeight: 1.05 }}>
              <span style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 15 }}>Zona de Ventas Sorteos</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand-ink)' }}>
                Cupón de participación
              </span>
            </div>
          </div>
          <span className="ticket-serial">N° {serial}</span>
        </div>

        <div className="ticket-prize">
          <Icon name="trophy" size={15} /> Gana: {premio}
        </div>

        <div className="ticket-numrow">
          <div className="col" style={{ gap: 6 }}>
            <span className="ticket-numlabel">Número de cupón</span>
            <span className="ticket-number" style={{ fontSize: 'clamp(44px, 9vw, 60px)' }}>{entry.code}</span>
          </div>
          <div className="ticket-meta">
            <div><div className="k">Titular</div><div className="v">{p.nombre}</div></div>
            <div><div className="k">Fecha del sorteo</div><div className="v">{fecha}</div></div>
            <div>
              <div className="k">Estado</div>
              <div className="v" style={{ color: conf ? 'var(--ok)' : 'oklch(0.55 0.12 70)' }}>
                {conf ? 'Confirmado' : 'Validación pendiente'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-stub">
        <span className="stub-k">CUPÓN</span>
        <span className="stub-num">{entry.code}</span>
        <div className="barcode"></div>
      </div>
    </div>
  );
}

export function CouponTicketModal({ entry, onClose }) {
  const [toast, showToast] = useToast();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function downloadPdf() {
    const ticketHtml = document.getElementById('print-ticket').innerHTML;
    // Copiar todos los estilos del documento al nuevo contexto
    const styles = Array.from(document.querySelectorAll('style'))
      .map((s) => s.outerHTML).join('');
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => l.outerHTML).join('');

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    ${links}${styles}
    <style>
      @page { size: landscape; margin: 14mm; }
      html, body { margin: 0; padding: 0; background: #fff; height: 100%; }
      body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      .ticket { box-shadow: none !important; border: 1px solid #ddd !important; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    </style>
  </head>
  <body>${ticketHtml}</body>
</html>`);
    win.document.close();
    // Esperar a que los estilos carguen antes de imprimir
    setTimeout(() => { win.print(); win.close(); }, 600);
  }

  function copyCode() {
    navigator.clipboard?.writeText(entry.code);
    showToast('Número copiado');
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          <div className="col">
            <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-ink)' }}>
              Detalle del cupón
            </span>
            <h2 style={{ fontSize: 21 }}>Cupón {entry.code}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div id="print-ticket">
          <CouponTicket entry={entry} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={copyCode}>
            <Icon name="copy" size={17} /> Copiar número
          </button>
          <button className="btn btn-primary" onClick={downloadPdf}>
            <Icon name="share" size={17} /> Descargar PDF
          </button>
        </div>
      </div>
      {toast}
    </div>,
    document.body
  );
}

export default CouponTicket;
