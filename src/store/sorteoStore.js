/* ============================================================
   SorteoStore — Supabase-backed state with in-memory cache
   ============================================================ */

import { supabase } from '../lib/supabase';

export function maskPhone(p) { return p ? p.replace(/(\d{4})(\d{4})/, '$1-$2') : ''; }

function genCode(used) {
  let c;
  do { c = String(Math.floor(Math.random() * 10000)).padStart(4, '0'); }
  while (used.has(c));
  used.add(c);
  return c;
}

function pad3(n) { return '#' + String(n).padStart(3, '0'); }

export async function uploadSorteoImage(file, sorteoNumero) {
  // Borrar todos los archivos existentes en el bucket antes de subir
  const { data: existing } = await supabase.storage.from('sorteos').list();
  if (existing && existing.length > 0) {
    await supabase.storage.from('sorteos').remove(existing.map((f) => f.name));
  }

  const ext = file.name.split('.').pop();
  const filename = `sorteo-${sorteoNumero}.${ext}`;
  const { error } = await supabase.storage
    .from('sorteos')
    .upload(filename, file, { contentType: file.type });
  if (error) throw error;

  const { data } = supabase.storage.from('sorteos').getPublicUrl(filename);
  return data.publicUrl;
}

// DB row → in-memory mappers (snake_case → camelCase)
function dbParticipant(r) {
  return {
    id: r.id, nombre: r.nombre, telefono: r.telefono,
    correo: r.correo, factura: r.factura, monto: Number(r.monto),
    cantidad: r.cantidad, coupons: r.coupons || [],
    sorteoNumero: r.sorteo_numero, estado: r.estado, fecha: r.fecha,
  };
}
function dbSorteo(r) {
  return {
    id: r.id, numero: r.numero, premio: r.premio,
    subtitulo: r.subtitulo, valorPremio: Number(r.valor_premio),
    specs: r.specs || [], fechaSorteo: r.fecha_sorteo,
    estado: r.estado, ganador: r.ganador, imagenUrl: r.imagen_url || null,
    creado: r.creado, finalizado: r.finalizado, cancelado: r.cancelado,
  };
}
function dbWinner(r) {
  return {
    id: r.id, code: r.code, nombre: r.nombre,
    telefono: r.telefono, premio: r.premio,
    sorteoNumero: r.sorteo_numero, fecha: r.fecha,
  };
}

let state = {
  config: { montoPorCupon: 500, meta: 1500 },
  participants: [],
  winners: [],
  sorteos: [],
  usedCodes: new Set(),
  loading: true,
};

const subs = new Set();
function emit() { subs.forEach((fn) => fn(state)); }

