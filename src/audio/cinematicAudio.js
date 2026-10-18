/**
 * cinematicAudio.js (v2) — 100% procedural Web Audio, no audio files.
 * Save as src/audio/cinematicAudio.js (drop-in replacement: every old method still exists).
 *
 * Signal flow
 *   voices ─► bus ─► soft saturation ─► master ─► compressor ─► speakers
 *   voices ─► send ─► pre-delay ─► hi-pass ─► convolution reverb ─► lo-pass ─► bus
 *   ambient pad ─► duck gain (dips on big hits, like side-chain compression) ─► bus
 *
 * What's new vs v1
 *   • warmer master: tanh soft-clip + gentler limiter, darker/wider reverb with pre-delay + early reflections
 *   • 6-voice evolving pad (detuned chorus, chord third per chapter), slow tremolo, airy noise bed
 *   • per-chapter melodic motif (soft pluck arpeggio) when the mood changes
 *   • ducking on impacts, heartbeat pulse, riser, water bubbles, radical crackle, boot-up blips, chapter hits
 *   • stereo rain (L/R layers + low body + heavy drops + distant rumble)
 *   • sounds scheduled while the context is still suspended are skipped (no burst of noise on first click)
 */

let ctx = null;
let master = null;
let bus = null;
let wet = null;
let noiseBuf = null;
let muted = false;
let paused = false;
let amb = null;
let rain = null;
let beat = null;
let mood = 0;
let epoch = 0;

const BASE = 0.85;
const AMB_LEVEL = 0.17;
const ROOTS = [55, 55, 49, 43.65, 58.27, 65.41]; // A1 → A1 → G1 → F1 → Bb1 (tense) → C2 (resolve)
const THIRD = [2.4, 2.4, 2.4, 2.378, 2.4, 2.5]; // chord third (x root): minor… major on the resolve
const BRIGHT = [260, 380, 460, 360, 700, 1500];
// semitone offsets of the little pluck motif played when entering each chapter
const MOTIFS = { 1: [0, 3, 7, 10], 2: [0, 3, 5, 8], 3: [12, 7, 3, 0], 4: [0, -2, -5, -9] };

const rnd = (a, b) => a + Math.random() * (b - a);
const live = () => !!ctx && ctx.state === 'running';

function ensure() {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  try {
    ctx = new AC({ latencyHint: 'interactive' });
  } catch (e) {
    ctx = new AC();
  }

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 22;
  comp.ratio.value = 5;
  comp.attack.value = 0.004;
  comp.release.value = 0.22;

  // soft saturation = warmth + protects against harsh peaks
  const sat = ctx.createWaveShaper();
  const N = 1024;
  const curve = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * 2 - 1;
    curve[i] = Math.tanh(1.4 * x) / 1.4;
  }
  sat.curve = curve;
  sat.oversample = '2x';

  bus = ctx.createGain();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : BASE;
  bus.connect(sat);
  sat.connect(master);
  master.connect(comp);
  comp.connect(ctx.destination);

  // reverb: early reflections + a dark, diffuse tail that gets duller over time
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * 3.4);
  const ir = ctx.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const p = i / len;
      lp += (Math.random() * 2 - 1 - lp) * (1 - 0.92 * Math.min(1, p * 1.4));
      d[i] = lp * Math.pow(1 - p, 2.5) * 1.5;
    }
    [0.011, 0.023, 0.037, 0.053].forEach((s, k) => {
      d[Math.floor(sr * (s + ch * 0.004))] += (0.6 - k * 0.12) * (ch ? -1 : 1);
    });
  }
  const rev = ctx.createConvolver();
  rev.buffer = ir;
  const pre = ctx.createDelay(0.1);
  pre.delayTime.value = 0.028;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 160;
  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 7500;
  wet = ctx.createGain();
  wet.gain.value = 0.6;
  const revOut = ctx.createGain();
  revOut.gain.value = 0.85;
  wet.connect(pre);
  pre.connect(hp);
  hp.connect(rev);
  rev.connect(lpf);
  lpf.connect(revOut);
  revOut.connect(bus);

  // 4 s of white noise, reused by every noise voice
  noiseBuf = ctx.createBuffer(1, sr * 4, sr);
  const nd = noiseBuf.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  return ctx;
}

