import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Volume2, VolumeX, RotateCcw, SkipForward, Play, Pause } from 'lucide-react';
import { cin } from '../audio/cinematicAudio';

const TOTAL_DURATION = 14;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const prog = (t, a, b) => clamp01((t - a) / (b - a));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const fade = (t, a, b, c, d) => Math.min(prog(t, a, b), 1 - prog(t, c, d));
const lerp = (a, b, k) => a + (b - a) * k;
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (c1, c2, k) => {
  const a = hex2rgb(c1);
  const b = hex2rgb(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`;
};
const fmtTime = (s) => `00:${String(Math.floor(s)).padStart(2, '0')}`;
const fx = (name, ...args) => {
  try {
    cin?.[name]?.(...args);
  } catch (e) {
    /* audio is optional */
  }
};

// cinematic scene transition: push in on entry (1.07 → 1), ease out on exit (1 → 0.94)
const zoomXf = (t, a, b, c, d) => {
  const sc = lerp(1.07, 1, easeOut(prog(t, a, b))) * lerp(1, 0.94, easeInOut(prog(t, c, d)));
  return `translate(960 540) scale(${sc}) translate(-960 -540)`;
};
// colour grade that glides from one chapter colour to the next
const TINTS = [[0, '#54D7E8'], [1.2, '#54D7E8'], [3.5, '#FF875F'], [6.0, '#82F2FF'], [9.0, '#D8F36A'], [12.0, '#54D7E8']];
const tintAt = (t) => {
  for (let i = TINTS.length - 1; i >= 0; i--) {
    if (t >= TINTS[i][0]) {
      const prev = TINTS[Math.max(0, i - 1)][1];
      return mix(prev, TINTS[i][1], easeInOut(prog(t, TINTS[i][0], TINTS[i][0] + 0.8)));
    }
  }
  return TINTS[0][1];
};

// deterministic random → identical particles on every run
const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rand = rng(20261018);
const STARS = Array.from({ length: 110 }, () => ({ x: rand() * 1920, y: rand() * 1080, r: 0.6 + rand() * 1.8, sp: 0.6 + rand() * 2, ph: rand() * 6.28 }));
const DUST = Array.from({ length: 36 }, () => ({ x: rand() * 1920, y: rand() * 1080, r: 2 + rand() * 5, sp: 8 + rand() * 22, ph: rand() * 6.28, c: ['#54D7E8', '#D8F36A', '#FF875F'][Math.floor(rand() * 3)] }));
const DROPS = Array.from({ length: 46 }, () => ({ x: rand() * 1920, sp: 1100 + rand() * 700, off: rand() * 1300, len: 50 + rand() * 50 }));
const RIPPLES = Array.from({ length: 10 }, () => ({ x: rand() * 1920, per: 0.9 + rand() * 0.8, off: rand() * 2 }));
const r2 = rng(424242);
const EMBERS = Array.from({ length: 26 }, () => ({ x: 560 + r2() * 800, sp: 0.12 + r2() * 0.22, off: r2(), r: 2 + r2() * 4, sw: 10 + r2() * 30, ph: r2() * 6.28 }));
const BOKEH = Array.from({ length: 16 }, () => ({ x: (r2() - 0.5) * 1800, y: (r2() - 0.5) * 900, r: 18 + r2() * 60, sp: 0.1 + r2() * 0.25, ph: r2() * 6.28, c: ['#54D7E8', '#D8F36A', '#82F2FF'][Math.floor(r2() * 3)] }));
const FAR_DROPS = Array.from({ length: 70 }, () => ({ x: r2() * 1920, sp: 700 + r2() * 400, off: r2() * 1300, len: 24 + r2() * 24 }));
const SPLASH = Array.from({ length: 16 }, () => ({ x: 80 + r2() * 1760, per: 0.45 + r2() * 0.6, off: r2() * 2, w: 14 + r2() * 20 }));
const FOG = Array.from({ length: 6 }, () => ({ x: 200 + r2() * 1520, w: 360 + r2() * 300, ph: r2() * 6.28 }));
const BUBBLES = Array.from({ length: 12 }, () => ({ a: r2() * 6.28, rr: 0.15 + r2() * 0.6, r: 4 + r2() * 9, sp: 0.3 + r2() * 0.6 }));
const CITY = (() => {
  const b = [];
  let x = -30;
  while (x < 1950) {
    const w = 70 + r2() * 100;
    const h = 130 + r2() * 320;
    const cols = Math.max(1, Math.floor((w - 18) / 24));
    const rows = Math.max(1, Math.floor((h - 24) / 38));
    const win = [];
    for (let ci = 0; ci < cols; ci++) for (let ri = 0; ri < rows; ri++) if (r2() < 0.22) win.push({ x: 12 + ci * 24, y: 16 + ri * 38, hot: r2() < 0.35 });
    b.push({ x, w, h, win, stack: r2() < 0.18 });
    x += w + 6 + r2() * 14;
  }
  return b;
})();
const STACKS = CITY.filter((b) => b.stack);
const SMOG = Array.from({ length: 7 }, () => ({ x: 300 + rand() * 1320, y: 300 + rand() * 420, r: 130 + rand() * 140, ph: rand() * 6.28 }));

const MILESTONES = [
  { k: 'amb', t: 0.02, fn: 'startAmbient' },
  { k: 'm0', t: 0.05, fn: 'setMood', args: [0] },
  { k: 'boot', t: 0.1, fn: 'boot' },
  { k: 'heat', t: 1.0, fn: 'heat' },
  { k: 'm1', t: 1.2, fn: 'setMood', args: [1] },
  { k: 'spark', t: 1.3, fn: 'spark' },
  { k: 'break', t: 2.0, fn: 'bondBreak' },
  { k: 'bond1', t: 3.05, fn: 'bond' },
  { k: 'm2', t: 3.5, fn: 'setMood', args: [2] },
  { k: 'hit1', t: 3.5, fn: 'chapterHit' },
  { k: 'whoosh', t: 3.55, fn: 'whoosh' },
  { k: 'smog', t: 4.1, fn: 'smogSwell' },
  { k: 'bond2', t: 4.9, fn: 'bond' },
  { k: 'crackle', t: 5.0, fn: 'crackle' },
  { k: 'm3', t: 6.0, fn: 'setMood', args: [3] },
  { k: 'hit2', t: 6.0, fn: 'chapterHit' },
  { k: 'pop', t: 6.1, fn: 'pop' },
  { k: 'bubbles', t: 6.4, fn: 'bubbles' },
  { k: 'absorb', t: 6.9, fn: 'absorb' },
  { k: 'convert', t: 7.9, fn: 'convert' },
  { k: 'chime', t: 8.6, fn: 'chime' },
  { k: 'm4', t: 9.0, fn: 'setMood', args: [4] },
  { k: 'thunder', t: 9.1, fn: 'thunder' },
  { k: 'ion', t: 9.7, fn: 'ionSplit' },
  { k: 'rain', t: 9.8, fn: 'startRain' },
  { k: 'beat', t: 10.0, fn: 'pulse', args: [true, 66, 124, 2] },
  { k: 'warn', t: 10.9, fn: 'warn' },
  { k: 'riser', t: 10.95, fn: 'riser', args: [1.05] },
  { k: 'm5', t: 12.0, fn: 'setMood', args: [5] },
  { k: 'beatoff', t: 12.0, fn: 'pulse', args: [false] },
  { k: 'finale', t: 12.0, fn: 'finale' },
  { k: 'rainoff', t: 12.1, fn: 'stopRain', args: [1.2] },
  { k: 'shimmer', t: 12.6, fn: 'shimmer' },
  { k: 'out', t: 13.2, fn: 'fadeOut' },
];
const freshFlags = () => Object.fromEntries(MILESTONES.map((m) => [m.k, false]));
const moodAt = (t) => (t >= 12 ? 5 : t >= 9 ? 4 : t >= 6 ? 3 : t >= 3.5 ? 2 : t >= 1.2 ? 1 : 0);

// full-screen light flashes synced with the audio hits: [time, strength, colour, decay]
const FLASHES = [[2.0, 0.3, '#9FE8F5', 9], [8.0, 0.22, '#D8F36A', 8], [9.05, 0.5, '#DFF6FF', 12], [9.4, 0.3, '#DFF6FF', 12], [12.0, 0.35, '#FFFFFF', 9], [3.5, 0.12, '#FF875F', 9], [4.9, 0.18, '#FF875F', 9], [6.0, 0.14, '#BFEFFF', 9]];
const flashOf = (t, f) => (t >= f[0] && t < f[0] + 0.6 ? f[1] * Math.exp(-(t - f[0]) * f[3]) : 0);
const lightning = (t) => flashOf(t, FLASHES[2]) + flashOf(t, FLASHES[3]);
// camera shake on impacts: [time, amplitude]
const shakeAt = (t) =>
  [[2.0, 14], [3.5, 4], [4.9, 6], [6.0, 5], [8.0, 10], [9.05, 8], [12.0, 16]].reduce((s, [t0, a]) => {
    const d = t - t0;
    return d >= 0 && d < 1 ? s + a * Math.exp(-d * 7) * Math.sin(d * 55) : s;
  }, 0);

const CHAPTERS = [
  { tag: '01', name: 'Tia lửa', a: 1.2, b: 3.5, color: '#54D7E8', eq: 'N₂ + O₂ → 2NO', text: 'Nhiệt độ > 1200 °C: Tia lửa động cơ phá vỡ liên kết N≡N → Tạo khí NO' },
  { tag: '02', name: 'Oxy hóa', a: 3.5, b: 6.0, color: '#FF875F', eq: '2NO + O₂ → 2NO₂', text: 'Oxy hóa trong khí quyển: 2NO + O₂ → 2NO₂ (Khí màu nâu đỏ)' },
  { tag: '03', name: 'Hòa tan', a: 6.0, b: 9.0, color: '#82F2FF', eq: '4NO₂ + O₂ + 2H₂O → 4HNO₃', text: 'NO₂ hòa tan trong giọt mây: 4NO₂ + O₂ + 2H₂O → 4HNO₃ (Axit Nitric)' },
  { tag: '04', name: 'Mưa axit', a: 9.0, b: 12.0, color: '#D8F36A', eq: 'HNO₃ → H⁺ + NO₃⁻', text: 'Mưa axit rơi xuống: Phân ly giải phóng ion H⁺ (pH < 5,6) tàn phá môi trường' },
];

const COL = {
  N: { rim: '#54D7E8', g: 'cin-gN', glow: 'cin-glow-cyan' },
  O: { rim: '#FF875F', g: 'cin-gO', glow: 'cin-glow-coral' },
  H: { rim: '#D8F36A', g: 'cin-gH', glow: 'cin-glow-lime' },
};

function Atom({ x, y, r, type, label, fs, s = 1, o = 1, orbit = 0, t = 0 }) {
  if (o <= 0.01 || s <= 0.01) return null;
  const c = COL[type];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle r={r * 2.1} fill={`url(#${c.glow})`} opacity="0.55" />
      <circle r={r} fill={`url(#${c.g})`} stroke={c.rim} strokeWidth="3" />
      <ellipse cx={r * 0.28} cy={r * 0.55} rx={r * 0.42} ry={r * 0.14} fill={c.rim} opacity="0.2" />
      <ellipse cx={-r * 0.32} cy={-r * 0.42} rx={r * 0.3} ry={r * 0.17} fill="#fff" opacity="0.38" transform={`rotate(-30 ${-r * 0.32} ${-r * 0.42})`} />
      {orbit > 0 && (
        <g>
          <ellipse rx={r * 1.55} ry={r * 0.6} fill="none" stroke={c.rim} strokeOpacity="0.35" strokeWidth="1.5" transform="rotate(-25)" />
          {Array.from({ length: orbit }).map((_, i) => {
            const a = t * 3 + (i * Math.PI * 2) / orbit;
            const ex = Math.cos(a) * r * 1.55;
            const ey = Math.sin(a) * r * 0.6;
            const rot = (-25 * Math.PI) / 180;
            return <circle key={i} cx={ex * Math.cos(rot) - ey * Math.sin(rot)} cy={ex * Math.sin(rot) + ey * Math.cos(rot)} r="6" fill="#fff" />;
          })}
        </g>
      )}
      {label && (
        <text y={(fs || r * 0.85) * 0.35} textAnchor="middle" fill="#fff" fontSize={fs || r * 0.85} fontWeight="800">
          {label}
        </text>
      )}
    </g>
  );
}

function Bond({ x1, y1, x2, y2, n = 1, o = 1, w = 7, color = '#DCE6F0' }) {
  if (o <= 0.01) return null;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  return (
    <g opacity={o} stroke={color} strokeLinecap="round" strokeWidth={n > 1 ? w * 0.62 : w}>
      {Array.from({ length: n }).map((_, i) => {
        const off = (i - (n - 1) / 2) * 14;
        return <line key={i} x1={x1 + nx * off} y1={y1 + ny * off} x2={x2 + nx * off} y2={y2 + ny * off} />;
      })}
    </g>
  );
}

function MiniNO2({ x, y, s, o }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Bond x1={0} y1={-6} x2={-26} y2={16} w={5} />
      <Bond x1={0} y1={-6} x2={26} y2={16} w={5} />
      <Atom x={-26} y={16} r={15} type="O" />
      <Atom x={26} y={16} r={15} type="O" />
      <Atom x={0} y={-6} r={18} type="N" />
    </g>
  );
}

