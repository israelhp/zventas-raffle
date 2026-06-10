import { useState } from 'react';
import SorteoStore from '../../store/sorteoStore';
import Icon from '../ui/Icon';
import SectionHead from './SectionHead';
import { CouponTicketModal } from './CouponTicket';

function ResultCard({ p, onSelect }) {
  const conf = p.estado === 'confirmado';
  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div className="col gap-2">
          <h3 style={{ fontSize: 18 }}>{p.nombre}</h3>
        </div>
        <span className={'chip ' + (conf ? 'ok' : 'warn')}>
          <i className="dot"></i> {conf ? 'Confirmado' : 'Validación pendiente'}
        </span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
        {p.coupons.length} {p.coupons.length === 1 ? 'cupón' : 'cupones'}
      </span>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
        {p.coupons.map((c) => (
          <button key={c} className="coupon-chip" onClick={() => onSelect(c)} title="Ver detalle del cupón">
            <span className="coupon-code" style={{ fontSize: 17 }}>{c}</span>
            <Icon name="arrow" size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SearchSection() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);

  async function run(e) {
    e?.preventDefault();
    if (!q.trim()) return;
    setSearching(true);
    const data = await SorteoStore.searchByName(q);
    setResults(data);
    setSearched(true);
    setSearching(false);
  }

  return (
    <div>
      <SectionHead kicker="Mis cupones" title="Buscá tus cupones" />
      <p style={{ fontSize: 15, color: 'var(--ink-2)', fontWeight: 500, marginTop: -12, marginBottom: 20 }}>
        Escribí tu nombre o número de teléfono.
      </p>

      <form className="row gap-3" onSubmit={run} style={{ marginBottom: 24, flexWrap: 'wrap', maxWidth: 620 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Icon name="search" size={19} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 44 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ej. María Castillo"
          />
        </div>
        <button className="btn btn-primary" type="submit" style={{ padding: '13px 26px' }} disabled={searching}>
          {searching ? <Icon name="refresh" size={18} className="spin" /> : 'Buscar'}
        </button>
      </form>

      {searched && results && results.length === 0 && (
        <div className="card" style={{ padding: 36, textAlign: 'center', maxWidth: 620 }}>
          <h3 style={{ fontSize: 18, marginBottom: 6 }}>Sin resultados</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>
            No encontramos cupones con "{q}". Revisá el dato o registrate arriba.
          </p>
        </div>
      )}

      {searched && results && results.length > 0 && (
        <div className="col gap-4" style={{ maxWidth: 760 }}>
          <span style={{ fontSize: 13.5, color: 'var(--muted)', fontWeight: 600 }}>
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'} · tocá un cupón para ver su detalle
          </span>
          {results.map((p) => (
            <ResultCard key={p.id} p={p} onSelect={(code) => setSelected({ code, participant: p })} />
          ))}
        </div>
      )}

      {selected && <CouponTicketModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
