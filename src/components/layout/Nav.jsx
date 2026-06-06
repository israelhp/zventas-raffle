import Logo from '../ui/Logo';
import Icon from '../ui/Icon';

export default function Nav({ route, go, theme, toggleTheme }) {
  const dark = theme === 'dark';
  const onAdmin = route === 'admin';

  const navLabel = onAdmin ? 'Regresar' : 'Admin';
  const navIcon = onAdmin ? 'arrowLeft' : 'lock';
  const navAction = onAdmin ? () => go('home') : () => go('admin');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: dark ? 'oklch(0.17 0.005 80 / 0.92)' : 'oklch(1 0 0 / 0.85)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid ' + (dark ? 'oklch(0.30 0.01 80)' : 'var(--line)'),
    }}>
      <div className="wrap row" style={{ height: 68, justifyContent: 'space-between' }}>
        <Logo onClick={() => go('home')} dark={dark} />
        <div className="row gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title={dark ? 'Tema claro' : 'Tema oscuro'}
            style={{
              width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center',
              background: 'transparent',
              border: '1px solid ' + (dark ? 'oklch(0.4 0.01 80)' : 'var(--line-2)'),
              color: 'var(--brand-ink)',
            }}
          >
            <Icon name={dark ? 'sun' : 'moon'} size={18} />
          </button>
          <button
            className="btn"
            style={{
              padding: '10px 16px', fontSize: 14, background: 'transparent',
              border: '1px solid var(--brand)', color: 'var(--brand-ink)',
            }}
            onClick={navAction}
          >
            <Icon name={navIcon} size={16} />
            {navLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