function H2O({ x, y, o }) {
  return (
    <g opacity={o}>
      <Bond x1={x} y1={y} x2={x - 24} y2={y + 20} w={4} />
      <Bond x1={x} y1={y} x2={x + 24} y2={y + 20} w={4} />
      <Atom x={x - 24} y={y + 20} r={11} type="H" />
      <Atom x={x + 24} y={y + 20} r={11} type="H" />
      <Atom x={x} y={y} r={20} type="O" />
    </g>
  );
}

const BURSTS = Array.from({ length: 36 }, () => ({ a: rand() * 6.283, v: 120 + rand() * 520, r: 2 + rand() * 5, l: 0.7 + rand() * 0.9 }));

// radial particle burst, replays deterministically from t0
function Burst({ t, t0, x, y, n = 28, color = '#fff', g = 380, scale = 1 }) {
  const dt = t - t0;
  if (dt < 0 || dt > 1.8) return null;
  return (
    <g fill={color}>
      {BURSTS.slice(0, n).map((b, i) => {
        const life = dt / b.l;
        if (life >= 1) return null;
        const px = x + Math.cos(b.a) * b.v * dt * (1 - dt * 0.35) * scale;
        const py = y + Math.sin(b.a) * b.v * dt * (1 - dt * 0.35) * scale + 0.5 * g * dt * dt;
        return <circle key={i} cx={px} cy={py} r={b.r * (1 - life * 0.6)} opacity={(1 - life) * 0.95} />;
      })}
    </g>
  );
}

