import Icon from '../ui/Icon';
import Logo from '../ui/Logo';

export default function Footer({ go }) {
  return (
    <footer style={{ background: 'var(--black)', color: 'oklch(0.85 0.01 90)', marginTop: 20 }}>
      <div className="wrap" style={{ paddingTop: 44, paddingBottom: 34 }}>
        <div className="footer-grid">
          <div className="col gap-4" style={{ maxWidth: 320 }}>
            <Logo dark={true} />
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'oklch(0.72 0.01 262)', fontWeight: 500 }}>
              Sorteos transparentes de audio y accesorios para tu carro. Cada cupón apoya un sorteo justo y verificable.
            </p>
          </div>
          <div className="footer-links">
            <div className="col gap-3">
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.6 0.01 262)' }}>
                Sorteo
              </span>
              {[['home', 'Inicio'], ['buscar', 'Buscar mis cupones'], ['admin', 'Panel admin']].map(([id, l]) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  style={{ background: 'none', border: 'none', color: 'oklch(0.82 0.01 262)', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: 0, cursor: 'pointer' }}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="col gap-3">
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.6 0.01 262)' }}>
                Contacto
              </span>
              <span className="row gap-2" style={{ fontSize: 14, color: 'oklch(0.82 0.01 262)', fontWeight: 600 }}>
                <Icon name="whatsapp" size={16} /> 4622-7332
              </span>
              <span className="row gap-2" style={{ fontSize: 14, color: 'oklch(0.82 0.01 262)', fontWeight: 600 }}>
                <Icon name="pin" size={16} /> Ciudad de Guatemala
              </span>
            </div>
          </div>
        </div>
        <div className="row" style={{
          justifyContent: 'center', marginTop: 36, paddingTop: 22,
          borderTop: '1px solid oklch(0.34 0.02 262)',
        }}>
          <span style={{ fontSize: 12.5, color: 'oklch(0.6 0.01 262)', fontWeight: 500 }}>
            © 2026 Zona de Ventas Sorteos
          </span>
        </div>
      </div>
    </footer>
  );
}
