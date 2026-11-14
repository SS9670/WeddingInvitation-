/* Traditional background music, generated in the browser (no audio file):
 * santoor in Raag Yaman over a tanpura drone, with soft keherwa tabla.
 * Santoor strings are physically modelled (Karplus-Strong), so it sounds plucked/hammered.
 *
 * Autoplay: browsers never allow sound before the visitor's first tap/key,
 * so music arms on load and starts on the very first interaction anywhere
 * (opening the envelope, Skip, or any tap). A guest who pauses stays paused.
 * Uses W.music.src instead when an MP3 is configured. */
(() => {
  const W = window.WEDDING, btn = window.U.$("#musicBtn");
  let playing = false, userPaused = false, audio = null, ctx, out, timer;
  try { userPaused = sessionStorage.getItem("music-off") === "1"; } catch (_) {}

  // ---- Raag Yaman (tivra Ma), Sa = D ----
  const SA = 293.66;
  const R = { "D.": 5 / 6, "N.": 15 / 16, S: 1, R: 9 / 8, G: 5 / 4, M: 45 / 32, P: 3 / 2, D: 5 / 3, N: 15 / 8, "S'": 2, "R'": 9 / 4, "G'": 5 / 2 };
  const BEAT = 0.72; // ~83 bpm
  // each phrase = one 8-beat keherwa cycle; "-" is a rest
  const PHRASES = [
    [["N.", .5], ["R", .5], ["G", 1], ["M", .5], ["G", .5], ["R", 1], ["S", 2], ["-", 2]],
    [["N.", .5], ["R", .5], ["G", .5], ["M", .5], ["P", 2], ["M", .5], ["G", .5], ["R", 1], ["-", 2]],
    [["G", .5], ["M", .5], ["D", .5], ["N", .5], ["S'", 2], ["N", .5], ["D", .5], ["P", 1], ["-", 2]],
    [["M", .5], ["D", .5], ["N", .5], ["R'", .5], ["S'", 1], ["N", .5], ["D", .5], ["P", .5], ["M", .5], ["G", .5], ["R", .5], ["S", 1], ["-", 1]],
    [["G", 1], ["M", .5], ["P", .5], ["D", 1], ["N", .5], ["S'", .5], ["R'", 1], ["G'", 1], ["R'", .5], ["S'", .5], ["-", 1]],
    [["M", .5], ["D", .5], ["N", .5], ["R'", .5], ["S'", 1], ["N", .5], ["D", .5], ["P", .5], ["M", .5], ["G", .5], ["R", .5], ["S", 1], ["-", 1]],
    [["P", .5], ["M", .5], ["G", .5], ["R", .5], ["N.", .5], ["R", .5], ["S", 3], ["-", 2]],
  ];
  // keherwa: Dha Ge Na Ti | Na Ka Dhi Na
  const THEKA = ["dha", "ge", "na", "ti", "na", "ka", "dhi", "na"];

  function setUI(on) {
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", window.I18N.t(on ? "pause" : "play"));
  }
  document.addEventListener("lang:change", () => setUI(playing));

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    out = ctx.createGain(); out.gain.value = 0;
    const verb = ctx.createConvolver(), len = ctx.sampleRate * 2.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
    verb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    out.connect(ctx.destination); out.connect(verb).connect(wet).connect(ctx.destination);
  }

  // ---- santoor: Karplus-Strong string, two slightly detuned strings per note ----
  const cache = new Map();
  function string(freq) {
    if (cache.has(freq)) return cache.get(freq);
    const sr = ctx.sampleRate, n = Math.floor(sr * 2.4), y = new Float32Array(n);
    const D = sr / freq - 0.5, Ni = Math.floor(D), fr = D - Ni;
    for (let i = 0; i <= Ni + 2 && i < n; i++) y[i] = (Math.random() * 2 - 1) * (i < Ni * 0.5 ? 1 : 0.6); // hammer burst
    for (let i = Ni + 2; i < n; i++) {
      const a = 0.5 * (y[i - Ni] + y[i - Ni - 1]), b = 0.5 * (y[i - Ni - 1] + y[i - Ni - 2]);
      y[i] = 0.9975 * ((1 - fr) * a + fr * b);
    }
    const b = ctx.createBuffer(1, n, sr); b.copyToChannel(y, 0);
    cache.set(freq, b);
    return b;
  }
  function strike(freq, t, vel = 1) {
    const g = ctx.createGain(), hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 180;
    g.gain.value = 0.11 * vel;
    [1, 1.0025].forEach((rate) => { const s = ctx.createBufferSource(); s.buffer = string(freq); s.playbackRate.value = rate; s.connect(hp); s.start(t); });
    hp.connect(g).connect(out);
  }
  // long notes are sustained the santoor way: a soft tremolo of repeated strokes
  function santoorNote(freq, t, dur) {
    if (dur < 1.2) return strike(freq, t);
    strike(freq, t);
    for (let k = t + 0.13, v = 0.55; k < t + dur - 0.2; k += 0.13, v *= 0.93) strike(freq, k, Math.max(v, 0.22));
  }

  // ---- tanpura drone ----
  function tanpura(freq, t) {
    const env = ctx.createGain(), lp = ctx.createBiquadFilter(), dur = 4.2;
    lp.type = "lowpass"; lp.Q.value = 8;
    lp.frequency.setValueAtTime(2400, t); lp.frequency.exponentialRampToValueAtTime(480, t + dur);
    env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(0.04, t + 0.03); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [1, 1.002].forEach((m) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = freq * m; o.connect(lp); o.start(t); o.stop(t + dur); });
    lp.connect(env).connect(out);
  }

  // ---- tabla (soft) ----
  function ring(freq, t, decay, gain) { // dayan: tuned ringing partials
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    [[1, 1], [2, 0.5], [3, 0.3], [4.1, 0.15]].forEach(([m, a]) => {
      const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = freq * m; og.gain.value = a;
      o.connect(og).connect(g); o.start(t); o.stop(t + decay + 0.05);
    });
    g.connect(out);
  }
  function bass(t, gain = 0.2) { // bayan: pitch-dropping "ge"
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(68, t + 0.3);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g).connect(out); o.start(t); o.stop(t + 0.6);
  }
  function slap(t) { // "ka": short muted hit
    const s = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), n = Math.floor(ctx.sampleRate * 0.05);
    const b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
    s.buffer = b; lp.type = "lowpass"; lp.frequency.value = 900; g.gain.value = 0.25;
    s.connect(lp).connect(g).connect(out); s.start(t);
  }
  function bol(b, t) {
    const T = SA; // dayan tuned to Sa
    if (b === "dha") { ring(T, t, 0.45, 0.07); bass(t); }
    else if (b === "dhi") { ring(T, t, 0.2, 0.05); bass(t, 0.17); }
    else if (b === "ge") bass(t, 0.16);
    else if (b === "na") ring(T, t, 0.4, 0.06);
    else if (b === "ti") ring(T * 1.5, t, 0.12, 0.04);
    else if (b === "ka") slap(t);
  }

  // ---- scheduler ----
  let nextPluck = 0, step = 0, nextCycle = 0, cycle = 0;
  function schedule() {
    const ahead = ctx.currentTime + 2.5;
    const drone = [SA * 0.375, SA * 0.5, SA * 0.5, SA * 0.25]; // Pa, Sa, Sa, low Sa
    while (nextPluck < ahead) { tanpura(drone[step % 4], nextPluck); nextPluck += 1.45; step++; }
    while (nextCycle < ahead) {
      let t = nextCycle;
      PHRASES[cycle % PHRASES.length].forEach(([n, b]) => { if (n !== "-") santoorNote(SA * R[n], t, b * BEAT); t += b * BEAT; });
      if (cycle >= 2) THEKA.forEach((b, i) => bol(b, nextCycle + i * BEAT)); // tabla joins after the opening
      nextCycle += 8 * BEAT; cycle++;
    }
  }

  function startSynth() {
    if (!ctx) setup();
    ctx.resume();
    const now = ctx.currentTime;
    if (!timer) {
      if (nextPluck <= now) { nextPluck = now + 0.1; nextCycle = now + 2.2; }
      schedule(); timer = setInterval(schedule, 300);
    }
    out.gain.cancelScheduledValues(now); out.gain.setValueAtTime(out.gain.value, now); out.gain.linearRampToValueAtTime(0.9, now + 2.5);
  }
  function stopSynth() {
    if (!ctx) return;
    const now = ctx.currentTime;
    out.gain.cancelScheduledValues(now); out.gain.setValueAtTime(out.gain.value, now); out.gain.linearRampToValueAtTime(0, now + 0.8);
    clearInterval(timer); timer = null;
    setTimeout(() => { if (!playing) ctx.suspend(); }, 900);
  }

  const running = () => (W.music.src ? !!audio && !audio.paused : !!ctx && ctx.state === "running");

  function play(on) {
    playing = on;
    if (W.music.src) {
      audio = audio || Object.assign(new Audio(W.music.src), { loop: true, volume: 0.5 });
      if (on) audio.play().then(() => setUI(true), () => setUI(false)); else audio.pause();
    } else if (on) {
      startSynth();
      ctx.resume().then(() => setUI(running()), () => setUI(false));
    } else stopSynth();
    setUI(on && running());
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const on = !(playing && running());
    userPaused = !on;
    try { sessionStorage.setItem("music-off", userPaused ? "1" : "0"); } catch (_) {}
    unlockIOS();
    play(on);
  });

  // iPhones mute Web Audio when the ring/silent switch is on; a silent looping
  // <audio> started in the same tap moves the page to the "media" channel.
  let unlocked = false;
  function unlockIOS() {
    if (unlocked) return; unlocked = true;
    const n = 800, b = new Uint8Array(44 + n), v = new DataView(b.buffer), str = (o, t) => [...t].forEach((c, i) => (b[o + i] = c.charCodeAt(0)));
    str(0, "RIFF"); v.setUint32(4, 36 + n, true); str(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); str(36, "data"); v.setUint32(40, n, true); b.fill(128, 44);
    const el = new Audio("data:audio/wav;base64," + btoa(String.fromCharCode(...b)));
    el.loop = true; el.setAttribute("playsinline", ""); el.play().catch(() => { unlocked = false; });
  }

  // ---- autoplay ----
  // Browsers only allow sound after a real tap/click/key, so keep trying on every
  // such event until audio is actually running (a touch that starts a scroll doesn't count).
  const gestures = ["pointerup", "touchend", "click", "keydown", "mousedown"];
  const detach = () => gestures.forEach((g) => document.removeEventListener(g, tryStart, true));
  function tryStart(e) {
    if (e?.target?.closest?.("#musicBtn")) return; // the toggle handles itself
    if (userPaused) return detach();
    if (e) unlockIOS();
    play(true);
    if (running()) detach();
    else if (ctx) ctx.resume().then(() => { if (running()) { detach(); setUI(true); } }, () => {});
  }
  gestures.forEach((g) => document.addEventListener(g, tryStart, true));
  document.addEventListener("invite:music", () => tryStart({}));
  // also try right away — some browsers (or a guest who allowed sound for the site) permit it
  if (!userPaused && !W.music.src) tryStart();

  // pause while the tab is hidden, resume when the guest comes back
  let resumeOnShow = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) { resumeOnShow = true; play(false); }
    else if (!document.hidden && resumeOnShow) { resumeOnShow = false; play(true); }
  });
})();
