/* SUDOMI 1.0 — Enhanced Sound & Audio Engine
 * - Zero audio files required for SFX: completely procedural Web Audio API synthesis.
 * - Pentatonic harmonic scale for digit entry (1-9): every move sounds musical and rewarding.
 * - Cross-platform haptic feedback (native navigator.vibrate on Android, native switch tick on iOS).
 * - Background ambient music controller with independent volume control.
 * - Skin-specific placement textures: Neón, A lápiz, Oro, and Caoba.
 */
(()=>{
  'use strict';
  const KEY = 'sudomi-sound-v1';
  const readCfg = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY)) || {};
      return {
        sound: v.sound !== false,
        vibe: v.vibe !== false,
        music: !!v.music,
        vol: typeof v.vol === 'number' ? Math.min(1, Math.max(0, v.vol)) : 0.6,
        musicVol: typeof v.musicVol === 'number' ? Math.min(1, Math.max(0, v.musicVol)) : 0.4
      };
    } catch (_) {
      return { sound: true, vibe: true, music: false, vol: 0.6, musicVol: 0.4 };
    }
  };
  let cfg = readCfg(), ctx = null, bus = null;
  const saveCfg = () => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (_) {} };

  // ---- Vibration & Haptic feedback ----
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const nativeVibrate = navigator.vibrate ? navigator.vibrate.bind(navigator) : null;
  const touched = () => !navigator.userActivation || navigator.userActivation.hasBeenActive;
  let hapticLabel = null;

  function haptic() {
    try {
      if (!hapticLabel) {
        const l = document.createElement('label');
        l.setAttribute('aria-hidden', 'true');
        l.style.cssText = 'position:fixed;left:-200px;top:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none';
        const i = document.createElement('input');
        i.type = 'checkbox';
        i.setAttribute('switch', '');
        i.tabIndex = -1;
        l.appendChild(i);
        document.body.appendChild(l);
        hapticLabel = l;
      }
      hapticLabel.click();
    } catch (_) {}
  }

  function hapticPattern(p) {
    const a = Array.isArray(p) ? p : [p];
    let t = 0;
    a.forEach((ms, i) => {
      if (i % 2 === 0) {
        if (t === 0) haptic(); else setTimeout(haptic, t);
      }
      t += ms;
    });
  }

  const doVibe = p => {
    if (nativeVibrate) {
      if (touched()) { try { nativeVibrate(p); } catch (_) {} }
    } else if (isIOS) {
      hapticPattern(p);
    }
  };

  navigator.vibrate = p => {
    if (!cfg.vibe) return false;
    doVibe(p);
    return true;
  };

  const vibe = p => { if (cfg.vibe) doVibe(p); };

  // ---- Audio Context & iOS Audio Unlock ----
  let silent = null, primed = false;
  function getAudioContext() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (_) { ctx = null; }
    return ctx;
  }

  function silentWav() {
    const n = 8000, b = new ArrayBuffer(44 + n), v = new DataView(b),
      w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true);
    v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }

  function keepAlive() {
    if (!isIOS || silent) return;
    try {
      silent = new Audio(silentWav());
      silent.loop = true;
      silent.setAttribute('playsinline', '');
      silent.preload = 'auto';
      const p = silent.play();
      if (p && p.catch) p.catch(() => { silent = null; });
    } catch (_) { silent = null; }
  }

  const unlock = () => {
    if (!cfg.sound && !cfg.music) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}
    const c = getAudioContext();
    if (c) {
      if (c.state !== 'running' && c.resume) c.resume().catch(() => {});
      if (!primed) {
        try {
          const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource();
          s.buffer = b; s.connect(c.destination); s.start(0); primed = true;
        } catch (_) {}
      }
    }
    keepAlive();
  };

  ['touchend', 'pointerup', 'click', 'keydown'].forEach(ev =>
    document.addEventListener(ev, unlock, { passive: true })
  );
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && ctx && ctx.state !== 'running' && ctx.resume) ctx.resume().catch(() => {});
  });

  // Master Audio Bus (Reverb + Compressor)
  function masterBus(c) {
    if (bus) return bus;
    const inp = c.createGain(), comp = c.createDynamicsCompressor(),
      master = c.createGain(), send = c.createGain(), rev = c.createConvolver(), wet = c.createGain();
    try {
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 5;
      comp.attack.value = 0.003;
      comp.release.value = 0.2;
    } catch (_) {}
    const len = Math.floor(c.sampleRate * 1.1), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const a = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) a[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
    }
    rev.buffer = ir;
    wet.gain.value = 0.35;
    master.gain.value = cfg.vol;
    inp.connect(comp);
    send.connect(rev);
    rev.connect(wet);
    wet.connect(comp);
    comp.connect(master);
    master.connect(c.destination);
    return bus = { inp, send, master };
  }

  function linkBus(c, node, rv) {
    const b = masterBus(c);
    node.connect(b.inp);
    if (rv) {
      const s = c.createGain();
      s.gain.value = rv;
      node.connect(s);
      s.connect(b.send);
    }
  }

  const wake = c => { if (c.state !== 'running' && c.resume) c.resume().catch(() => {}); };

  function tone(f, d, type = 'sine', v = 0.25, at = 0, to = 0, o = {}) {
    const c = getAudioContext(); if (!c) return; wake(c);
    const t0 = c.currentTime + at, os = c.createOscillator(), g = c.createGain(), a = Math.min(o.a || 0.006, d * 0.4);
    os.type = type;
    os.frequency.setValueAtTime(f, t0);
    if (to) os.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + (o.gl || d));
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    let last = os;
    if (o.lp) {
      const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp;
      os.connect(fl); last = fl;
    }
    last.connect(g);
    linkBus(c, g, o.rv);
    os.start(t0);
    os.stop(t0 + d + 0.04);
  }

  function noise(d, f, q, v, at = 0, o = {}) {
    const c = getAudioContext(); if (!c) return; wake(c);
    const sr = c.sampleRate, n = Math.max(1, Math.floor(sr * d)), b = c.createBuffer(1, n, sr), a = b.getChannelData(0), pw = o.pow || 3;
    for (let i = 0; i < n; i++) {
      a[i] = (Math.random() * 2 - 1) * (o.scratch ? (0.6 + 0.4 * Math.sin(i / sr * Math.PI * 2 * 40)) * Math.min(1, i / (sr * 0.02)) * Math.min(1, (n - i) / (n * 0.3)) : Math.pow(1 - i / n, pw));
    }
    const t0 = c.currentTime + at, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; fl.type = o.type || 'bandpass'; fl.frequency.setValueAtTime(f, t0);
    if (o.to) fl.frequency.exponentialRampToValueAtTime(Math.max(1, o.to), t0 + d);
    fl.Q.value = q; g.gain.value = Math.max(0.0001, v);
    s.connect(fl); fl.connect(g); linkBus(c, g, o.rv); s.start(t0);
  }

  // Musical Helpers
  const midiFreq = n => 440 * Math.pow(2, (n - 69) / 12);
  const bell = (n, d, v, at = 0, rv = 0.3) => {
    const f = midiFreq(n);
    tone(f, d, 'sine', v, at, 0, { rv });
    tone(f * 2.76, d * 0.6, 'sine', v * 0.3, at, 0, { rv });
  };
  const marimba = (n, d, v, at = 0) => {
    const f = midiFreq(n);
    tone(f, d, 'sine', v, at, 0, { a: 0.002, rv: 0.15 });
    tone(f * 3.98, d * 0.22, 'sine', v * 0.25, at, 0, { a: 0.002 });
    noise(0.012, f * 2.5, 2, v * 0.3, at);
  };
  const soft = (n, d, v, at = 0) => {
    const f = midiFreq(n);
    tone(f, d, 'triangle', v, at, 0, { rv: 0.2 });
    tone(f * 2, d * 0.6, 'sine', v * 0.25, at, 0, { rv: 0.2 });
  };

  // Harmonious Pentatonic Notes for numbers 1 to 9 (C Major Pentatonic)
  const NUM_PENTATONIC = [60, 62, 64, 67, 69, 72, 74, 76, 79]; // C4, D4, E4, G4, A4, C5, D5, E5, G5

  const SOUNDS = {
    tap: () => {
      noise(0.015, 2200, 1.2, 0.2);
      tone(650, 0.03, 'sine', 0.1, 0, 0, { a: 0.002 });
    },
    // Placing a number: plays musical pentatonic note based on the digit (1-9)
    num: n => {
      const idx = Math.max(0, Math.min(8, (parseInt(n, 10) || 1) - 1));
      const midi = NUM_PENTATONIC[idx];
      marimba(midi, 0.22, 0.25);
      noise(0.012, 2800, 1.4, 0.12);
    },
    // Note toggle (pencil mode)
    note: () => {
      noise(0.02, 3400, 1.5, 0.25, 0, { scratch: 1 });
      tone(850, 0.02, 'sine', 0.06);
    },
    erase: () => {
      noise(0.05, 1800, 1.1, 0.25, 0, { pow: 2.5 });
    },
    good: () => {
      soft(72, 0.18, 0.2);
      soft(76, 0.22, 0.14, 0.07);
    },
    // Row, column or 3x3 block completed! Uplifting chord
    blockComplete: () => {
      [64, 67, 72, 76].forEach((m, i) => marimba(m, 0.35, 0.22, i * 0.06));
    },
    // Gentle mistake sound (warm low wood thud, non-jarring)
    bad: () => {
      tone(125, 0.22, 'triangle', 0.28, 0, 85, { lp: 380 });
      noise(0.03, 400, 0.9, 0.25);
    },
    hint: () => {
      bell(84, 0.25, 0.14);
      bell(88, 0.35, 0.15, 0.08);
    },
    win: () => {
      // Dominican joyful fanfare (arpeggio + festive bells)
      [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => {
        soft(n, i > 4 ? 0.6 : 0.25, 0.22, i * 0.1);
      });
      [72, 76, 79, 84].forEach(n => bell(n, 1.4, 0.1, 0.75, 0.4));
    },
    lose: () => {
      [64, 60, 57].forEach((n, i) => {
        tone(midiFreq(n), 0.45, 'triangle', 0.2, i * 0.22, midiFreq(n) * 0.95, { rv: 0.3, lp: 1600 });
      });
    },
    levelup: () => {
      [72, 74, 76, 79, 81, 84].forEach((n, i) => soft(n, 0.15, 0.16, i * 0.07));
      bell(96, 0.7, 0.1, 0.44, 0.4);
    },
    achievement: () => {
      [76, 79, 84, 88].forEach((n, i) => bell(n, 0.5, 0.15, i * 0.08, 0.35));
    },
    // Skins SFX
    pencil: () => {
      noise(0.12, 3200, 0.9, 0.3, 0, { scratch: 1 });
      noise(0.15, 2600, 0.9, 0.24, 0.14, { scratch: 1 });
    },
    gold: () => {
      bell(88, 0.25, 0.12, 0.15);
      bell(95, 0.55, 0.14, 0.25, 0.4);
    },
    neon: () => {
      tone(120, 0.25, 'sawtooth', 0.06, 0, 0, { lp: 900 });
      tone(980, 0.22, 'sine', 0.12, 0.15, 0, { rv: 0.4 });
    },
    caoba: () => {
      marimba(67, 0.28, 0.3);
      marimba(72, 0.32, 0.25, 0.08);
    },
    // Win animations
    wflag: () => {
      for (let i = 0; i < 12; i++) noise(0.035, 1800, 1.1, 0.15 + i * 0.02, i * 0.06, { pow: 2 });
      tone(110, 0.3, 'sine', 0.35, 0.75, 55);
    },
    wfall: () => {
      for (let i = 0; i < 14; i++) {
        const t = 0.1 + i * 0.06 + Math.random() * 0.04;
        noise(0.04, 1300 - i * 40, 1.1, 0.4, t);
        tone(180 - i * 5, 0.08, 'sine', 0.18, t, 75);
      }
    },
    wfireworks: () => {
      for (let n = 0; n < 8; n++) {
        const t = 0.2 + n * 0.35;
        if (n) tone(450, 0.3, 'sine', 0.035, t - 0.28, 1600);
        noise(0.45, 300 + Math.random() * 200, 0.6, 0.5, t, { type: 'lowpass', pow: 2.2, rv: 0.5 });
        tone(80, 0.25, 'sine', 0.25, t, 40);
      }
    }
  };

  const VIBES = {
    tap: 8,
    num: 10,
    note: 6,
    erase: 10,
    good: 12,
    blockComplete: [15, 40, 15],
    hint: [10, 30, 10],
    win: [40, 60, 40, 60, 140],
    lose: [180],
    levelup: [30, 40, 30, 40, 80],
    achievement: [30, 50, 30]
  };

  function play(name, arg) {
    const fn = SOUNDS[name];
    if (cfg.sound && fn) {
      try { fn(arg); } catch (_) {}
    }
    if (VIBES[name] !== undefined) vibe(VIBES[name]);
  }

  // Event Listeners
  window.addEventListener('sudomi-feedback', e => {
    const d = e.detail || {};
    play(d.type, d.combo);
  });
  window.addEventListener('sudomi-win', () => play('win'));
  window.addEventListener('sudomi-levelup', () => setTimeout(() => play('levelup'), 600));
  window.addEventListener('sudomi-achievement', () => play('achievement'));

  document.addEventListener('click', e => {
    const btn = e.target.closest && e.target.closest('.num-btn');
    if (btn) {
      const numMatch = btn.textContent.match(/^[1-9]/);
      if (numMatch) play('num', parseInt(numMatch[0], 10));
      return;
    }
    const t = e.target.closest && e.target.closest('.cell, .tool, .icon-btn');
    if (t) play('tap');
  }, true);

  // Background Ambient Music Controller
  let bgmAudio = null;
  const Music = {
    isPlaying: () => !!bgmAudio && !bgmAudio.paused,
    play: (src) => {
      if (!src) return;
      if (!bgmAudio) {
        bgmAudio = new Audio(src);
        bgmAudio.loop = true;
      } else {
        bgmAudio.src = src;
      }
      bgmAudio.volume = cfg.musicVol;
      if (cfg.music) bgmAudio.play().catch(() => {});
    },
    pause: () => { if (bgmAudio) bgmAudio.pause(); },
    toggle: () => {
      cfg.music = !cfg.music;
      saveCfg();
      if (cfg.music) {
        if (bgmAudio) bgmAudio.play().catch(() => {});
      } else {
        if (bgmAudio) bgmAudio.pause();
      }
      return cfg.music;
    },
    setVolume: (v) => {
      cfg.musicVol = Math.min(1, Math.max(0, v));
      saveCfg();
      if (bgmAudio) bgmAudio.volume = cfg.musicVol;
    }
  };

  window.SudomiSound = {
    get cfg() { return { ...cfg }; },
    get info() { return { ios: isIOS, audio: ctx ? ctx.state : 'sin iniciar', vibe: !!nativeVibrate || isIOS }; },
    set(o) {
      cfg = { ...cfg, ...o };
      saveCfg();
      if (bus) bus.master.gain.value = cfg.vol;
      if (o.musicVol !== undefined && bgmAudio) bgmAudio.volume = cfg.musicVol;
      if (o.music === false && bgmAudio) bgmAudio.pause();
      if (o.music === true && bgmAudio) bgmAudio.play().catch(() => {});
    },
    play,
    music: Music,
    test() { unlock(); play('blockComplete'); },
    names: () => Object.keys(SOUNDS)
  };
})();