// slowly rotating light shafts
function Rays({ cx, cy, t, o, n = 14, len = 1200 }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${t * 6})`} opacity={o} style={{ mixBlendMode: 'screen' }}>
      {Array.from({ length: n }).map((_, i) => {
        const w = 18 + (i % 3) * 10;
        return <polygon key={i} points={`0,0 ${len},${-w} ${len},${w}`} fill="url(#cin-ray)" opacity={0.35 + (i % 3) * 0.2} transform={`rotate(${(i / n) * 360})`} />;
      })}
    </g>
  );
}

// anamorphic lens streak
function Flare({ x, y, o, w = 1100, color = '#BFEFFF' }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o} style={{ mixBlendMode: 'screen' }}>
      <ellipse rx={w / 2} ry="6" fill={color} />
      <ellipse rx={w / 5} ry="18" fill={color} opacity="0.6" />
      <circle r="34" fill="#fff" />
    </g>
  );
}

/* static layers: memoised, animated by CSS only → React never re-renders them per frame */
const StarField = memo(function StarField() {
  return (
    <g fill="#BFEFFF">
      {STARS.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} className="cin-star" style={{ animationDuration: `${(6.28 / st.sp).toFixed(2)}s`, animationDelay: `${(-st.ph).toFixed(2)}s` }} />
      ))}
    </g>
  );
});

const DustField = memo(function DustField() {
  return (
    <g>
      {DUST.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={1160}
          r={d.r}
          fill={d.c}
          className="cin-dust"
          style={{ '--sx': `${Math.sin(d.ph) * 60}px`, animationDuration: `${(1260 / d.sp).toFixed(1)}s`, animationDelay: `${(-(d.y / 1080) * (1260 / d.sp)).toFixed(1)}s` }}
        />
      ))}
    </g>
  );
});

const Skyline = memo(function Skyline() {
  return (
    <g>
      {CITY.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${1000 - b.h})`}>
          <rect width={b.w} height={b.h + 90} fill="#091827" stroke="#143245" strokeWidth="1.5" />
          {b.stack && <rect x={b.w * 0.7} y="-70" width="16" height="72" fill="#0D2234" />}
          {b.win.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width="10" height="16" rx="1.5" fill={w.hot ? '#FFB36A' : '#54D7E8'} opacity={w.hot ? 0.55 : 0.25} />
          ))}
        </g>
      ))}
    </g>
  );
});

// 0 → 1.3 s: boot-up ring before the story starts
function Scene0({ t }) {
  const op = fade(t, 0, 0.3, 0.95, 1.3);
  if (op <= 0.01) return null;
  const k = easeInOut(prog(t, 0.05, 1.05));
  const a = Math.min(k, 0.999) * Math.PI * 2;
  const R = 130;
  const ex = Math.cos(a - Math.PI / 2) * R;
  const ey = Math.sin(a - Math.PI / 2) * R;
  const lw = 620 * easeOut(prog(t, 0.05, 0.8));
  return (
    <g opacity={op} transform="translate(960 520)">
      <circle r={R * 2.6} fill="url(#cin-glow-cyan)" opacity={0.18 + 0.1 * Math.sin(t * 8)} />
      <circle r={R} fill="none" stroke="#1E3A4D" strokeWidth="4" />
      <path d={`M 0 ${-R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${ex} ${ey}`} fill="none" stroke="#54D7E8" strokeWidth="6" strokeLinecap="round" />
      <circle cx={ex} cy={ey} r="9" fill="#fff" />
      <text y="14" textAnchor="middle" fill="#F4F7FA" fontSize="42" fontWeight="800">{Math.round(k * 100)}%</text>
      <line x1={-lw} x2={lw} y1="230" y2="230" stroke="#54D7E8" strokeWidth="2" opacity="0.7" />
      <text y="285" textAnchor="middle" fill="#54D7E8" fontSize="28" fontWeight="700" letterSpacing="10" opacity={prog(t, 0.2, 0.6)}>KHỞI ĐỘNG BẦU KHÍ QUYỂN</text>
      <text y="-210" textAnchor="middle" fill="#94A3B8" fontSize="24" letterSpacing="6" opacity={prog(t, 0.3, 0.7)}>NHÓM 2 · HÓA HỌC &amp; MÔI TRƯỜNG</text>
    </g>
  );
}

// heat haze + rising embers behind the nitrogen molecule
function Chamber({ t, f }) {
  return (
    <g>
      <circle cx="960" cy="560" r={260 + 220 * f} fill="url(#cin-glow-heat)" opacity={0.15 + 0.5 * f + 0.05 * Math.sin(t * 9)} />
      {EMBERS.map((e, i) => {
        const p = (t * e.sp + e.off) % 1;
        return <circle key={i} cx={e.x + Math.sin(t * 2 + e.ph) * e.sw} cy={820 - p * 560} r={e.r * (1 - p * 0.5)} fill={p < 0.5 ? '#FFD36A' : '#FF875F'} opacity={f * (1 - p) * 0.8} />;
      })}
    </g>
  );
}

/* ───────────────────────── scenes ───────────────────────── */
function Scene1({ t }) {
  const op = fade(t, 1.0, 1.5, 3.5, 4.0);
  if (op <= 0.01) return null;
  const Y = 560;
  const split = easeOut(prog(t, 2.0, 3.0));
  const dist = 80 + split * 215;
  const pop = easeBack(prog(t, 1.0, 1.6));
  const f = easeOut(prog(t, 1.0, 2.2));
  const flick = Math.sin(t * 70) > -0.3 ? 1 : 0.35;
  const arrive = easeOut(prog(t, 2.4, 3.1));
  const oL = lerp(140, 960 - dist - 100, arrive);
  const oR = lerp(1780, 960 + dist + 100, arrive);
  const oO = prog(t, 2.3, 2.7);
  const bondNO = prog(t, 3.0, 3.3);
  const flash = fade(t, 1.8, 2.0, 2.05, 2.5);
  return (
    <g opacity={op} transform={zoomXf(t, 1.0, 1.5, 3.5, 4.0)}>
      <Chamber t={t} f={f} />
      {/* thermometer */}
      <g>
        <rect x="288" y="360" width="24" height="320" rx="12" fill="#07131D" stroke="#54D7E8" strokeWidth="2.5" />
        <rect x="292" y={676 - 312 * f} width="16" height={312 * f} rx="8" fill="url(#cin-thermo)" />
        <circle cx="300" cy="700" r="28" fill="#FF5A3C" stroke="#FFD36A" strokeWidth="3" />
        <text x="300" y="765" textAnchor="middle" fill="#FFD36A" fontSize="36" fontWeight="800">{Math.round(lerp(25, 1200, f))} °C</text>
        <text x="300" y="802" textAnchor="middle" fill="#94A3B8" fontSize="22">Buồng đốt động cơ</text>
      </g>

      {/* spark plug */}
      <g opacity={prog(t, 1.0, 1.4)}>
        <rect x="928" y="232" width="64" height="76" rx="10" fill="#14293A" stroke="#54D7E8" strokeWidth="2.5" />
        <rect x="940" y="246" width="40" height="8" rx="4" fill="#54D7E8" opacity="0.5" />
        <rect x="953" y="308" width="14" height="34" fill="#9FB4C8" />
      </g>
      {t >= 1.3 && t <= 2.3 && (
        <g opacity={flick}>
          <polyline points="960,342 936,396 984,432 944,492 960,512" fill="none" stroke="#54D7E8" strokeWidth="14" strokeOpacity="0.35" strokeLinejoin="round" />
          <polyline points="960,342 936,396 984,432 944,492 960,512" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
        </g>
      )}
      {flash > 0.01 && <circle cx="960" cy={Y} r={140 + 160 * flash} fill="url(#cin-glow-cyan)" opacity={flash} />}

      {/* shockwaves */}
      {[0, 0.28].map((d) => {
        const p = prog(t, 2.0 + d, 3.2 + d);
        return p > 0 && p < 1 ? <circle key={d} cx="960" cy={Y} r={60 + 520 * p} fill="none" stroke="#54D7E8" strokeWidth={5 * (1 - p) + 1} opacity={(1 - p) * 0.7} /> : null;
      })}

      <Burst t={t} t0={2.0} x={960} y={Y} n={36} color="#9FE8F5" />
      <Flare x={960} y={Y} o={fade(t, 1.95, 2.05, 2.1, 2.7)} />

      {/* bonds */}
      <Bond x1={960 - dist} y1={Y} x2={960 + dist} y2={Y} n={3} w={9} o={(1 - prog(t, 2.0, 2.4)) * prog(t, 1.2, 1.6)} color="#82F2FF" />
      <Bond x1={960 - dist} y1={Y} x2={oL} y2={Y} n={2} o={bondNO} />
      <Bond x1={960 + dist} y1={Y} x2={oR} y2={Y} n={2} o={bondNO} />

      {/* atoms */}
      <Atom x={960 - dist} y={Y} r={46} type="N" label="N" s={pop} orbit={2} t={t} />
      <Atom x={960 + dist} y={Y} r={46} type="N" label="N" s={pop} orbit={2} t={t} />
      <Atom x={oL} y={Y} r={40} type="O" label="O" o={oO} />
      <Atom x={oR} y={Y} r={40} type="O" label="O" o={oO} />

      {/* info */}
      <text x="960" y="470" textAnchor="middle" fill="#94A3B8" fontSize="28" opacity={fade(t, 1.5, 1.9, 2.0, 2.3)}>Liên kết ba N≡N · 945 kJ/mol</text>
      <text x="960" y="700" textAnchor="middle" fill="#D8F36A" fontSize="34" fontWeight="800" opacity={prog(t, 3.0, 3.3)}>2 phân tử khí NO</text>
    </g>
  );
}

