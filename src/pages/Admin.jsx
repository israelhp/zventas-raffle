import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Icon from '../components/ui/Icon';
import Field from '../components/ui/Field';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function Admin({ go }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthed(true);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) {
      setErr('Credenciales incorrectas. Verificá tu correo y contraseña.');
    } else {
      setAuthed(true);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setAuthed(false);
    setEmail('');
    setPass('');
  }

  if (checking) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Icon name="refresh" size={28} className="spin" style={{ color: 'var(--brand)' }} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="wrap anim-up" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 440 }}>
        <div className="card anim-pop" style={{ padding: 'clamp(26px, 4vw, 38px)' }}>
          <div style={{
            width: 58, height: 58, borderRadius: 15,
            background: 'var(--brand-soft)', color: 'var(--brand-ink)',
            display: 'grid', placeItems: 'center', marginBottom: 18,
          }}>
            <Icon name="lock" size={28} />
          </div>
          <h2 style={{ fontSize: 24, marginBottom: 6 }}>Panel del sorteo</h2>
          <p style={{ fontSize: 14.5, color: 'var(--ink-2)', fontWeight: 500, marginBottom: 24 }}>
            Acceso solo para administradores.
          </p>
          <form className="col gap-4" onSubmit={login}>
            <Field label="Correo electrónico" error={err ? ' ' : null}>
              <input
                className="input"
                type="email"
                value={email}
                autoFocus
                onChange={(e) => { setEmail(e.target.value); setErr(''); }}
                placeholder="admin@correo.com"
              />
            </Field>
            <Field label="Contraseña" error={err || null}>
              <input
                className={'input' + (err ? ' err' : '')}
                type="password"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setErr(''); }}
                placeholder="••••••••"
              />
            </Field>
            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
              {loading
                ? <><Icon name="refresh" size={18} className="spin" /> Entrando…</>
                : <><Icon name="lock" size={18} /> Entrar</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard go={go} onLogout={logout} />;
}
