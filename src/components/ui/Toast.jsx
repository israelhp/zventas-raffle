import { useState } from 'react';
import Icon from './Icon';

export function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2200); };
  const node = msg ? (
    <div className="anim-pop" style={{
      position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink)', color: '#fff', padding: '12px 20px',
      borderRadius: 'var(--r-pill)', fontSize: 14, fontWeight: 600,
      zIndex: 400, boxShadow: 'var(--sh-3)', display: 'flex', alignItems: 'center', gap: 9,
    }}>
      <Icon name="check" size={16} /> {msg}
    </div>
  ) : null;
  return [node, show];
}