const L2 = { dx: 119.7, dy: 50.8 };
function Scene2({ t }) {
  const op = fade(t, 3.5, 4.0, 6.0, 6.5);
  if (op <= 0.01) return null;
  const cx = 960;
  const cy = 470;
  const nIn = easeBack(prog(t, 3.5, 4.0));
  const fly = easeInOut(prog(t, 4.0, 4.9));
  const rx = lerp(1580, cx + L2.dx, fly);
  const ry = lerp(250, cy + L2.dy, fly);
  const bondR = prog(t, 4.85, 5.1);
  const join = fade(t, 4.9, 5.0, 5.0, 5.6);
  const smog = 0.15 + 0.5 * prog(t, 4.8, 5.8);
  return (
    <g opacity={op} transform={zoomXf(t, 3.5, 4.0, 6.0, 6.5)}>
      <g opacity={0.55 * prog(t, 3.6, 4.4)}>
        <Skyline />
      </g>
      <g opacity={prog(t, 4.0, 5.2)}>
        {STACKS.flatMap((b) =>
          [0, 1, 2, 3].map((k) => {
            const p = (t * 0.22 + k / 4 + b.x * 0.0013) % 1;
            return <circle key={`${b.x}-${k}`} cx={b.x + b.w * 0.7 + 8 + p * 70 + Math.sin(t + k) * 8} cy={1000 - b.h - 70 - p * 280} r={14 + p * 56} fill="url(#cin-glow-coral)" opacity={(1 - p) * 0.55} />;
          })
        )}
      </g>
      {SMOG.map((s, i) => (
        <circle key={i} cx={s.x + Math.sin(t * 0.6 + s.ph) * 50} cy={s.y + Math.cos(t * 0.5 + s.ph) * 30} r={s.r} fill="url(#cin-glow-coral)" opacity={smog} />
      ))}
      <circle cx={cx} cy={cy + 40} r={250} fill="url(#cin-glow-coral)" opacity={0.2 + 0.35 * prog(t, 4.9, 5.4)} />

      <Bond x1={cx} y1={cy} x2={cx - L2.dx} y2={cy + L2.dy} n={2} />
      <Bond x1={cx} y1={cy} x2={rx} y2={ry} n={1} o={bondR} />

      <Atom x={cx - L2.dx} y={cy + L2.dy} r={40} type="O" label="O" s={nIn} />
      <Atom x={rx} y={ry} r={40} type="O" label="O" o={prog(t, 4.0, 4.3)} />
      <Atom x={cx} y={cy} r={48} type="N" label="N" s={nIn} orbit={2} t={t} />

      <text x={rx + 70} y={ry - 54} fill="#FF875F" fontSize="28" fontWeight="700" opacity={(1 - prog(t, 4.6, 4.9)) * prog(t, 4.1, 4.4)}>½ O₂</text>

      <Burst t={t} t0={4.9} x={cx + L2.dx} y={cy + L2.dy} n={22} color="#FF875F" g={160} scale={0.7} />
      {join > 0.01 && <circle cx={cx + L2.dx} cy={cy + L2.dy} r={40 + 220 * prog(t, 4.9, 5.6)} fill="none" stroke="#FF875F" strokeWidth="6" opacity={join} />}

      {/* radical dot, oxidation state, angle */}
      <g opacity={prog(t, 5.1, 5.5)}>
        <circle cx={cx} cy={cy - 74} r="7" fill="#fff" />
        <text x={cx + 20} y={cy - 66} fill="#94A3B8" fontSize="22">electron độc thân</text>
        <text x={cx + 58} y={cy - 26} fill="#D8F36A" fontSize="28" fontWeight="800">+4</text>
        <path d={`M ${cx - 64.4} ${cy + 27.3} A 70 70 0 0 0 ${cx + 64.4} ${cy + 27.3}`} fill="none" stroke="#FF875F" strokeWidth="3" strokeDasharray="6 6" />
        <text x={cx} y={cy + 130} textAnchor="middle" fill="#FF875F" fontSize="26" fontWeight="700">∠ONO ≈ 134°</text>
      </g>
      <g opacity={prog(t, 5.3, 5.7)}>
        <rect x={cx - 190} y={cy + 190} width="380" height="54" rx="27" fill="#0D2234" stroke="#FF875F" strokeWidth="2" />
        <text x={cx} y={cy + 226} textAnchor="middle" fill="#FF875F" fontSize="28" fontWeight="800">Khí NO₂ · nâu đỏ</text>
      </g>
    </g>
  );
}

