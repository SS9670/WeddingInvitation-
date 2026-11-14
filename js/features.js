/* Page behaviour: reveals, nav, countdown. */
(() => {
  const W = window.WEDDING, { $, $$ } = window.U;

  // ---------- scroll reveals (start once the envelope is open) ----------
  // A fully clipped (mask) element never reports as visible, so those are
  // triggered by watching their parent instead.
  const watch = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      watch.get(en.target).forEach((n) => n.classList.add("is-in"));
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  const startReveals = () => $$("[data-reveal]").forEach((n) => {
    const t = n.dataset.reveal === "mask" ? n.parentElement : n;
    if (!watch.has(t)) { watch.set(t, []); io.observe(t); }
    watch.get(t).push(n);
  });
  if (document.body.classList.contains("is-open")) startReveals();
  else document.addEventListener("invite:open", startReveals, { once: true });

  // hero animations only run while the hero is on screen
  new IntersectionObserver(([en]) => $("#home").classList.toggle("is-visible", en.isIntersecting)).observe($("#home"));

  // ---------- navigation ----------
  const links = $("#navLinks"), toggle = $("#navToggle");
  const setMenu = (open) => { links.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", open); };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$("a", links).forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // Transparent at the very top; once scrolled it is a solid bar that hides while
  // scrolling down and slides back on any scroll up. Stays put while the menu is open.
  const nav = $("#nav");
  let lastY = scrollY, ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.max(0, scrollY), dy = y - lastY, menuOpen = links.classList.contains("is-open");
      nav.classList.toggle("is-solid", y > 10);
      if (y <= nav.offsetHeight || menuOpen) nav.classList.remove("is-hidden");
      else if (dy > 6) nav.classList.add("is-hidden");
      else if (dy < -6) nav.classList.remove("is-hidden");
      if (Math.abs(dy) > 6 || y <= nav.offsetHeight) lastY = y;
      ticking = false;
    });
  }, { passive: true });

  // ---------- countdown (labels + digits follow the language) ----------
  const L = window.I18N, cd = $("#countdown"), target = new Date(W.weddingDate).getTime();
  const units = [["days", 86400], ["hours", 3600], ["minutes", 60], ["seconds", 1]];
  let nums = {}, timer = null;
  function build() {
    cd.innerHTML = units.map(([k], i) => `${i ? '<span class="countdown__sep"></span>' : ""}<div class="countdown__unit"><span class="countdown__num" data-u="${k}"></span><span class="countdown__lbl">${L.t(k)}</span></div>`).join("");
    nums = Object.fromEntries($$(".countdown__num", cd).map((n) => [n.dataset.u, n]));
  }
  function tick() {
    let s = Math.floor((target - Date.now()) / 1000);
    if (s <= 0) {
      cd.innerHTML = `<p class="countdown__done">${L.t(Date.now() - target > 86400000 ? "after" : "today")}</p>`;
      clearInterval(timer); timer = null;
      return;
    }
    units.forEach(([k, sec]) => { const v = Math.floor(s / sec); s -= v * sec; const t = L.num(v, 2); if (nums[k].textContent !== t) nums[k].textContent = t; });
  }
  function start() { build(); tick(); if (!timer && target > Date.now()) timer = setInterval(tick, 1000); }
  start();
  document.addEventListener("lang:change", start);
})();