function out(node, { pan = 0, send = 0.25 } = {}) {
  let n = node;
  if (pan && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    n.connect(p);
    n = p;
  }
  n.connect(bus);
  if (send > 0) {
    const s = ctx.createGain();
    s.gain.value = send;
    n.connect(s);
    s.connect(wet);
  }
}

// one oscillator note: attack a → decay d; optional pitch glide f → f2 over the whole note
function tone({ f = 440, f2, type = 'sine', t = 0, a = 0.005, d = 0.3, v = 0.2, pan = 0, send = 0.25, detune = 0, lp }) {
  const c = ensure();
  if (!c || c.state !== 'running') return;
  const t0 = c.currentTime + t;
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + a + d);
  o.detune.value = detune;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  let n = o;
  if (lp) {
    const fl = c.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = lp;
    o.connect(fl);
    n = fl;
  }
  n.connect(g);
  out(g, { pan, send });
  o.start(t0);
  o.stop(t0 + a + d + 0.05);
}

// filtered noise burst / swell with optional filter sweep f → f2
function noise({ t = 0, d = 0.5, type = 'bandpass', f = 1000, f2, q = 1, v = 0.2, a = 0.01, pan = 0, send = 0.2 }) {
  const c = ensure();
  if (!c || c.state !== 'running') return;
  const t0 = c.currentTime + t;
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const fl = c.createBiquadFilter();
  fl.type = type;
  fl.Q.value = q;
  fl.frequency.setValueAtTime(f, t0);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + a + d);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  s.connect(fl);
  fl.connect(g);
  out(g, { pan, send });
  s.start(t0, Math.random() * 3);
  s.stop(t0 + a + d + 0.05);
}

// endless filtered-noise bed (air, rain…) wired into `dest`
function loopNoise(dest, { type = 'bandpass', f = 1000, q = 0.7, v = 0.1, pan = 0 }) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const fl = ctx.createBiquadFilter();
  fl.type = type;
  fl.frequency.value = f;
  fl.Q.value = q;
  const g = ctx.createGain();
  g.gain.value = v;
  s.connect(fl);
  fl.connect(g);
  let tail = g;
  if (pan && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    g.connect(p);
    tail = p;
  }
  tail.connect(dest);
  s.start(0, Math.random() * 3);
  return { s, fl, g };
}

// dip the ambient pad on a big hit and let it swell back (poor man's side-chain)
function duck(depth = 0.5, rel = 1.1) {
  if (!amb || !ctx) return;
  const p = amb.duck.gain;
  const n = ctx.currentTime;
  p.cancelScheduledValues(n);
  p.setValueAtTime(p.value, n);
  p.linearRampToValueAtTime(1 - depth, n + 0.02);
  p.setTargetAtTime(1, n + 0.06, rel / 3);
}

function applyMood() {
  if (!amb || !ctx) return;
  const now = ctx.currentTime;
  const r = ROOTS[mood] || ROOTS[0];
  amb.voices.forEach((v) => {
    const k = typeof v.k === 'function' ? v.k(mood) : v.k;
    v.o.frequency.setTargetAtTime(r * k, now, 0.7);
  });
  amb.filt.frequency.setTargetAtTime(BRIGHT[mood] || 300, now, 0.9);
}

function motif(m) {
  const notes = MOTIFS[m];
  if (!notes) return;
  const base = (ROOTS[m] || 55) * 8;
  notes.forEach((n, i) => {
    const f = base * Math.pow(2, n / 12);
    const pan = i % 2 ? 0.45 : -0.45;
    tone({ f, t: 0.2 + i * 0.16, type: 'triangle', a: 0.004, d: 1.1, v: 0.055, pan, send: 0.75, lp: 2600 });
    tone({ f: f * 2, t: 0.2 + i * 0.16, a: 0.003, d: 0.5, v: 0.018, pan: -pan, send: 0.8 });
  });
}