const NO2_START = [[300, 330], [240, 560], [330, 760]];
const NO2_END = [[900, 520], [1030, 520], [965, 615]];
function Scene3({ t }) {
  const op = fade(t, 5.9, 6.4, 9.1, 9.6);
  if (op <= 0.01) return null;
  const C = { x: 960, y: 560 };
  const R = 255;
  const ds = easeBack(prog(t, 6.0, 6.8));
  const breathe = 1 + 0.012 * Math.sin(t * 3);
  const hno = easeBack(prog(t, 8.0, 8.8));
  const h2oOp = prog(t, 6.6, 7.0) * (1 - prog(t, 7.6, 8.0));
  const flash = fade(t, 7.7, 8.0, 8.0, 8.6);
  return (
    <g opacity={op} transform={zoomXf(t, 5.9, 6.4, 9.1, 9.6)}>
      <Rays cx={C.x} cy={C.y} t={t} o={0.9 * prog(t, 7.8, 8.6)} />
      <g transform={`translate(${C.x} ${C.y}) scale(${ds * breathe})`}>
        <circle r={R * 1.35} fill="url(#cin-glow-cyan)" opacity="0.28" />
        <circle r={R} fill="url(#cin-water)" stroke="#54D7E8" strokeWidth="4" />
        <circle r={R - 14} fill="none" stroke="#82F2FF" strokeWidth="1.5" strokeDasharray="4 10" opacity="0.5" transform={`rotate(${t * 9})`} />
        {BUBBLES.map((b, i) => {
          const a = b.a + t * b.sp;
          return <circle key={i} cx={Math.cos(a) * b.rr * R} cy={Math.sin(a * 1.3) * b.rr * R} r={b.r} fill="none" stroke="#BFEFFF" strokeWidth="2" opacity="0.45" />;
        })}
        <path d={`M ${-R * 0.7} ${-R * 0.35} A ${R * 0.78} ${R * 0.78} 0 0 1 ${-R * 0.2} ${-R * 0.75}`} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity="0.35" />
      </g>

      {[0, 1, 2, 3].map((i) => {
        const a = i * 1.57 + t * 0.7;
        const rad = 150 + (i % 2) * 28;
        return <H2O key={i} x={C.x + Math.cos(a) * rad} y={C.y + Math.sin(a) * rad * 0.78 - 10} o={h2oOp * 0.85} />;
      })}

      {NO2_START.map((p, i) => {
        const k = easeInOut(prog(t, 6.4 + i * 0.25, 7.7 + i * 0.1));
        return <MiniNO2 key={i} x={lerp(p[0], NO2_END[i][0], k)} y={lerp(p[1], NO2_END[i][1], k)} s={lerp(1.35, 0.85, k)} o={prog(t, 6.2, 6.5) * (1 - prog(t, 7.7, 8.0))} />;
      })}

      {flash > 0.01 && <circle cx={C.x} cy={C.y} r={120 + 250 * prog(t, 7.7, 8.6)} fill="url(#cin-glow-lime)" opacity={flash * 0.85} />}

      <Burst t={t} t0={8.0} x={C.x} y={C.y} n={32} color="#D8F36A" />
      <Flare x={C.x} y={C.y} o={fade(t, 7.95, 8.05, 8.1, 8.7)} color="#EAFBA8" />
      <g transform={`translate(${C.x} ${C.y}) scale(${hno})`} opacity={prog(t, 8.0, 8.2)}>
        <Bond x1={0} y1={-10} x2={-105} y2={-65} n={2} />
        <Bond x1={0} y1={-10} x2={105} y2={-65} n={1} />
        <Bond x1={0} y1={-10} x2={0} y2={100} n={1} />
        <Bond x1={0} y1={100} x2={62} y2={150} n={1} w={5} />
        <Atom x={-105} y={-65} r={34} type="O" label="O" />
        <Atom x={105} y={-65} r={34} type="O" label="O" />
        <Atom x={0} y={100} r={34} type="O" label="O" />
        <Atom x={62} y={150} r={22} type="H" label="H" fs={20} />
        <Atom x={0} y={-10} r={42} type="N" label="N" orbit={2} t={t} />
      </g>

      <g opacity={prog(t, 8.2, 8.8)} transform={`translate(0 ${lerp(14, 0, easeOut(prog(t, 8.2, 8.8)))})`}>
        <rect x="1300" y="440" width="400" height="240" rx="26" fill="#0D2234" fillOpacity="0.92" stroke="#D8F36A" strokeWidth="2.5" />
        <text x="1500" y="520" textAnchor="middle" fill="#D8F36A" fontSize="52" fontWeight="900" style={{ filter: 'drop-shadow(0 0 10px rgba(216,243,106,.7))' }}>HNO₃</text>
        <text x="1500" y="568" textAnchor="middle" fill="#F4F7FA" fontSize="30" fontWeight="700">Axit nitric</text>
        <text x="1500" y="618" textAnchor="middle" fill="#94A3B8" fontSize="24">Axit mạnh, phân ly hoàn toàn</text>
        <text x="1500" y="652" textAnchor="middle" fill="#94A3B8" fontSize="24">trong nước</text>
      </g>
      <g opacity={prog(t, 6.8, 7.3) * (1 - prog(t, 7.8, 8.2))}>
        <text x="330" y="520" textAnchor="middle" fill="#82F2FF" fontSize="30" fontWeight="700">Giọt mây</text>
        <text x="330" y="556" textAnchor="middle" fill="#94A3B8" fontSize="24">NO₂ khuếch tán vào nước</text>
      </g>
    </g>
  );
}

function Tree({ x, base, h, k, t }) {
  const c = mix('#2E8B57', '#7A5A2E', k);
  return (
    <g transform={`rotate(${Math.sin(t * 1.5 + x) * 1.2} ${x} ${base})`}>
      <rect x={x - 7} y={base - h * 0.22} width="14" height={h * 0.22} fill="#4A3320" />
      {[0, 1, 2].map((j) => {
        const w = h * 0.6 * (1 - j * 0.22);
        const yb = base - h * 0.2 - j * h * 0.26;
        return <polygon key={j} points={`${x},${yb - h * 0.42} ${x - w / 2},${yb} ${x + w / 2},${yb}`} fill={c} />;
      })}
    </g>
  );
}

function Scene4({ t }) {
  const op = fade(t, 8.9, 9.4, 12.0, 12.5);
  if (op <= 0.01) return null;
  const k = prog(t, 10.0, 12.0);
  const sep = easeInOut(prog(t, 9.7, 10.9));
  const ion = easeOut(prog(t, 9.6, 10.4));
  const ph = lerp(7, 4.6, easeInOut(prog(t, 9.8, 11.8)));
  const phY = 280 + ((7 - ph) / 3) * 360;
  return (
    <g opacity={op} transform={zoomXf(t, 8.9, 9.4, 12.0, 12.5)}>
      {/* ground */}
      <rect x="0" y="800" width="1920" height="280" fill="url(#cin-ground)" />
      <line x1="0" y1="800" x2="1920" y2="800" stroke="#1E3A4D" strokeWidth="2" />
      <ellipse cx="960" cy="835" rx="400" ry="40" fill={mix('#1B6F8A', '#7F9A2E', k)} opacity="0.75" stroke="#54D7E8" strokeOpacity="0.5" strokeWidth="2" />
      {[120, 215, 310, 1400, 1495, 1590].map((x, i) => (
        <Tree key={x} x={x} base={805} h={150 + (i % 3) * 24} k={k} t={t} />
      ))}

      {/* storm cloud */}
      <g opacity={prog(t, 8.9, 9.5)}>
        {[[300, 310, 80], [440, 290, 95], [600, 305, 85], [760, 285, 100], [940, 305, 90], [1100, 288, 98], [1260, 306, 86], [1420, 292, 94], [1580, 310, 80]].map(([ccx, ccy, cr], i) => {
          const lit = Math.min(1, lightning(t) * 1.6);
          const px = ccx + Math.sin(t * 0.5 + i) * 14;
          return (
            <g key={i}>
              <circle cx={px} cy={ccy} r={cr} fill={mix('#0F2438', '#7FB2D1', lit)} />
              <circle cx={px} cy={ccy - 14} r={cr * 0.72} fill={mix('#17344D', '#B5D6E8', lit)} opacity="0.7" />
            </g>
          );
        })}
        {((t >= 9.05 && t < 9.25) || (t >= 9.4 && t < 9.5)) && (
          <g>
            <polyline points="560,380 520,450 565,500 505,600 545,660" fill="none" stroke="#54D7E8" strokeWidth="16" strokeOpacity="0.4" strokeLinejoin="round" />
            <polyline points="560,380 520,450 565,500 505,600 545,660" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" />
          </g>
        )}
      </g>

      {/* acid fog hugging the ground */}
      {FOG.map((fg, i) => (
        <ellipse key={i} cx={fg.x + Math.sin(t * 0.4 + fg.ph) * 60} cy={790} rx={fg.w} ry={34} fill="url(#cin-glow-lime)" opacity={0.1 + 0.18 * k} />
      ))}
      {/* far rain layer (depth) */}
      <g clipPath="url(#cin-rain-clip)" stroke="#9FE8F5" strokeWidth="1.2" strokeLinecap="round" opacity={0.28 * prog(t, 9.0, 9.7)}>
        {FAR_DROPS.map((d, i) => {
          const y = ((t * d.sp + d.off) % 1300) - 200;
          return <line key={i} x1={d.x} y1={y} x2={d.x - 9} y2={y + d.len} />;
        })}
      </g>
      {/* rain */}
      <g clipPath="url(#cin-rain-clip)" stroke="#54D7E8" strokeWidth="2.5" strokeLinecap="round" opacity={0.5 * prog(t, 9.0, 9.7)}>
        {DROPS.map((d, i) => {
          const y = ((t * d.sp + d.off) % 1300) - 200;
          return <line key={i} x1={d.x} y1={y} x2={d.x - 16} y2={y + d.len} />;
        })}
      </g>
      {SPLASH.map((sp, i) => {
        const p = ((t + sp.off) % sp.per) / sp.per;
        const o = 0.8 * (1 - p) * prog(t, 9.3, 10.0);
        if (o <= 0.01) return null;
        return (
          <g key={i} opacity={o}>
            <ellipse cx={sp.x} cy={806} rx={4 + sp.w * p} ry={(4 + sp.w * p) * 0.28} fill="none" stroke="#BFEFFF" strokeWidth="2" />
            {[-1, 0, 1].map((m) => (
              <circle key={m} cx={sp.x + m * p * 20} cy={806 - 30 * Math.sin(Math.PI * p) * (m === 0 ? 1.2 : 0.8)} r={2.2 * (1 - p)} fill="#BFEFFF" />
            ))}
          </g>
        );
      })}
      {RIPPLES.map((r, i) => {
        const p = ((t + r.off) % r.per) / r.per;
        return <ellipse key={i} cx={580 + (r.x / 1920) * 760} cy={825 + r.off * 10} rx={6 + 46 * p} ry={(6 + 46 * p) * 0.25} fill="none" stroke="#BFEFFF" strokeWidth="2" opacity={(1 - p) * 0.7} />;
      })}

      <Burst t={t} t0={9.7} x={960} y={470} n={24} color="#D8F36A" g={200} />
      {/* HNO3 → ions */}
      <g opacity={1 - prog(t, 9.6, 10.1)}>
        <rect x="860" y="420" width="200" height="90" rx="45" fill="#0D2234" stroke="#D8F36A" strokeWidth="3" />
        <text x="960" y="482" textAnchor="middle" fill="#D8F36A" fontSize="44" fontWeight="900">HNO₃</text>
      </g>
      <line x1={960 - 320 * sep + 70} y1="470" x2={960 + 320 * sep - 90} y2="470" stroke="#94A3B8" strokeWidth="3" strokeDasharray="8 10" opacity={sep * 0.6} />
      <Atom x={960 - 320 * sep} y={470} r={62} type="H" label="H⁺" fs={42} s={ion} />
      <Atom x={960 + 320 * sep} y={470} r={78} type="N" label="NO₃⁻" fs={36} s={ion} />
      <text x={960 - 320 * sep} y="590" textAnchor="middle" fill="#D8F36A" fontSize="26" fontWeight="800" opacity={prog(t, 10.8, 11.2)}>Gây chua hóa</text>
      <text x={960 + 320 * sep} y="610" textAnchor="middle" fill="#54D7E8" fontSize="26" fontWeight="800" opacity={prog(t, 10.8, 11.2)}>Gốc nitrat</text>

      {/* pH gauge */}
      <g opacity={prog(t, 9.4, 10.0)}>
        <text x="1780" y="250" textAnchor="middle" fill="#F4F7FA" fontSize="24" fontWeight="700">pH nước mưa</text>
        <rect x="1768" y="280" width="24" height="360" rx="12" fill="url(#cin-gauge)" stroke="#1E3A4D" strokeWidth="2" />
        <line x1="1740" y1="448" x2="1820" y2="448" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
        <text x="1732" y="440" textAnchor="end" fill="#94A3B8" fontSize="22">ngưỡng 5,6</text>
        <text x="1732" y="292" textAnchor="end" fill="#94A3B8" fontSize="22">7</text>
        <text x="1732" y="646" textAnchor="end" fill="#94A3B8" fontSize="22">4</text>
        <polygon points={`1760,${phY} 1744,${phY - 11} 1744,${phY + 11}`} fill="#fff" />
        <text x="1780" y="680" textAnchor="middle" fill={ph < 5.6 ? '#FF875F' : '#D8F36A'} fontSize="34" fontWeight="900">{ph.toFixed(1).replace('.', ',')}</text>
      </g>
    </g>
  );
}

