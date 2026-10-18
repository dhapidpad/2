/**
 * teamAudio.js — procedural UI sounds for Slide03Team (no audio files).
 * Save as src/audio/teamAudio.js. Independent from ./sfx and ./cinematicAudio.
 * Mute preference is remembered in localStorage ("s3-muted").
 */

let ctx = null;
let master = null;
let echo = null;
let noiseBuf = null;
let muted = false;
let lastHover = 0;

try {
  muted = typeof localStorage !== 'undefined' && localStorage.getItem('s3-muted') === '1';
} catch (e) {
  /* storage may be blocked */
}

function ensure() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(comp);
  comp.connect(ctx.destination);

  // soft feedback echo gives the notes a little sparkle
  echo = ctx.createDelay(1);
  echo.delayTime.value = 0.17;
  const fb = ctx.createGain();
  fb.gain.value = 0.3;
  const wet = ctx.createGain();
  wet.gain.value = 0.28;
  echo.connect(fb);
  fb.connect(echo);
  echo.connect(wet);
  wet.connect(master);

  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

function route(node, pan = 0, send = 0.3) {
  let n = node;
  if (pan && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    n.connect(p);
    n = p;
  }
  n.connect(master);
  if (send > 0) {
    const s = ctx.createGain();
    s.gain.value = send;
    n.connect(s);
    s.connect(echo);
  }
}

function tone({ f = 440, f2, type = 'sine', t = 0, a = 0.004, d = 0.2, v = 0.1, pan = 0, send = 0.3 }) {
  const t0 = ctx.currentTime + t;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + a + d);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  o.connect(g);
  route(g, pan, send);
  o.start(t0);
  o.stop(t0 + a + d + 0.05);
}

function noise({ f = 1000, f2, q = 1, type = 'bandpass', t = 0, a = 0.01, d = 0.2, v = 0.08, pan = 0, send = 0.1 }) {
  const t0 = ctx.currentTime + t;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const fl = ctx.createBiquadFilter();
  fl.type = type;
  fl.Q.value = q;
  fl.frequency.setValueAtTime(f, t0);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + a + d);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  s.connect(fl);
  fl.connect(g);
  route(g, pan, send);
  s.start(t0, Math.random() * 0.3);
  s.stop(t0 + a + d + 0.05);
}

const SCALE = [0, 2, 4, 7, 9]; // major pentatonic: every member gets a pleasant, distinct note
const hz = (semi) => 440 * Math.pow(2, semi / 12);
const ready = () => !muted && ensure();

export const ta = {
  isMuted: () => muted,

  setMuted(m) {
    muted = !!m;
    try {
      localStorage.setItem('s3-muted', muted ? '1' : '0');
    } catch (e) {
      /* ignore */
    }
  },

  setVolume(v) {
    if (master && ctx) {
      const val = Math.max(0, Math.min(1, v));
      master.gain.setTargetAtTime(val * 0.7, ctx.currentTime, 0.05);
    }
  },

  // next / previous card: soft tactile click + directional air swish
  tick(dir = 1) {
    if (!ready()) return;
    tone({ f: dir > 0 ? 880 : 740, f2: dir > 0 ? 1200 : 560, type: 'triangle', a: 0.002, d: 0.06, v: 0.07, send: 0.15 });
    noise({ f: dir > 0 ? 700 : 2200, f2: dir > 0 ? 2200 : 700, q: 1.6, a: 0.005, d: 0.18, v: 0.05, pan: dir * 0.45 });
  },

  // picking a specific member: rich kalimba/bell tone based on position
  select(i = 0) {
    if (!ready()) return;
    const semi = SCALE[i % 5] + 12 * Math.floor(i / 5);
    const fundamental = hz(semi);
    // Fundamental tone
    tone({ f: fundamental, type: 'sine', a: 0.004, d: 0.45, v: 0.12, send: 0.45 });
    // Soft wooden harmonic (triangle)
    tone({ f: fundamental, type: 'triangle', a: 0.002, d: 0.22, v: 0.06, send: 0.2 });
    // Upper sparkle overtone
    tone({ f: fundamental * 2.76, t: 0.015, type: 'sine', a: 0.002, d: 0.32, v: 0.04, send: 0.6 });
  },

  // moving to another stage of the workflow: rising harmonic chime
  group(gi = 0) {
    if (!ready()) return;
    const root = 392 * Math.pow(2, (gi * 2) / 12);
    [1, 1.25, 1.5, 2].forEach((m, k) => {
      tone({ f: root * m, t: 0.08 + k * 0.065, type: 'sine', a: 0.004, d: 0.65, v: 0.08, pan: (k - 1.5) * 0.35, send: 0.6 });
      tone({ f: root * m * 2, t: 0.09 + k * 0.065, type: 'triangle', a: 0.002, d: 0.35, v: 0.03, pan: -(k - 1.5) * 0.35, send: 0.5 });
    });
  },

  hover() {
    const now = Date.now();
    if (now - lastHover < 70 || !ready()) return;
    lastHover = now;
    tone({ f: 2100, a: 0.002, d: 0.035, v: 0.02, send: 0.08 });
  },

  toggle(on) {
    if (!ready()) return;
    tone({ f: on ? 523.25 : 783.99, a: 0.003, d: 0.14, v: 0.08, type: 'triangle' });
    tone({ f: on ? 783.99 : 440, t: 0.07, a: 0.003, d: 0.2, v: 0.08, type: 'triangle' });
  },
};

export default ta;