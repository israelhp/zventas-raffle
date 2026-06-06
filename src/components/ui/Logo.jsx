export default function Logo({ size = 'md', onClick, dark }) {
  const imgH = size === 'lg' ? 44 : 34;
  return (
    <div className="row gap-3" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <img
        src={dark ? '/logo-golden.png' : '/logo-black.png'}
        alt="Zona de Ventas GT"
        style={{ height: imgH, width: 'auto', display: 'block', flex: '0 0 auto' }}
      />
      <div className="col" style={{ lineHeight: 1.04 }}>
        <span style={{
          fontFamily: 'var(--font-disp)', fontWeight: 700,
          fontSize: size === 'lg' ? 20 : 17, letterSpacing: '-0.02em',
          color: dark ? '#fff' : 'var(--ink)',
        }}>
          Zona de Ventas
        </span>
        <span style={{
          fontSize: size === 'lg' ? 12.5 : 11, fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--brand)',
        }}>
          Sorteos
        </span>
      </div>
    </div>
  );
}
