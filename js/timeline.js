/* Ceremonies as a scroll timeline.
 * - A gold line draws down the track as the guest scrolls through the section.
 * - Each ceremony slides in when it reaches the screen, and its node lights up
 *   once the line has reached it.
 * Re-rendered on language change; items already shown stay shown. */
(() => {
  const W = window.WEDDING, L = window.I18N, { $, $$, esc } = window.U, V = W.venue;
  const root = $("#timeline"), list = $("#timelineList");
  const motif = { haldi: "i-marigold", mehendi: "i-paisley", sangeet: "i-dholak", wedding: "i-mandap", reception: "i-lantern" };
  const weekday = (iso) => new Intl.DateTimeFormat(L.locale(), { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date(iso));
  const seen = new Set();

  // only the details the card actually gives (time / venue / dress code)
  function rows(e) {
    const r = [];
    // `time` may carry the card's own wording ({ en, hi }); otherwise it is formatted from start/end
    if (e.time) r.push([L.t("time"), typeof e.time === "object" ? esc(L.tx(e.time)) : U.time(e.start) + (e.end ? ` – ${U.time(e.end)}` : "")]);
    if (e.atVenue) r.push([L.t("venue"), `${esc(L.tx(V.name))}<small>${esc(L.tx(V.address))}</small>`]);
    if (e.dress) r.push([L.t("dress"), esc(L.tx(e.dress))]);
    return r.length ? `<dl class="tl-card__rows">${r.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>` : "";
  }

  const item = (e, i) => `
    <li class="tl-item${seen.has(e.id) ? " is-in" : ""}" data-id="${e.id}" data-theme="${e.theme}" style="--i:${i}">
      <span class="tl-node" aria-hidden="true"><svg><use href="#${motif[e.theme]}"/></svg></span>
      <p class="tl-date">
        <b>${U.dayNum(e.start)}</b>
        <span><span class="tl-date__month">${U.month(e.start)}</span><span class="tl-date__day">${weekday(e.start)}</span></span>
      </p>
      <article class="tl-card">
        <h3>${esc(L.tx(e.name))} <em>${esc(L.tx(e.subtitle))}</em></h3>
        <p class="tl-card__text">${esc(L.tx(e.text))}</p>
        ${rows(e)}
        ${e.atVenue ? `<a class="btn btn--gold btn--small tl-card__btn" href="${U.mapsDir(V)}" target="_blank" rel="noopener">${L.t("directions")}</a>` : ""}
      </article>
    </li>`;

  // ---- reveal each ceremony as it enters the screen ----
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    seen.add(en.target.dataset.id);
    io.unobserve(en.target);
  }), { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

  function render() {
    list.innerHTML = W.events.map(item).join("");
    $$(".tl-item", list).forEach((n) => (U.reducedMotion ? n.classList.add("is-in") : !n.classList.contains("is-in") && io.observe(n)));
    progress();
  }

  // ---- the line fills up to ~60% of the screen height as the guest scrolls ----
  let ticking = false;
  function progress() {
    ticking = false;
    const r = list.getBoundingClientRect();
    if (!r.height) return;
    const line = innerHeight * 0.6;
    const p = U.reducedMotion ? 1 : Math.min(1, Math.max(0, (line - r.top) / r.height));
    root.style.setProperty("--p", p.toFixed(4));
    const reach = r.top + p * r.height;
    $$(".tl-node", list).forEach((n) => {
      const b = n.getBoundingClientRect();
      n.parentElement.classList.toggle("is-reached", b.top + b.height / 2 <= reach + 1);
    });
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(progress); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  document.addEventListener("invite:open", queue);
  document.addEventListener("lang:change", render);
  render();
})();
