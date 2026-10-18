/**
 * AudioEngine.js — Studio-Grade Procedural Web Audio Engine (v3.0)
 * 100% procedural Web Audio API synthesis: zero external audio files.
 *
 * Signal Architecture:
 *   Sound Generators ──► Dry Bus ──┬──► Saturation / Warmth (tanh) ──► Master Gain ──► Studio Limiter ──► Speakers
 *                                   └──► Pre-delay ──► Hi-pass ──► Convolution Plate Reverb ──► Reverb Gain ──┘
 *
 * Enhancements:
 *   • Master bus warmth with soft saturation (wave shaper) & dynamics limiter
 *   • Algorithmic stereo plate reverb with discrete early reflections for 3D spatial presence
 *   • Haptic dual-layer UI clicks (tactile transient + warm body)
 *   • Crystal celesta success chimes with physical bell overtones
 *   • Aerodynamic stereo whooshes with directional panning & sub-bass air displacement
 *   • Organic liquid droplet pops with rising FM chirps
 *   • High-voltage ionizing electrical spark crackles
 *   • Binaural procedural rain loop with randomized micro-droplets and rolling distant rumble
 *   • Chemical effervescence fizz & bubbling for reaction simulations
 *   • Sonar telemetry pings & slide-switch directional transitions
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.satNode = null;
    this.compressor = null;
    this.reverbSend = null;
    this.reverbNode = null;
    this.reverbGain = null;
    this.reverbBuffer = null;
    this.noiseBuffer = null;
    this.pinkBuffer = null;

    // Rain generator state
    this.rainGain = null;
    this.rainNodes = [];
    this.rainInterval = null;

    this.isMuted = false;
    this.volume = 0.85;
    this.isUnlocked = false;

    // Throttle high-frequency UI clicks
    this.lastTickTime = 0;
  }

  // Lazy initialize AudioContext on user gesture
  unlock() {
    if (this.isUnlocked && this.ctx && this.ctx.state === 'running') return;
    try {
      const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
      if (!AudioCtx) return;

      if (!this.ctx) {
        this.ctx = new AudioCtx({ latencyHint: 'interactive' });
        this._initMasterChain();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      this.isUnlocked = true;
    } catch (err) {
      console.warn('[AudioEngine] Web Audio initialization blocked or unsupported:', err);
    }
  }

  _initMasterChain() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Studio Limiter / Dynamics Compressor (prevents clipping, adds punch)
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-14, now);
    this.compressor.knee.setValueAtTime(18, now);
    this.compressor.ratio.setValueAtTime(4.5, now);
    this.compressor.attack.setValueAtTime(0.003, now);
    this.compressor.release.setValueAtTime(0.2, now);
    this.compressor.connect(this.ctx.destination);

    // 2. Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, now);
    this.masterGain.connect(this.compressor);

    // 3. Soft Saturation / Analog Warmth
    this.satNode = this.ctx.createWaveShaper();
    this.satNode.curve = this._makeSaturationCurve(1.35);
    this.satNode.oversample = '2x';
    this.satNode.connect(this.masterGain);

    // 4. Algorithmic Convolution Reverb Bus (warm spatial dimension)
    this.reverbBuffer = this._makeReverbBuffer(1.8, 2.2);
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.reverbBuffer;

    const preDelay = this.ctx.createDelay(0.1);
    preDelay.delayTime.setValueAtTime(0.024, now);

    const revHp = this.ctx.createBiquadFilter();
    revHp.type = 'highpass';
    revHp.frequency.setValueAtTime(200, now);

    const revLp = this.ctx.createBiquadFilter();
    revLp.type = 'lowpass';
    revLp.frequency.setValueAtTime(6500, now);

    this.reverbSend = this.ctx.createGain();
    this.reverbSend.gain.setValueAtTime(0.6, now);

    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.7, now);

    this.reverbSend.connect(preDelay);
    preDelay.connect(revHp);
    revHp.connect(this.reverbNode);
    this.reverbNode.connect(revLp);
    revLp.connect(this.reverbGain);
    this.reverbGain.connect(this.satNode);

    // 5. Pre-compute noise buffers (white & pink)
    this._makeNoiseBuffers();
  }

  _makeSaturationCurve(k = 1.3) {
    const n = 1024;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 2 - 1;
      curve[i] = Math.tanh(k * x) / Math.tanh(k);
    }
    return curve;
  }

  _makeReverbBuffer(duration = 1.8, decay = 2.2) {
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * duration);
    const buf = this.ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const p = i / len;
        const white = Math.random() * 2 - 1;
        lp += (white - lp) * (1 - 0.88 * p);
        data[i] = lp * Math.pow(1 - p, decay) * 1.4;
      }
      // Discrete early reflections for binaural realism
      [0.009, 0.021, 0.035, 0.052].forEach((sec, k) => {
        const idx = Math.floor(sr * (sec + c * 0.004));
        if (idx < len) {
          data[idx] += (0.45 - k * 0.09) * (c ? -1 : 1);
        }
      });
    }
    return buf;
  }

  _makeNoiseBuffers() {
    if (!this.ctx) return;
    const sr = this.ctx.sampleRate;
    const len = sr * 3; // 3-second loopable buffer

    // White noise
    this.noiseBuffer = this.ctx.createBuffer(1, len, sr);
    const wData = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      wData[i] = Math.random() * 2 - 1;
    }

    // Pink noise (-3dB/octave slope via Paul Kellet algorithm)
    this.pinkBuffer = this.ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const pData = this.pinkBuffer.getChannelData(c);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        pData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.04);
    }
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.04);
    }
    if (this.isMuted) {
      this.stopRainLoop();
    }
  }

  // Safe routing helper with stereo panning and spatial reverb send
  _route(node, { pan = 0, send = 0.22 } = {}) {
    if (!this.ctx || !this.satNode) return;
    let outNode = node;
    if (pan !== 0 && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
      outNode.connect(panner);
      outNode = panner;
    }
    outNode.connect(this.satNode);
    if (send > 0 && this.reverbSend) {
      const sendGain = this.ctx.createGain();
      sendGain.gain.setValueAtTime(send, this.ctx.currentTime);
      outNode.connect(sendGain);
      sendGain.connect(this.reverbSend);
    }
  }

  // -------------------------------------------------------------
  // CORE PROCEDURAL SFX IMPLEMENTATIONS
  // -------------------------------------------------------------

  /**
   * 1. tick: Tactile Haptic Click (Used for slide navigation, tab switch, dock buttons)
   * High-end micro-transient with acoustic damping, zero harsh square-wave buzz.
   */
  playTick(pan = 0) {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const now = Date.now();
    if (now - this.lastTickTime < 28) return; // Debounce rapid key firing
    this.lastTickTime = now;

    try {
      const t0 = this.ctx.currentTime;

      // Layer 1: High-passed mechanical transient impulse (MacBook / Leica feel)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, t0);
      osc.frequency.exponentialRampToValueAtTime(380, t0 + 0.016);

      oscGain.gain.setValueAtTime(0.0001, t0);
      oscGain.gain.linearRampToValueAtTime(0.12, t0 + 0.002);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.018);

      osc.connect(oscGain);
      this._route(oscGain, { pan, send: 0.1 });
      osc.start(t0);
      osc.stop(t0 + 0.02);

      // Layer 2: Subtle acoustic resonance body
      const body = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      body.type = 'sine';
      body.frequency.setValueAtTime(280, t0);
      body.frequency.exponentialRampToValueAtTime(140, t0 + 0.024);

      bodyGain.gain.setValueAtTime(0.06, t0);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.024);

      body.connect(bodyGain);
      this._route(bodyGain, { pan, send: 0.05 });
      body.start(t0);
      body.stop(t0 + 0.026);
    } catch {}
  }

  /**
   * 2. pop: Organic Liquid Droplet Pop (Bubble spawn, pill toggling, droplet impact)
   * Frequency-modulated swoop (340 -> 1450 -> 480 Hz) with crystal resonance.
   */
  playPop(pitchMultiplier = 1.0, pan = 0) {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;
      const baseFreq = 420 * pitchMultiplier;

      // Layer 1: Liquid chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.7, t0);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, t0 + 0.014);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, t0 + 0.085);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.16, t0 + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);

      osc.connect(gain);
      this._route(gain, { pan, send: 0.35 });
      osc.start(t0);
      osc.stop(t0 + 0.095);

      // Layer 2: Glassy sparkle overtone
      const glass = this.ctx.createOscillator();
      const glassGain = this.ctx.createGain();
      glass.type = 'triangle';
      glass.frequency.setValueAtTime(baseFreq * 2.76, t0);
      glass.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t0 + 0.05);

      glassGain.gain.setValueAtTime(0.04, t0);
      glassGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);

      glass.connect(glassGain);
      this._route(glassGain, { pan, send: 0.45 });
      glass.start(t0);
      glass.stop(t0 + 0.055);
    } catch {}
  }

  /**
   * 3. whoosh: Aerodynamic Vortex Sweep (Slide transitions, card animations)
   * Stereo-panned resonant pink noise with sub-bass air rush.
   */
  playWhoosh(direction = 1) {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;
      const dur = 0.32;

      // Layer 1: Resonant sweeping noise
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(2.2, t0);
        filter.frequency.setValueAtTime(direction > 0 ? 320 : 2800, t0);
        filter.frequency.exponentialRampToValueAtTime(direction > 0 ? 3400 : 380, t0 + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.14, t0 + dur * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        noise.connect(filter);
        filter.connect(gain);
        this._route(gain, { pan: direction * 0.45, send: 0.28 });

        noise.start(t0, Math.random() * 1.5);
        noise.stop(t0 + dur + 0.05);
      }

      // Layer 2: Sub-bass air displacement (gives physical weight)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, t0);
      sub.frequency.exponentialRampToValueAtTime(45, t0 + dur * 0.9);

      subGain.gain.setValueAtTime(0.0001, t0);
      subGain.gain.linearRampToValueAtTime(0.12, t0 + 0.04);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.85);

      sub.connect(subGain);
      this._route(subGain, { pan: 0, send: 0.1 });
      sub.start(t0);
      sub.stop(t0 + dur);
    } catch {}
  }

  /**
   * Directional slide switch sound combining whoosh + haptic arrival
   */
  slideSwitch(direction = 'next') {
    const dir = direction === 'next' ? 1 : -1;
    this.playWhoosh(dir);
    setTimeout(() => {
      this.playTick(dir * 0.25);
    }, 110);
  }

  /**
   * 4. spark: High-Voltage Electrical Arc Discharge (Slide 08 combustion ignition)
   * Multi-impulse crackle with ionization snap & combustion pop.
   */
  playSpark() {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;

      // 4 rapid micro-arcs over 45ms
      for (let i = 0; i < 4; i++) {
        const offset = t0 + i * 0.011 + Math.random() * 0.004;
        const dur = 0.018;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(3200 + Math.random() * 2400, offset);
        osc.frequency.exponentialRampToValueAtTime(500, offset + dur);

        gain.gain.setValueAtTime(0.0001, offset);
        gain.gain.linearRampToValueAtTime(0.18 / (i + 1), offset + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, offset + dur);

        osc.connect(gain);
        this._route(gain, { pan: (Math.random() - 0.5) * 0.5, send: 0.15 });
        osc.start(offset);
        osc.stop(offset + dur + 0.01);
      }

      // Spark body snap (ionized air crack)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4500, t0);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.22, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.065);

        noise.connect(filter);
        filter.connect(gain);
        this._route(gain, { pan: 0, send: 0.25 });
        noise.start(t0, Math.random());
        noise.stop(t0 + 0.08);
      }
    } catch {}
  }

  /**
   * 5. chime: Crystal Celesta Harmonic Chord (Quiz correct, step success, mission accomplished)
   * Celestial bell harmonics with ping-pong spatial shimmer.
   */
  playChime() {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;
      // Lush E major 9th chord (E5, G#5, B5, F#6)
      const chord = [
        { f: 659.25, time: 0, vol: 0.14, pan: -0.35, d: 0.8 },
        { f: 830.61, time: 0.06, vol: 0.12, pan: 0.35, d: 0.9 },
        { f: 987.77, time: 0.12, vol: 0.13, pan: -0.15, d: 1.1 },
        { f: 1479.98, time: 0.18, vol: 0.09, pan: 0.2, d: 1.3 },
      ];

      chord.forEach(({ f, time, vol, pan, d }) => {
        const noteStart = t0 + time;

        // Fundamental tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteStart);

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(vol, noteStart + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + d);

        osc.connect(gain);
        this._route(gain, { pan, send: 0.65 });
        osc.start(noteStart);
        osc.stop(noteStart + d + 0.05);

        // Bell overtone harmonic (2.76x)
        const overtone = this.ctx.createOscillator();
        const otGain = this.ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(f * 2.76, noteStart);

        otGain.gain.setValueAtTime(vol * 0.35, noteStart);
        otGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + d * 0.45);

        overtone.connect(otGain);
        this._route(otGain, { pan: -pan, send: 0.8 });
        overtone.start(noteStart);
        overtone.stop(noteStart + d * 0.5);
      });
    } catch {}
  }

  /**
   * 6. buzz: Modern Gentle Error Nudge (Quiz incorrect, invalid boundary)
   * Warm, polite low-frequency double tap instead of annoying harsh square wave.
   */
  playBuzz() {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;
      // Gentle double nudge (120ms apart)
      [0, 0.11].forEach((delay) => {
        const noteStart = t0 + delay;

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(142, noteStart);
        osc.frequency.exponentialRampToValueAtTime(98, noteStart + 0.08);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, noteStart);

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.09);

        osc.connect(filter);
        filter.connect(gain);
        this._route(gain, { pan: 0, send: 0.1 });

        osc.start(noteStart);
        osc.stop(noteStart + 0.095);
      });
    } catch {}
  }

  /**
   * 7. riser: Cinematic Tension Swell (Hero slide transition, start exploration)
   * Multi-layer sub drone, unison saw detuning & filter opening to an apex.
   */
  playRiser(duration = 1.4) {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;

      // Layer 1: Detuned unison saws
      [-7, 7].forEach((detune) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, t0);
        osc.frequency.exponentialRampToValueAtTime(360, t0 + duration);
        osc.detune.setValueAtTime(detune, t0);

        filter.type = 'lowpass';
        filter.Q.setValueAtTime(3.5, t0);
        filter.frequency.setValueAtTime(150, t0);
        filter.frequency.exponentialRampToValueAtTime(2600, t0 + duration);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.08, t0 + duration * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

        osc.connect(filter);
        filter.connect(gain);
        this._route(gain, { pan: detune > 0 ? 0.35 : -0.35, send: 0.4 });

        osc.start(t0);
        osc.stop(t0 + duration + 0.05);
      });

      // Layer 2: Sweeping noise riser
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const fl = this.ctx.createBiquadFilter();
        fl.type = 'bandpass';
        fl.Q.setValueAtTime(2.8, t0);
        fl.frequency.setValueAtTime(280, t0);
        fl.frequency.exponentialRampToValueAtTime(5400, t0 + duration);

        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.0001, t0);
        ng.gain.linearRampToValueAtTime(0.12, t0 + duration * 0.85);
        ng.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

        noise.connect(fl);
        fl.connect(ng);
        this._route(ng, { pan: 0, send: 0.5 });

        noise.start(t0, Math.random());
        noise.stop(t0 + duration + 0.05);
      }
    } catch {}
  }

  /**
   * 8. rainLoop: Binaural Ambient Rain Soundscape
   * Stereo pink noise bed + randomized procedural micro-droplet pings & low rumble.
   */
  startRainLoop() {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running' || this.rainInterval) return;

    try {
      const t0 = this.ctx.currentTime;
      this.rainNodes = [];

      // Master gain for rain
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.0001, t0);
      this.rainGain.gain.linearRampToValueAtTime(0.065, t0 + 1.2);
      this._route(this.rainGain, { pan: 0, send: 0.2 });

      // Pink noise stereo bed
      if (this.pinkBuffer) {
        const pinkSrc = this.ctx.createBufferSource();
        pinkSrc.buffer = this.pinkBuffer;
        pinkSrc.loop = true;

        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.Q.setValueAtTime(0.65, t0);
        rainFilter.frequency.setValueAtTime(2200, t0);

        pinkSrc.connect(rainFilter);
        rainFilter.connect(this.rainGain);
        pinkSrc.start(t0);
        this.rainNodes.push(pinkSrc);
      }

      // Low ground wash rumble
      if (this.noiseBuffer) {
        const lowSrc = this.ctx.createBufferSource();
        lowSrc.buffer = this.noiseBuffer;
        lowSrc.loop = true;

        const lowFilter = this.ctx.createBiquadFilter();
        lowFilter.type = 'lowpass';
        lowFilter.frequency.setValueAtTime(320, t0);

        const lowGain = this.ctx.createGain();
        lowGain.gain.setValueAtTime(0.4, t0);

        lowSrc.connect(lowFilter);
        lowFilter.connect(lowGain);
        lowGain.connect(this.rainGain);
        lowSrc.start(t0);
        this.rainNodes.push(lowSrc);
      }

      // Procedural micro-droplets generator
      this.rainInterval = setInterval(() => {
        if (!this.ctx || this.ctx.state !== 'running' || this.isMuted) return;
        if (Math.random() < 0.65) {
          const now = this.ctx.currentTime;
          const drop = this.ctx.createOscillator();
          const dGain = this.ctx.createGain();

          const f = 1600 + Math.random() * 2600;
          drop.type = 'sine';
          drop.frequency.setValueAtTime(f, now);
          drop.frequency.exponentialRampToValueAtTime(f * 0.6, now + 0.04);

          dGain.gain.setValueAtTime(0.02 + Math.random() * 0.03, now);
          dGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

          drop.connect(dGain);
          this._route(dGain, { pan: (Math.random() - 0.5) * 1.6, send: 0.4 });
          drop.start(now);
          drop.stop(now + 0.05);
        }
      }, 75);
    } catch {}
  }

  stopRainLoop() {
    if (this.rainInterval) {
      clearInterval(this.rainInterval);
      this.rainInterval = null;
    }
    if (this.rainGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.rainGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          this.rainNodes.forEach((node) => {
            try {
              node.stop();
              node.disconnect();
            } catch {}
          });
          this.rainNodes = [];
          if (this.rainGain) {
            this.rainGain.disconnect();
            this.rainGain = null;
          }
        }, 650);
      } catch {
        this.rainNodes = [];
        this.rainGain = null;
      }
    }
  }

  /**
   * 9. chemicalFizz: Effervescent Fizzing / Chemical Reaction (Slide 10 cloud droplet, Slide 15 limestone acid dissolution)
   */
  chemicalFizz(duration = 0.8) {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;

      // Micro bubble bursts
      const bubbleCount = Math.floor(duration * 18);
      for (let i = 0; i < bubbleCount; i++) {
        const timeOffset = t0 + (i / bubbleCount) * duration + (Math.random() - 0.5) * 0.04;
        const f = 600 + Math.random() * 1400;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, timeOffset);
        osc.frequency.exponentialRampToValueAtTime(f * 1.8, timeOffset + 0.035);

        gain.gain.setValueAtTime(0.0001, timeOffset);
        gain.gain.linearRampToValueAtTime(0.05, timeOffset + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + 0.04);

        osc.connect(gain);
        this._route(gain, { pan: (Math.random() - 0.5) * 0.8, send: 0.3 });
        osc.start(timeOffset);
        osc.stop(timeOffset + 0.045);
      }

      // Effervescent hiss
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const fl = this.ctx.createBiquadFilter();
        fl.type = 'highpass';
        fl.frequency.setValueAtTime(3200, t0);

        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.0001, t0);
        ng.gain.linearRampToValueAtTime(0.08, t0 + 0.05);
        ng.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

        noise.connect(fl);
        fl.connect(ng);
        this._route(ng, { pan: 0, send: 0.35 });
        noise.start(t0, Math.random());
        noise.stop(t0 + duration + 0.05);
      }
    } catch {}
  }

  /**
   * 10. sonarPing: Environmental telemetry buoy ping (Slide 17 sampling stations)
   */
  sonarPing(pan = 0) {
    this.unlock();
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const t0 = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1864, t0); // A#6
      osc.frequency.exponentialRampToValueAtTime(1860, t0 + 0.4);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.12, t0 + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.65);

      osc.connect(gain);
      this._route(gain, { pan, send: 0.75 });
      osc.start(t0);
      osc.stop(t0 + 0.7);
    } catch {}
  }
}

export const audioEngine = new AudioEngine();