function Scene5({ t }) {
  const op = prog(t, 12.0, 12.6);
  if (op <= 0.01) return null;
  const tIn = easeOut(prog(t, 12.1, 12.9));
  const gl = 18 * (1 - prog(t, 12.05, 12.7));
  const lsp = lerp(34, 4, easeOut(prog(t, 12.1, 12.9)));
  return (
    <g transform="translate(960 520)" opacity={op}>
      <circle r={360 + 10 * Math.sin(t * 2)} fill="url(#cin-glow-cyan)" opacity="0.3" />
      {BOKEH.map((b, i) => (
        <circle key={i} cx={b.x + Math.sin(t * b.sp + b.ph) * 40} cy={b.y + Math.cos(t * b.sp * 0.8 + b.ph) * 30} r={b.r} fill={b.c} opacity={0.05 + 0.05 * Math.sin(t * b.sp * 2 + b.ph)} />
      ))}
      <Rays cx={0} cy={0} t={t} o={0.9} />
      <Burst t={t} t0={12.0} x={0} y={0} n={36} color="#54D7E8" scale={1.4} />
      {['NO₂', 'HNO₃', 'H⁺', 'NO₃⁻', 'N₂', 'O₂'].map((s, i) => {
        const a = t * 0.35 + (i / 6) * 6.283;
        const so = prog(t, 12.8 + i * 0.12, 13.4 + i * 0.12) * 0.55;
        return (
          <text key={s} x={Math.cos(a) * 560} y={Math.sin(a) * 300 + 10} textAnchor="middle" fill={['#FF875F', '#D8F36A', '#D8F36A', '#54D7E8', '#54D7E8', '#FF875F'][i]} fontSize="34" fontWeight="800" opacity={so}>
            {s}
          </text>
        );
      })}
      {[0, 0.35, 0.7].map((d) => {
        const p = prog(t, 12.0 + d, 13.6 + d);
        return p > 0 && p < 1 ? <circle key={d} r={100 + 620 * p} fill="none" stroke="#54D7E8" strokeWidth="3" opacity={(1 - p) * 0.5} /> : null;
      })}
      <g opacity={prog(t, 12.1, 12.7)} transform={`translate(0 ${lerp(40, 0, tIn)}) scale(${lerp(1.1, 1, tIn)})`}>
        {gl > 0.3 && (
          <>
            <text x={-gl} y="-40" textAnchor="middle" fill="#FF4D6D" fontSize="96" fontWeight="900" letterSpacing={lsp} opacity="0.7" style={{ mixBlendMode: 'screen' }}>MƯA AXIT</text>
            <text x={gl} y="-40" textAnchor="middle" fill="#2EE6FF" fontSize="96" fontWeight="900" letterSpacing={lsp} opacity="0.7" style={{ mixBlendMode: 'screen' }}>MƯA AXIT</text>
          </>
        )}
        <text y="-40" textAnchor="middle" fill="#FFFFFF" fontSize="96" fontWeight="900" letterSpacing={lsp} style={{ filter: 'drop-shadow(0 0 18px rgba(84,215,232,.8))' }}>MƯA AXIT</text>
        <g clipPath="url(#cin-title-clip)">
          <rect x={lerp(-520, 520, prog(t, 12.6, 13.5))} y="-140" width="170" height="180" fill="url(#cin-sweep)" transform="skewX(-18)" />
        </g>
      </g>
      <line x1={-260 * easeOut(prog(t, 12.5, 13.2))} y1="-6" x2={260 * easeOut(prog(t, 12.5, 13.2))} y2="-6" stroke="#D8F36A" strokeWidth="3" strokeLinecap="round" />
      <text y="52" textAnchor="middle" fill="#54D7E8" fontSize="36" fontWeight="800" letterSpacing="1" opacity={prog(t, 12.6, 13.2)}>SỰ HÌNH THÀNH DO OXIDE CỦA NITROGEN</text>
      <text y="118" textAnchor="middle" fill="#D8F36A" fontSize="26" fontWeight="600" opacity={prog(t, 12.9, 13.5)}>Báo cáo khoa học · Nhóm 2 (Hóa học &amp; Môi trường)</text>
    </g>
  );
}

