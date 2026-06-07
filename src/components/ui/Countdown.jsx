import { useState, useEffect } from 'react';

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  const d = Math.floor(ms / 864e5);
  const h = Math.floor((ms % 864e5) / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  const s = Math.floor((ms % 6e4) / 1e3);
  return { d, h, m, s, done: ms === 0 };
}

export function useCountdown(target) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

export default function Countdown({ target, compact }) {
  const t = useCountdown(target);
  const cell = (v, l) => (
    <div className="col" style={{ alignItems: 'center', minWidth: compact ? 38 : 'clamp(34px, 12vw, 60px)' }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontWeight: 700,
        fontSize: compact ? 22 : 'clamp(19px, 6.4vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(v).padStart(2, '0')}
      </span>
      <span style={{
        fontSize: compact ? 9.5 : 'clamp(8.5px, 2.4vw, 11px)', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--muted)', marginTop: 6, whiteSpace: 'nowrap',
      }}>
        {l}
      </span>
    </div>
  );
  const sep = (
    <span style={{
      fontFamily: 'var(--font-mono)', fontWeight: 600,
      fontSize: compact ? 18 : 'clamp(14px, 4.8vw, 26px)', color: 'var(--line-2)',
      alignSelf: 'flex-start', marginTop: compact ? 0 : 2,
    }}>:</span>
  );
  return (
    <div className="row" style={{ gap: compact ? 8 : 'clamp(5px, 2.2vw, 14px)', alignItems: 'flex-start' }}>
      {cell(t.d, 'Días')}{sep}{cell(t.h, 'Hrs')}{sep}{cell(t.m, 'Min')}{sep}{cell(t.s, 'Seg')}
    </div>
  );
}