const SorteoStore = {
  get() { return state; },
  config() { return state.config; },
  isLoading() { return state.loading; },
  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

  async init() {
    // Config
    const { data: cfg } = await supabase.from('config').select('*').single();
    if (cfg) {
      state.config = { montoPorCupon: Number(cfg.monto_por_cupon), meta: cfg.meta };
    }

    // Sorteos
    const { data: sorteos } = await supabase
      .from('sorteos').select('*').order('numero', { ascending: false });
    state.sorteos = (sorteos || []).map(dbSorteo);

    // Participants
    const { data: parts } = await supabase
      .from('participants').select('*').order('fecha', { ascending: false });
    state.participants = (parts || []).map(dbParticipant);

    // Winners
    const { data: wins } = await supabase
      .from('winners').select('*').order('fecha', { ascending: false });
    state.winners = (wins || []).map(dbWinner);

    // Rebuild used codes set from all stored coupons
    state.usedCodes = new Set(state.participants.flatMap((p) => p.coupons));

    state.loading = false;
    emit();
  },

  stats() {
    const list = this.currentParticipants();
    const totalCupones = list.reduce((a, p) => a + p.coupons.length, 0);
    const confirmados = list.filter((p) => p.estado === 'confirmado');
    const cuponesConfirmados = confirmados.reduce((a, p) => a + p.coupons.length, 0);
    const ingresos = list.reduce((a, p) => a + (p.monto || 0), 0);
    return {
      totalCupones,
      participantes: list.length,
      cuponesConfirmados,
      pendientes: list.filter((p) => p.estado === 'pendiente').length,
      ingresos,
      meta: state.config.meta,
      pct: Math.min(100, Math.round((totalCupones / state.config.meta) * 100)),
    };
  },

  currentParticipants() {
    const a = this.activeSorteo();
    if (!a) return [];
    return state.participants.filter((p) => p.sorteoNumero === a.numero);
  },

  async addParticipant(data) {
    const monto = Number(data.monto) || 0;
    const cantidad = Math.floor(monto / state.config.montoPorCupon);
    const coupons = Array.from({ length: cantidad }, () => genCode(state.usedCodes));
    const active = this.activeSorteo();

    const { data: inserted, error } = await supabase
      .from('participants')
      .insert({
        nombre: data.nombre.trim(),
        telefono: (data.telefono || '').replace(/\D/g, ''),
        correo: data.correo || '',
        factura: (data.factura || '').trim(),
        monto,
        cantidad,
        coupons,
        sorteo_numero: active ? active.numero : null,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw error;

    const p = dbParticipant(inserted);
    state.participants.unshift(p);
    emit();
    return p;
  },

  async searchByName(q) {
    const t = (q || '').trim();
    if (!t) return [];
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .or(`nombre.ilike.%${t}%,factura.ilike.%${t}%,telefono.ilike.%${t}%`);
    if (error) return [];
    return (data || []).map(dbParticipant);
  },

  async setEstado(id, estado) {
    const { error } = await supabase
      .from('participants').update({ estado }).eq('id', id);
    if (error) throw error;
    const p = state.participants.find((x) => x.id === id);
    if (p) { p.estado = estado; emit(); }
  },

  allCoupons() {
    const out = [];
    this.currentParticipants().forEach((p) =>
      p.coupons.forEach((c) => out.push({ code: c, participant: p })));
    return out;
  },

  // Synchronous — works on in-memory cache
  drawWinner(onlyConfirmed) {
    let pool = this.allCoupons();
    if (onlyConfirmed) pool = pool.filter((x) => x.participant.estado === 'confirmado');
    const already = new Set(state.winners.map((w) => w.code));
    pool = pool.filter((x) => !already.has(x.code));
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  async confirmWinner(w) {
    const sorteo = this.activeSorteo();
    if (!sorteo) return false;

    const ganador = { code: w.code, nombre: w.participant.nombre, telefono: w.participant.telefono };
    const now = new Date().toISOString();

    const { error: errS } = await supabase.from('sorteos')
      .update({ estado: 'finalizado', finalizado: now, ganador })
      .eq('id', sorteo.id);
    if (errS) throw errS;

    const { data: winRow, error: errW } = await supabase.from('winners')
      .insert({
        code: w.code,
        nombre: w.participant.nombre,
        telefono: w.participant.telefono,
        premio: sorteo.premio,
        sorteo_numero: sorteo.numero,
      })
      .select()
      .single();
    if (errW) throw errW;

    sorteo.estado = 'finalizado';
    sorteo.finalizado = now;
    sorteo.ganador = ganador;
    state.winners.unshift(dbWinner(winRow));
    emit();
    return true;
  },

  winners() { return state.winners; },
  sorteos() { return state.sorteos || []; },
  sorteoLabel: pad3,
  activeSorteo() { return (state.sorteos || []).find((s) => s.estado === 'activo') || null; },

  async cancelSorteo() {
    const sorteo = this.activeSorteo();
    if (!sorteo) return false;
    const now = new Date().toISOString();
    const { error } = await supabase.from('sorteos')
      .update({ estado: 'cancelado', cancelado: now, ganador: null })
      .eq('id', sorteo.id);
    if (error) throw error;
    sorteo.estado = 'cancelado';
    sorteo.cancelado = now;
    sorteo.ganador = null;
    emit();
    return true;
  },

  async createSorteo(data) {
    if (this.activeSorteo()) {
      return { error: 'Ya existe un sorteo activo. Finalizalo registrando un ganador antes de crear uno nuevo.' };
    }
    const specs = (Array.isArray(data.specs) ? data.specs : String(data.specs || '').split('\n'))
      .map((s) => s.trim()).filter(Boolean);

    const { data: inserted, error } = await supabase
      .from('sorteos')
      .insert({
        premio: (data.premio || '').trim(),
        valor_premio: Number(data.valorPremio) || 0,
        subtitulo: (data.subtitulo || '').trim(),
        specs: specs.length ? specs : [],
        fecha_sorteo: data.fechaSorteo,
        imagen_url: data.imagenUrl || null,
        estado: 'activo',
        ganador: null,
      })
      .select()
      .single();

    if (error) return { error: error.message };

    const sorteo = dbSorteo(inserted);
    state.sorteos.unshift(sorteo);
    emit();
    return { sorteo };
  },

  maskPhone,
};

export default SorteoStore;
