import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import SorteoStore from '../../store/sorteoStore';
import { Q } from '../../utils/format';
import Icon from '../ui/Icon';
import Stat from '../ui/Stat';
import DrawPanel from './DrawPanel';
import ParticipantsTable from './ParticipantsTable';
import WinnersList from './WinnersList';

function exportarSorteo() {
  const a = SorteoStore.activeSorteo();
  const parts = SorteoStore.currentParticipants();
  const cfg = SorteoStore.config();
  const st = SorteoStore.stats();

  // Hoja 1: un registro por cupón
  const filasCupones = [];
  let fila = 1;
  parts.forEach((p) => {
    p.coupons.forEach((c) => {
      filasCupones.push({
        '#': fila++,
        'Cupón': c,
        'Nombre': p.nombre,
        'Teléfono': SorteoStore.maskPhone(p.telefono),
        'Correo': p.correo || '',
        'Factura': p.factura,
        'Monto (Q)': p.monto,
        'Estado': p.estado === 'confirmado' ? 'Confirmado' : 'Pendiente',
        'Fecha registro': new Date(p.fecha).toLocaleDateString('es-GT'),
      });
    });
  });

  // Hoja 2: resumen del sorteo
  const sorteoLabel = a ? SorteoStore.sorteoLabel(a.numero) : '—';
  const filasResumen = [
    { 'Campo': 'Sorteo',             'Valor': sorteoLabel },
    { 'Campo': 'Premio',             'Valor': a ? a.premio : cfg.premio || '' },
    { 'Campo': 'Descripción',        'Valor': a ? a.subtitulo : cfg.subtitulo || '' },
    { 'Campo': 'Valor del premio',   'Valor': 'Q' + (a ? a.valorPremio : cfg.valorPremio || 0) },
    { 'Campo': 'Fecha del sorteo',   'Valor': a ? new Date(a.fechaSorteo).toLocaleDateString('es-GT') : '—' },
    { 'Campo': 'Estado',             'Valor': a ? a.estado : 'sin sorteo activo' },
    { 'Campo': 'Q por cupón',        'Valor': 'Q' + cfg.montoPorCupon },
    { 'Campo': '',                   'Valor': '' },
    { 'Campo': 'Participantes',      'Valor': st.participantes },
    { 'Campo': 'Cupones emitidos',   'Valor': st.totalCupones },
    { 'Campo': 'Cupones confirmados','Valor': st.cuponesConfirmados },
    { 'Campo': 'Pendientes',         'Valor': st.pendientes },
    { 'Campo': 'Ingresos',           'Valor': 'Q' + st.ingresos },
  ];
  if (a && a.ganador) {
    filasResumen.push({ 'Campo': 'Ganador', 'Valor': a.ganador.nombre + ' (cupón ' + a.ganador.code + ')' });
  }

  const wb = XLSX.utils.book_new();

  const wsCupones = XLSX.utils.json_to_sheet(filasCupones);
  // Ancho de columnas
  wsCupones['!cols'] = [
    { wch: 5 }, { wch: 8 }, { wch: 28 }, { wch: 14 },
    { wch: 24 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCupones, 'Cupones');

  const wsResumen = XLSX.utils.json_to_sheet(filasResumen);
  wsResumen['!cols'] = [{ wch: 22 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

  const nombre = 'sorteo-' + (a ? SorteoStore.sorteoLabel(a.numero).replace('#', '') : 'actual') + '.xlsx';
  XLSX.writeFile(wb, nombre);
}

export default function AdminDashboard({ go, onLogout }) {
  const [, force] = useState(0);
  useEffect(() => SorteoStore.subscribe(() => force((n) => n + 1)), []);
  const [tab, setTab] = useState('sorteo');
  const st = SorteoStore.stats();

  const tabs = [
    { id: 'sorteo', label: 'Sorteo', icon: 'trophy' },
    { id: 'participantes', label: 'Participantes', icon: 'users' },
    { id: 'ganadores', label: 'Ganadores', icon: 'sparkle' },
  ];

  return (
    <div className="wrap anim-up" style={{ paddingTop: 26, paddingBottom: 60 }}>
      {/* header */}
      <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
        <div className="col gap-2">
          <span className="chip brand" style={{ alignSelf: 'flex-start' }}>
            <Icon name="lock" size={13} /> Modo administrador
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 30px)' }}>Panel del sorteo</h2>
        </div>
        <div className="row gap-3">
          <button className="btn btn-ghost" onClick={() => go('home')}>Ver sitio</button>
          <button className="btn btn-primary" onClick={exportarSorteo}>
            <Icon name="share" size={17} /> Exportar
          </button>
          <button className="btn btn-ghost" onClick={onLogout}>
            <Icon name="logout" size={17} /> Salir
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="stats-grid">
        <Stat icon="ticket" label="Cupones" value={st.totalCupones} sub={`Meta ${st.meta} · ${st.pct}%`} />
        <Stat icon="users" label="Participantes" value={st.participantes} sub={`${st.pendientes} pendientes`} />
        <Stat icon="checkCircle" label="Confirmados" value={st.cuponesConfirmados} sub="cupones pagados" />
        <Stat icon="coins" label="Ingresos" value={Q(st.ingresos)} sub="facturas registradas" />
      </div>

      {/* tabs */}
      <div className="row gap-2" style={{ marginBottom: 22, flexWrap: 'wrap', borderBottom: '1px solid var(--line)' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="row gap-2" style={{
            padding: '12px 16px', background: 'none', border: 'none',
            borderBottom: '2px solid ' + (tab === t.id ? 'var(--brand)' : 'transparent'),
            color: tab === t.id ? 'var(--brand-ink)' : 'var(--muted)',
            fontWeight: 700, fontSize: 14.5, marginBottom: -1,
          }}>
            <Icon name={t.icon} size={17} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'sorteo' && <DrawPanel />}
      {tab === 'participantes' && <ParticipantsTable />}
      {tab === 'ganadores' && <WinnersList />}
    </div>
  );
}
