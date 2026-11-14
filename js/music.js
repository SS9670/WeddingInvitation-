/* Background music: loops the track set in W.music.src at a soft volume.
 *
 * The file itself is mastered quiet (~-26 LUFS) because iPhones ignore
 * audio.volume; W.music.volume lowers it further on browsers that honour it.
 *
 * Autoplay: browsers never allow sound before the visitor's first tap/key,
 * so music arms on load and starts on the very first interaction anywhere
 * (opening the envelope, Skip, or any tap). A guest who pauses stays paused. */
(() => {
  const W = window.WEDDING, btn = window.U.$("#musicBtn");
  if (!W.music?.src) { btn.hidden = true; return; }

  const VOLUME = W.music.volume ?? 0.35;
  const audio = Object.assign(new Audio(W.music.src), { loop: true, preload: "auto", volume: 0 });
  audio.setAttribute("playsinline", "");

  let playing = false, userPaused = false, fade;
  try { userPaused = sessionStorage.getItem("music-off") === "1"; } catch (_) {}

  const running = () => !audio.paused;

  function setUI(on) {
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", window.I18N.t(on ? "pause" : "play"));
  }
  document.addEventListener("lang:change", () => setUI(playing && running()));

  // gentle fade in/out; no-op on iOS where volume is read-only
  function fadeTo(target, ms, done) {
    clearInterval(fade);
    const start = audio.volume, steps = Math.max(1, Math.round(ms / 50));
    let i = 0;
    fade = setInterval(() => {
      i++;
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
      if (i >= steps) { clearInterval(fade); done?.(); }
    }, 50);
  }

  function play(on) {
    playing = on;
    if (on) {
      const p = audio.play();
      fadeTo(VOLUME, 1500);
      return Promise.resolve(p).then(() => setUI(true), () => { playing = false; setUI(false); });
    }
    fadeTo(0, 500, () => { if (!playing) audio.pause(); });
    setUI(false);
    return Promise.resolve();
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const on = !(playing && running());
    userPaused = !on;
    try { sessionStorage.setItem("music-off", userPaused ? "1" : "0"); } catch (_) {}
    play(on);
  });

  // ---- autoplay on first real gesture ----
  const gestures = ["pointerup", "touchend", "click", "keydown", "mousedown"];
  const detach = () => gestures.forEach((g) => document.removeEventListener(g, tryStart, true));
  function tryStart(e) {
    if (e?.target?.closest?.("#musicBtn")) return; // the toggle handles itself
    if (userPaused) return detach();
    if (playing && running()) return detach();
    play(true).then(() => { if (running()) detach(); });
  }
  gestures.forEach((g) => document.addEventListener(g, tryStart, true));
  document.addEventListener("invite:music", () => tryStart({}));

  // pause while the tab is hidden, resume when the guest comes back
  let resumeOnShow = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) { resumeOnShow = true; play(false); }
    else if (!document.hidden && resumeOnShow) { resumeOnShow = false; play(true); }
  });
})();