/* ───────────────────────── main component ───────────────────────── */
export default function SlideIntroCinematic({ onNext }) {
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const timeRef = useRef(0);
  const playingRef = useRef(false);
  const flagsRef = useRef(freshFlags());
  const hasAdvancedRef = useRef(false);
  const onNextRef = useRef(onNext);
  const loopRef = useRef(null);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const advanceToNext = useCallback(() => {
    if (hasAdvancedRef.current) return;
    hasAdvancedRef.current = true;
    fx('stopAll', 1);
    if (onNextRef.current) onNextRef.current();
  }, []);

  // Smooth timeline: one state update per animation frame (the old 10 Hz throttle caused the stutter)
  useEffect(() => {
    fx('unlock');
    // browsers keep audio suspended until the first user gesture → start the sound bed as soon as it happens
    const resync = () => {
      fx('unlock');
      fx('startAmbient');
      fx('setMood', moodAt(timeRef.current), true);
      if (timeRef.current >= 9.8 && playingRef.current) fx('startRain');
    };
    window.addEventListener('pointerdown', resync, { once: true });
    window.addEventListener('keydown', resync, { once: true });
    let raf = 0;
    let last = null;
    const tick = (now) => {
      const dt = last == null ? 0 : Math.min(0.1, (now - last) / 1000);
      last = now;
      if (playingRef.current) {
        const t = Math.min(TOTAL_DURATION, timeRef.current + dt);
        timeRef.current = t;
        setElapsed(t);
        for (const m of MILESTONES) {
          if (!flagsRef.current[m.k] && t >= m.t) {
            flagsRef.current[m.k] = true;
            fx(m.fn, ...(m.args || []));
          }
        }
        if (t >= TOTAL_DURATION) {
          playingRef.current = false;
          setIsPlaying(false);
          timeRef.current = TOTAL_DURATION;
          setElapsed(TOTAL_DURATION);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    loopRef.current = {
      start: () => {
        cancelAnimationFrame(raf);
        last = null;
        raf = requestAnimationFrame(tick);
      },
    };
    loopRef.current.start();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', resync);
      window.removeEventListener('keydown', resync);
      fx('stopAll', 0.4);
    };
  }, []);

  const seek = useCallback((sec) => {
    const t = Math.min(TOTAL_DURATION - 0.05, Math.max(0, sec));
    timeRef.current = t;
    setElapsed(t);
    MILESTONES.forEach((m) => {
      flagsRef.current[m.k] = t >= m.t; // mark as passed without replaying the sound
    });
    hasAdvancedRef.current = false;
    fx('stopRain');
    fx('pulse', false);
    fx('startAmbient');
    fx('setMood', moodAt(t), true);
    if (t >= 9.8 && playingRef.current) fx('startRain');
    if (t >= 10 && t < 12 && playingRef.current) fx('pulse', true, 66 + (t - 10) * 29, 124, 12 - t);
    loopRef.current?.start();
  }, []);

  const togglePlay = useCallback(() => {
    const next = !playingRef.current;
    playingRef.current = next;
    setIsPlaying(next);
    if (next) {
      fx('unlock');
      fx('startAmbient');
      fx('setMood', moodAt(timeRef.current), true);
      if (timeRef.current >= 9.8) fx('startRain');
      if (timeRef.current >= 10 && timeRef.current < 12) {
        fx('pulse', true, 66 + (timeRef.current - 10) * 29, 124, 12 - timeRef.current);
      }
      fx('setPaused', false);
      loopRef.current?.start();
    } else {
      fx('setPaused', true);
    }
  }, []);

  const handleReplay = useCallback(() => {
    playingRef.current = true;
    setIsPlaying(true);
    seek(0);
  }, [seek]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((m) => {
      fx('setMuted', !m);
      return !m;
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') handleToggleMute();
      else if (e.key === 'r' || e.key === 'R') handleReplay();
      else if (e.key === 's' || e.key === 'S') advanceToNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, handleToggleMute, handleReplay, advanceToNext]);

  const t = elapsed;
  const chapterIdx = t >= 12 ? 4 : CHAPTERS.findIndex((c) => t >= c.a && t < c.b);
  const caption =
    chapterIdx === -1
      ? 'Khởi động bầu khí quyển...'
      : chapterIdx === 4
      ? 'HÀNH TRÌNH NGHIÊN CỨU: MƯA AXIT VÀ SỰ HÌNH THÀNH DO OXIDE NITROGEN'
      : CHAPTERS[chapterIdx].text;
  const progressPercent = Math.min(100, (t / TOTAL_DURATION) * 100);
  const cam = 1 + 0.035 * prog(t, 0, TOTAL_DURATION);

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * TOTAL_DURATION);
  };

  return (
    <div className={`cin-root relative w-full h-full flex-1 bg-[#030910] overflow-hidden flex items-center justify-center select-none font-sans ${isPlaying ? '' : 'cin-paused'}`}>
      <style>{`@keyframes cinCap{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes cinTw{0%,100%{opacity:.12}50%{opacity:.62}}@keyframes cinDust{from{transform:translate(0,0)}to{transform:translate(var(--sx),-1260px)}}@keyframes cinGrain{0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}}.cin-star{opacity:.12;animation:cinTw 4s ease-in-out infinite}.cin-dust{opacity:.22;animation:cinDust linear infinite}.cin-grain{position:absolute;inset:-60px;pointer-events:none;opacity:.09;mix-blend-mode:overlay;animation:cinGrain .8s steps(1) infinite;background-image:url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")}.cin-paused .cin-star,.cin-paused .cin-dust,.cin-paused .cin-grain{animation-play-state:paused}#app-root[data-layout="reflow"] .cin-root{flex-direction:column;justify-content:center;align-items:stretch;min-height:min(560px,calc(100dvh - 140px));background:radial-gradient(120% 70% at 50% 0%,#0B2A3E 0%,#030910 70%)}#app-root[data-layout="reflow"] .cin-svg{height:auto;aspect-ratio:16/9;flex:none;border-radius:14px;box-shadow:0 18px 50px -18px rgba(84,215,232,.45),0 0 0 1px rgba(84,215,232,.22)}#app-root[data-layout="reflow"] .cin-ui{position:static;background:none;padding:14px 12px 4px}#app-root[data-layout="reflow"] .cin-ctrl{flex-wrap:wrap;gap:8px;justify-content:center}#app-root[data-layout="reflow"] .cin-skip{width:100%;justify-content:center}#app-root[data-layout="reflow"] .cin-grain{display:none}`}</style>

      <svg
        viewBox="0 0 1920 1080"
        className="cin-svg w-full h-full object-contain pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Đoạn phim mở đầu điện ảnh: Cơ chế hình thành mưa axit từ NO đến HNO3"
      >
        <defs>
          <radialGradient id="cin-sky" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#0B233A" />
            <stop offset="60%" stopColor="#05101A" />
            <stop offset="100%" stopColor="#02070D" />
          </radialGradient>
          <radialGradient id="cin-vig" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
          {[['cyan', '#54D7E8'], ['coral', '#FF875F'], ['lime', '#D8F36A']].map(([n, c]) => (
            <radialGradient key={n} id={`cin-glow-${n}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c} stopOpacity="0.8" />
              <stop offset="60%" stopColor={c} stopOpacity="0.15" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id="cin-glow-heat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB36A" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#FF5A3C" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cin-gN" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#4FA3D9" />
            <stop offset="55%" stopColor="#1B4965" />
            <stop offset="100%" stopColor="#0A1F30" />
          </radialGradient>
          <radialGradient id="cin-gO" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FF8C7A" />
            <stop offset="55%" stopColor="#B3202A" />
            <stop offset="100%" stopColor="#4A0408" />
          </radialGradient>
          <radialGradient id="cin-gH" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#9FB4C8" />
            <stop offset="100%" stopColor="#4B6178" />
          </radialGradient>
          <radialGradient id="cin-water" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0A2A40" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#1B6F8A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#54D7E8" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="cin-thermo" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#54D7E8" />
            <stop offset="55%" stopColor="#FFD36A" />
            <stop offset="100%" stopColor="#FF5A3C" />
          </linearGradient>
          <linearGradient id="cin-gauge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8F36A" />
            <stop offset="50%" stopColor="#FFD36A" />
            <stop offset="100%" stopColor="#FF5A3C" />
          </linearGradient>
          <linearGradient id="cin-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A1C28" />
            <stop offset="100%" stopColor="#02070D" />
          </linearGradient>
          <linearGradient id="cin-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cin-ray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#BFEFFF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#BFEFFF" stopOpacity="0" />
          </linearGradient>
          <clipPath id="cin-rain-clip">
            <rect x="0" y="340" width="1920" height="495" />
          </clipPath>
          <clipPath id="cin-title-clip">
            <text y="-40" textAnchor="middle" fontSize="96" fontWeight="900" letterSpacing="4">MƯA AXIT</text>
          </clipPath>
        </defs>

        <rect width="1920" height="1080" fill="url(#cin-sky)" />
        <rect width="1920" height="1080" fill={tintAt(t)} opacity="0.05" />

        {/* twinkling stars (CSS-animated, memoised) */}
        <StarField />

        {/* slowly rotating coordinate grid */}
        <g opacity="0.09" stroke="#54D7E8" strokeWidth="1" fill="none" transform={`rotate(${t * 2.5} 960 540)`}>
          <circle cx="960" cy="540" r="280" strokeDasharray="6 6" />
          <circle cx="960" cy="540" r="460" strokeDasharray="8 8" />
          <circle cx="960" cy="540" r="640" strokeDasharray="10 10" />
          <line x1="960" y1="-100" x2="960" y2="1180" strokeDasharray="4 4" />
          <line x1="-100" y1="540" x2="2020" y2="540" strokeDasharray="4 4" />
        </g>

        {/* camera push-in */}
        <g transform={`translate(${shakeAt(t)} ${shakeAt(t + 0.31) * 0.7}) translate(960 540) scale(${cam}) translate(-960 -540)`}>
          <DustField />
          <Scene0 t={t} />
          <Scene1 t={t} />
          <Scene2 t={t} />
          <Scene3 t={t} />
          <Scene4 t={t} />
          <Scene5 t={t} />
        </g>

        {/* equation banner */}
        {CHAPTERS.map((c) => {
          const o = fade(t, c.a, c.a + 0.35, c.b - 0.35, c.b);
          if (o <= 0.01) return null;
          const w = 160 + c.eq.length * 28;
          return (
            <g key={c.tag} opacity={o} transform={`translate(960 ${158 + lerp(12, 0, easeOut(prog(t, c.a, c.a + 0.5)))})`}>
              <rect x={-w / 2} y="-40" width={w} height="80" rx="40" fill="#07131D" fillOpacity="0.85" stroke={c.color} strokeWidth="2.5" />
              <text y="15" textAnchor="middle" fill="#F4F7FA" fontSize="44" fontWeight="800">{c.eq}</text>
            </g>
          );
        })}

        {/* chapter ghost numerals */}
        {CHAPTERS.map((c) => {
          const o = fade(t, c.a, c.a + 0.7, c.b - 0.5, c.b - 0.05);
          if (o <= 0.01) return null;
          const sx = lerp(-80, 0, easeOut(prog(t, c.a, c.a + 0.8)));
          return (
            <g key={c.tag} opacity={o} transform={`translate(${70 + sx} 0)`}>
              <text y="170" fontSize="150" fontWeight="900" fill="none" stroke={c.color} strokeWidth="2" strokeOpacity="0.55" letterSpacing="4">{c.tag}</text>
              <text x="6" y="214" fontSize="26" fontWeight="800" letterSpacing="10" fill={c.color} opacity="0.85">{c.name.toUpperCase()}</text>
            </g>
          );
        })}

        {/* chapter chips */}
        {CHAPTERS.map((c, i) => {
          const active = t >= c.a && t < c.b;
          const done = t >= c.b;
          return (
            <g key={c.tag} transform={`translate(${430 + i * 270} 40)`} opacity={prog(t, 0.2, 0.9)}>
              <rect width="250" height="44" rx="22" fill={active ? c.color : '#0D2234'} fillOpacity={active ? 0.18 : 0.7} stroke={active || done ? c.color : '#1E3A4D'} strokeWidth="2" />
              <text x="125" y="29" textAnchor="middle" fontSize="20" fontWeight="700" fill={active || done ? c.color : '#64748B'}>
                {done ? '✓' : c.tag} {c.name}
              </text>
              {active && <rect x="22" y="38" width={206 * prog(t, c.a, c.b)} height="3" rx="1.5" fill={c.color} />}
            </g>
          );
        })}

        {FLASHES.map((f, i) => {
          const fo = flashOf(t, f);
          return fo > 0.01 ? <rect key={i} width="1920" height="1080" fill={f[2]} opacity={fo} /> : null;
        })}
        <rect width="1920" height="1080" fill="url(#cin-vig)" />
      </svg>

      <div aria-hidden="true" className="cin-grain" />


      {/* overlay UI */}
      <div className="cin-ui absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-[#02070D] via-[#05101A]/80 to-transparent flex flex-col gap-3 pointer-events-auto">
        <div className="text-center px-4 min-h-[2.75rem] flex items-end justify-center">
          <p
            key={chapterIdx}
            className="text-sm sm:text-base md:text-lg font-bold text-[#F4F7FA] leading-snug"
            style={{ animation: 'cinCap 0.45s ease-out both', textShadow: '0 0 14px rgba(84,215,232,0.55)' }}
          >
            {caption}
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-[#94A3B8] w-10 text-right">{fmtTime(t)}</span>
          <div
            role="slider"
            aria-label="Tua đoạn intro"
            aria-valuemin={0}
            aria-valuemax={TOTAL_DURATION}
            aria-valuenow={Math.round(t)}
            tabIndex={0}
            onClick={handleSeekClick}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') seek(timeRef.current - 1);
              if (e.key === 'ArrowRight') seek(timeRef.current + 1);
            }}
            className="relative flex-1 h-4 flex items-center cursor-pointer group"
          >
            <div className="relative w-full h-1.5 group-hover:h-2 transition-all bg-[#0D2234] rounded-full overflow-hidden border border-[#1E3A4D]">
              <div className="h-full bg-gradient-to-r from-[#54D7E8] via-[#82F2FF] to-[#D8F36A]" style={{ width: `${progressPercent}%`, boxShadow: '0 0 12px rgba(84,215,232,.6)' }} />
              {CHAPTERS.map((c) => (
                <div key={c.tag} className="absolute top-0 h-full w-px bg-[#02070D]/80" style={{ left: `${(c.a / TOTAL_DURATION) * 100}%` }} />
              ))}
            </div>
            <div className="absolute w-3 h-3 rounded-full bg-[#D8F36A] shadow-[0_0_10px_#D8F36A]" style={{ left: `calc(${progressPercent}% - 6px)` }} />
          </div>
          <span className="text-[11px] tabular-nums text-[#94A3B8] w-10">{fmtTime(TOTAL_DURATION)}</span>
        </div>

        <div className="cin-ctrl w-full max-w-4xl mx-auto flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2234] hover:bg-[#143245] border border-[#1E3A4D] text-[#DCE6F0] min-h-[44px] transition-colors"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {isPlaying ? <Pause size={16} className="text-[#D8F36A]" /> : <Play size={16} className="text-[#D8F36A]" />}
              <span>{isPlaying ? 'Tạm dừng' : 'Phát tiếp'}</span>
            </button>
            <button
              onClick={handleToggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2234] hover:bg-[#143245] border border-[#1E3A4D] text-[#DCE6F0] min-h-[44px] transition-colors"
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX size={16} className="text-[#F06B70]" /> : <Volume2 size={16} className="text-[#54D7E8]" />}
              <span className="hidden sm:inline">{isMuted ? 'Bật tiếng' : 'Tắt tiếng'}</span>
            </button>
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2234] hover:bg-[#143245] border border-[#1E3A4D] text-[#DCE6F0] min-h-[44px] transition-colors"
              aria-label="Phát lại đoạn intro"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Phát lại</span>
            </button>
            <span className="hidden md:inline pl-2 text-[11px] text-[#64748B]">Space: dừng · M: tiếng · R: lại · S: bỏ qua</span>
          </div>

          <button
            onClick={advanceToNext}
            className="cin-skip flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#54D7E8] to-[#38BDF8] text-[#050E17] font-bold min-h-[44px] hover:brightness-110 active:scale-95 transition-all shadow-md"
            aria-label="Bỏ qua sang Slide 3"
          >
            <span>Bỏ qua sang Slide 3</span>
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}