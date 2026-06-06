import { useState, useEffect } from 'react';
import SorteoStore from './store/sorteoStore';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Icon from './components/ui/Icon';

const BRANDS = {
  Dorado: ['#c6a24c', '#a8842f'],
  Champán: ['#d6c187', '#b89e5a'],
  Bronce: ['#b3823f', '#8f6330'],
  Grafito: ['#3a3833', '#26241f'],
};

function applyBrand(name) {
  const p = BRANDS[name] || BRANDS.Dorado;
  const r = document.documentElement.style;
  r.setProperty('--brand', p[0]);
  r.setProperty('--brand-strong', p[1]);
}

export default function App() {
  const [route, setRoute] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('zvs_theme') || 'dark');
  const [ready, setReady] = useState(false);

  const toggleTheme = () => setTheme((m) => (m === 'dark' ? 'light' : 'dark'));

  const go = (target) => {
    if (target === 'buscar') {
      setRoute('home');
      setTimeout(() => {
        const el = document.getElementById('buscar');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }, 60);
      return;
    }
    setRoute(target);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => { applyBrand('Dorado'); }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zvs_theme', theme);
  }, [theme]);

  useEffect(() => {
    SorteoStore.init().then(() => setReady(true));
  }, []);

  const isAdmin = route === 'admin';

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: 'var(--bg)',
      }}>
        <div className="col" style={{ alignItems: 'center', gap: 16 }}>
          <Icon name="refresh" size={32} className="spin" style={{ color: 'var(--brand)' }} />
          <span style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 600 }}>Cargando sorteo…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav route={route} go={go} theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1 }}>
        {route === 'home' && <Home />}
        {route === 'admin' && <Admin go={go} />}
      </main>
      {!isAdmin && <Footer go={go} />}
    </div>
  );
}
