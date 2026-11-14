/* Envelope reveal: seal breaks → flap opens → card rises → page appears. */
(() => {
  const { $ } = window.U;
  const intro = $("#intro"), env = $("#env"), seal = $("#seal");
  const flap = $(".env__flap", env), card = $(".env__card", env);
  const EASE = "cubic-bezier(.22,.8,.24,1)";
  let opened = false;

  function finish() {
    intro.classList.add("is-gone");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-open");
    document.dispatchEvent(new Event("invite:open"));
    $("#home").focus?.({ preventScroll: true });
  }

  function burst() {
    const colors = ["#e8a03a", "#f3c86b", "#c9482f", "#efdcae"];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("span");
      p.className = "intro__petal";
      p.style.color = colors[i % 4];
      p.innerHTML = '<svg width="100%" height="100%"><use href="#i-petal"/></svg>';
      intro.appendChild(p);
      const a = (i / 26) * Math.PI * 2, r = 160 + Math.random() * 260;
      p.animate([
        { transform: "translate(-50%,-50%) scale(.4) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r + 140}px)) scale(1) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ], { duration: 1800 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
    }
  }

  async function open() {
    if (opened) return;
    opened = true;
    $("#openInvite").disabled = true;
    document.dispatchEvent(new Event("invite:music"));
    if (window.U.reducedMotion) {
      await intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished;
      return finish();
    }
    // 1. seal cracks apart
    seal.classList.add("is-broken");
    $(".seal__mono", seal).animate([{ opacity: 1 }, { opacity: 0, transform: "scale(1.3)" }], { duration: 300, fill: "forwards" });
    $(".seal__half--l", seal).animate([{ transform: "none", opacity: 1 }, { transform: "translate(-26px, 30px) rotate(-28deg)", opacity: 0 }], { duration: 700, easing: EASE, fill: "forwards" });
    await $(".seal__half--r", seal).animate([{ transform: "none", opacity: 1 }, { transform: "translate(26px, 34px) rotate(24deg)", opacity: 0 }], { duration: 700, easing: EASE, fill: "forwards" }).finished;
    // 2. flap swings open (drops behind the card halfway through)
    await flap.animate([
      { transform: "rotateX(0deg)", zIndex: 4 },
      { transform: "rotateX(90deg)", zIndex: 4, offset: 0.5 },
      { transform: "rotateX(90deg)", zIndex: 1, offset: 0.501 },
      { transform: "rotateX(180deg)", zIndex: 1 },
    ], { duration: 900, easing: "cubic-bezier(.45,0,.3,1)", fill: "forwards" }).finished;
    // 3. card rises out of the envelope
    burst();
    await card.animate([{ transform: "translateY(0)" }, { transform: "translateY(-58%)" }], { duration: 1000, easing: EASE, fill: "forwards" }).finished;
    // 4. dissolve into the page
    document.body.classList.add("is-open");
    await intro.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.08)" }], { duration: 900, easing: "ease-in", delay: 250, fill: "forwards" }).finished;
    finish();
  }

  $("#openInvite").addEventListener("click", open);
  $("#skipInvite").addEventListener("click", () => { opened = true; finish(); });
  env.addEventListener("click", open);
  // A guest who already opened it this session goes straight in.
  try { if (sessionStorage.getItem("invite-opened")) { opened = true; finish(); } } catch (_) {}
  document.addEventListener("invite:open", () => { try { sessionStorage.setItem("invite-opened", "1"); } catch (_) {} });
})();