export const cin = {
  unlock() {
    const c = ensure();
    if (c && c.state === 'suspended' && !paused) c.resume().catch(() => {});
  },

  setMuted(m) {
    muted = !!m;
    if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : BASE, ctx.currentTime, 0.05);
  },

  setVolume(v) {
    const val = Math.max(0, Math.min(1, v));
    if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : BASE * val, ctx.currentTime, 0.05);
  },

  setPaused(p) {
    paused = !!p;
    if (!ctx) return;
    if (paused) ctx.suspend().catch(() => {});
    else ctx.resume().catch(() => {});
  },

  /* ── evolving pad: 5 detuned voices + air bed, filter LFO + slow tremolo, root follows the chapter ── */
  startAmbient() {
    const c = ensure();
    if (!c) return;
    epoch++;
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setValueAtTime(muted ? 0 : BASE, c.currentTime);
    if (amb) {
      amb.g.gain.cancelScheduledValues(c.currentTime);
      amb.g.gain.setTargetAtTime(AMB_LEVEL, c.currentTime, 0.6);
      return;
    }
    const g = c.createGain();
    g.gain.value = 0.0001;
    const duckG = c.createGain();
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.Q.value = 3.2;
    filt.frequency.value = BRIGHT[mood];
    filt.connect(g);
    g.connect(duckG);

    const r = ROOTS[mood];
    const voices = [
      ['sine', 1, 0, 1],
      ['triangle', 1.5, 6, 0.6],
      ['sawtooth', 2, -8, 0.35],
      ['sawtooth', 2, 9, 0.32],
      ['triangle', (m) => THIRD[m], -4, 0.28],
      ['sine', 3, 3, 0.12],
    ].map(([type, k, detune, vol]) => {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.value = r * (typeof k === 'function' ? k(mood) : k);
      o.detune.value = detune;
      const gn = c.createGain();
      gn.gain.value = vol;
      o.connect(gn);
      gn.connect(filt);
      o.start();
      return { o, k };
    });

    // filter LFO (breathing), tremolo LFO (slow swell), air-sweep LFO
    const mkLfo = (rate, depth, target) => {
      const l = c.createOscillator();
      l.frequency.value = rate;
      const lg = c.createGain();
      lg.gain.value = depth;
      l.connect(lg);
      lg.connect(target);
      l.start();
      return l;
    };
    const lfoF = mkLfo(0.12, 140, filt.frequency);
    const lfoT = mkLfo(0.07, 0.025, g.gain);
    const air = loopNoise(g, { type: 'bandpass', f: 2400, q: 0.6, v: 0.45 });
    const lfoA = mkLfo(0.05, 900, air.fl.frequency);

    out(duckG, { send: 0.5 });
    g.gain.setTargetAtTime(AMB_LEVEL, c.currentTime, 1.2);
    amb = { g, duck: duckG, filt, voices, lfos: [lfoF, lfoT, lfoA], air };
    applyMood();
  },

  setMood(n, quiet = false) {
    const prev = mood;
    mood = Math.max(0, Math.min(ROOTS.length - 1, n | 0));
    applyMood();
    if (!quiet && mood > prev) motif(mood);
  },

  fadeOut(sec = 1.2) {
    if (!amb || !ctx) return;
    amb.g.gain.setTargetAtTime(0.0001, ctx.currentTime, sec / 3);
  },

  /* ── intro ── */
  boot() {
    tone({ f: 55, f2: 110, a: 1.0, d: 0.3, v: 0.12, lp: 400, send: 0.3 });
    [880, 1318.5, 1760].forEach((f, i) => {
      tone({ f, t: 0.15 + i * 0.16, type: 'triangle', a: 0.003, d: 0.5, v: 0.05, pan: (i - 1) * 0.4, send: 0.7 });
    });
    noise({ type: 'highpass', f: 5000, a: 0.9, d: 0.2, v: 0.04 });
  },

  /* ── chapter 1 ── */
  heat() {
    tone({ f: 150, f2: 900, type: 'sawtooth', a: 1.1, d: 0.15, v: 0.07, lp: 1800, send: 0.3 });
    noise({ f: 400, f2: 3200, q: 1.5, a: 1.0, d: 0.2, v: 0.12 });
  },

  spark() {
    duck(0.25, 0.6);
    for (let i = 0; i < 16; i++) {
      noise({ t: i * 0.05 + Math.random() * 0.03, d: 0.03, type: 'highpass', f: rnd(2500, 5500), v: 0.18, pan: rnd(-0.4, 0.4), send: 0.1 });
    }
    tone({ f: 3200, f2: 180, type: 'sawtooth', a: 0.003, d: 0.5, v: 0.12, lp: 6000 });
    tone({ f: 120, type: 'sawtooth', a: 0.05, d: 0.9, v: 0.06, lp: 900 });
  },

  bondBreak() {
    duck(0.6, 1.3);
    noise({ type: 'highpass', f: 3000, d: 0.25, v: 0.35, a: 0.002 });
    noise({ type: 'lowpass', f: 600, f2: 80, d: 1.0, v: 0.3, a: 0.01, send: 0.4 });
    tone({ f: 110, f2: 32, a: 0.004, d: 1.2, v: 0.55, send: 0.35 });
    tone({ f: 1800, f2: 300, type: 'square', a: 0.002, d: 0.18, v: 0.1 });
    for (let i = 0; i < 6; i++) {
      tone({ f: rnd(2200, 5400), t: 0.04 + i * 0.045, type: 'triangle', a: 0.002, d: 0.35, v: 0.05, pan: rnd(-0.7, 0.7), send: 0.6 });
    }
  },

  bond() {
    tone({ f: 520, f2: 880, type: 'triangle', d: 0.18, v: 0.18, send: 0.4 });
    tone({ f: 1320, t: 0.05, d: 0.4, v: 0.07, send: 0.5 });
  },

  /* ── chapter 2 ── */
  chapterHit() {
    duck(0.3, 0.8);
    tone({ f: 72, f2: 40, a: 0.004, d: 0.7, v: 0.3, send: 0.3 });
    noise({ type: 'bandpass', f: 1200, f2: 6000, q: 1.4, a: 0.28, d: 0.2, v: 0.07, pan: 0.3, send: 0.5 });
  },

  whoosh() {
    noise({ f: 300, f2: 4200, q: 1.2, a: 0.5, d: 0.3, v: 0.3, pan: -0.6 });
    noise({ t: 0.6, f: 4200, f2: 500, q: 1.2, a: 0.02, d: 0.7, v: 0.22, pan: 0.6 });
  },

  smogSwell() {
    noise({ type: 'lowpass', f: 400, f2: 150, a: 1.2, d: 1.2, v: 0.22, send: 0.4 });
    tone({ f: 73.4, type: 'sawtooth', a: 1.4, d: 1.2, v: 0.06, lp: 300 });
  },

  crackle() {
    for (let i = 0; i < 12; i++) {
      noise({ t: i * 0.05 + Math.random() * 0.04, d: 0.025, type: 'highpass', f: rnd(3500, 7000), v: 0.1, pan: rnd(-0.8, 0.8), send: 0.35 });
    }
    tone({ f: 900, f2: 380, type: 'triangle', a: 0.004, d: 0.3, v: 0.06, send: 0.5 });
  },

  /* ── chapter 3 ── */
  pop() {
    tone({ f: 300, f2: 1100, a: 0.004, d: 0.12, v: 0.3, send: 0.5 });
    tone({ f: 900, f2: 1500, t: 0.15, d: 0.08, v: 0.12, send: 0.5 });
  },

  bubbles() {
    for (let i = 0; i < 12; i++) {
      const f = rnd(420, 900);
      tone({ f, f2: f * rnd(1.6, 2.4), t: i * 0.1 + rnd(0, 0.08), a: 0.003, d: rnd(0.05, 0.12), v: 0.07, pan: rnd(-0.8, 0.8), send: 0.6 });
    }
  },

  absorb() {
    for (let i = 0; i < 9; i++) {
      const f = rnd(400, 1000);
      tone({ f, f2: f * 1.8, t: i * 0.1, a: 0.004, d: 0.08, v: 0.1, pan: rnd(-0.8, 0.8), send: 0.5 });
    }
    tone({ f: 200, f2: 1000, a: 0.9, d: 0.1, v: 0.08, send: 0.5 });
  },

  convert() {
    duck(0.35, 0.9);
    [440, 554.37, 659.25, 880, 1108.7, 1318.5].forEach((f, i) => {
      tone({ f, t: i * 0.06, type: 'triangle', a: 0.004, d: 0.9, v: 0.12, pan: (i - 2.5) * 0.25, send: 0.6 });
    });
    noise({ type: 'highpass', f: 6000, d: 0.6, v: 0.08, a: 0.01, send: 0.4 });
    tone({ f: 90, f2: 45, a: 0.004, d: 0.5, v: 0.35 });
  },

  chime() {
    const bell = (base, t, v) => {
      [[1, 2.5, v], [2.76, 1.4, v * 0.5], [5.4, 0.9, v * 0.3], [8.93, 0.5, v * 0.18]].forEach(([m, d, vv]) => {
        tone({ f: base * m, t, a: 0.002, d, v: vv, send: 0.7 });
      });
    };
    bell(659.25, 0, 0.16);
    bell(987.77, 0.18, 0.12);
  },

  /* ── chapter 4 ── */
  thunder() {
    duck(0.7, 2.2);
    noise({ type: 'highpass', f: 2000, d: 0.15, v: 0.3, a: 0.002 });
    noise({ type: 'lowpass', f: 900, f2: 60, a: 0.05, d: 3.2, v: 0.55, send: 0.5 });
    tone({ f: 50, f2: 28, a: 0.02, d: 2.2, v: 0.35, send: 0.3 });
  },

  ionSplit() {
    tone({ f: 700, f2: 1200, d: 0.9, pan: -0.8, v: 0.18, send: 0.5 });
    tone({ f: 700, f2: 420, d: 0.9, pan: 0.8, v: 0.18, send: 0.5 });
    noise({ type: 'highpass', f: 5000, d: 0.5, v: 0.07, send: 0.4 });
  },

  startRain() {
    const c = ensure();
    if (!c || rain) return;
    const g = c.createGain();
    g.gain.value = 0.0001;
    out(g, { send: 0.15 });
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 7500;
    lp.connect(g);
    const layers = [
      loopNoise(lp, { type: 'highpass', f: 1100, q: 0.5, v: 0.55, pan: -0.55 }),
      loopNoise(lp, { type: 'highpass', f: 1100, q: 0.5, v: 0.55, pan: 0.55 }),
      loopNoise(g, { type: 'bandpass', f: 320, q: 0.6, v: 0.45 }),
    ];
    g.gain.setTargetAtTime(0.3, c.currentTime, 0.5);
    let n = 0;
    const timer = setInterval(() => {
      if (!live() || paused || muted) return;
      n++;
      if (Math.random() < 0.55) tone({ f: rnd(1800, 4400), a: 0.002, d: 0.06, v: 0.025, pan: rnd(-1, 1), send: 0.5 });
      if (Math.random() < 0.08) tone({ f: rnd(500, 900), f2: rnd(200, 300), a: 0.002, d: 0.05, v: 0.03, pan: rnd(-1, 1), send: 0.6 });
      if (n % 40 === 0 && Math.random() < 0.35) {
        noise({ type: 'lowpass', f: 420, f2: 70, a: 0.6, d: 2.4, v: 0.14, send: 0.6, pan: rnd(-0.6, 0.6) });
      }
    }, 70);
    rain = { layers, g, timer };
  },

  stopRain(sec = 0.4) {
    if (!rain || !ctx) return;
    const r = rain;
    rain = null;
    clearInterval(r.timer);
    r.g.gain.setTargetAtTime(0.0001, ctx.currentTime, sec / 3);
    setTimeout(() => {
      r.layers.forEach((l) => {
        try {
          l.s.stop();
        } catch (e) {
          /* already stopped */
        }
      });
    }, sec * 1000 + 200);
  },

  // low heartbeat that speeds up: pulse(true, bpmFrom, bpmTo, seconds) / pulse(false)
  pulse(on = true, b0 = 64, b1 = 120, sec = 2) {
    if (beat) {
      clearTimeout(beat.h);
      beat = null;
    }
    if (!on) return;
    const start = performance.now();
    const me = { h: 0 };
    beat = me;
    const step = () => {
      if (beat !== me) return;
      const k = Math.min(1, (performance.now() - start) / (sec * 1000));
      const bpm = b0 + (b1 - b0) * k;
      if (live() && !paused && !muted) {
        const v = 0.18 + 0.2 * k;
        tone({ f: 76, f2: 36, a: 0.004, d: 0.24, v, send: 0.2 });
        tone({ f: 62, f2: 34, t: 0.17, a: 0.004, d: 0.2, v: v * 0.6, send: 0.2 });
      }
      me.h = setTimeout(step, 60000 / bpm);
    };
    step();
  },

  riser(d = 1.1) {
    noise({ type: 'bandpass', f: 400, f2: 7000, q: 2.2, a: d, d: 0.06, v: 0.2, send: 0.5 });
    noise({ type: 'highpass', f: 3000, a: d, d: 0.05, v: 0.1, send: 0.7 });
    tone({ f: 90, f2: 700, type: 'sawtooth', a: d, d: 0.05, v: 0.08, lp: 2400, send: 0.4 });
  },

  warn() {
    tone({ f: 880, type: 'square', d: 0.12, v: 0.07, lp: 3000 });
    tone({ f: 660, t: 0.2, type: 'square', d: 0.18, v: 0.07, lp: 3000 });
    tone({ f: 196, t: 0.2, type: 'sawtooth', d: 0.6, v: 0.08, lp: 600 });
  },

  /* ── title ── */
  finale() {
    duck(0.85, 3.2);
    tone({ f: 80, f2: 28, a: 0.004, d: 2.8, v: 0.7, send: 0.4 });
    noise({ type: 'lowpass', f: 5000, f2: 200, a: 0.01, d: 1.8, v: 0.3, send: 0.5 });
    // C major add9 swell — resolves the tension of the previous chapters
    [130.81, 196, 261.63, 329.63, 392, 587.33].forEach((f, i) => {
      tone({ f, type: 'sawtooth', a: 0.18, d: 4.4, v: 0.05, lp: 1500, detune: i % 2 ? 6 : -6, send: 0.6 });
    });
    tone({ f: 65.41, a: 0.1, d: 4, v: 0.25, send: 0.3 });
    [1046.5, 1318.5, 1568].forEach((f, i) => {
      tone({ f, t: 0.1 + i * 0.14, a: 0.6, d: 3.4, v: 0.03, send: 0.85 });
    });
  },

  shimmer() {
    const set = [1568, 1975.5, 2349.3, 2637, 3136, 3951];
    for (let i = 0; i < 10; i++) {
      tone({ f: set[i % set.length], t: i * 0.07, type: 'triangle', a: 0.003, d: 0.5, v: 0.04, pan: rnd(-0.8, 0.8), send: 0.9 });
    }
  },

  stopAll(sec = 0.6) {
    if (!ctx) return;
    const my = ++epoch;
    cin.pulse(false);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, sec / 3);
    setTimeout(() => {
      if (my !== epoch) return; // something restarted in the meantime
      cin.stopRain(0.05);
      if (amb) {
        [...amb.voices.map((v) => v.o), ...amb.lfos, amb.air.s].forEach((o) => {
          try {
            o.stop();
          } catch (e) {
            /* ignore */
          }
        });
        amb = null;
      }
      if (master) master.gain.value = muted ? 0 : BASE;
    }, sec * 1000 + 100);
  },
};

export default cin;