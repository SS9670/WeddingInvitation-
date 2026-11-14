/* Renders every data-driven part of the page from window.WEDDING,
 * and re-renders it whenever the language changes. */
(() => {
  const W = window.WEDDING, L = window.I18N, { $, $$, esc } = window.U;
  const { groom, bride } = W.couple;
  const V = W.venue;
  // bride-side card: the bride is named first
  const coupleTitle = () => `${L.tx(bride.first)} ${L.t("amp")} ${L.tx(groom.first)}`;

  // ---- one-time decoration: petals + hanging marigold toran ----
  if (!U.reducedMotion) {
    $(".hero__petals").innerHTML = Array.from({ length: 11 }, (_, i) => {
      const left = (i * 9.3 + (i % 3) * 4) % 100, d = 11 + (i % 5) * 2.4, delay = -i * 1.7, s = 0.7 + (i % 4) * 0.18;
      const col = ["#e8a03a", "#f0b84a", "#c9482f", "#f3c86b"][i % 4];
      return `<span class="petal" style="left:${left}%;--d:${d}s;--delay:${delay}s;color:${col};scale:${s}"><svg><use href="#i-petal"/></svg></span>`;
    }).join("");
  }
  $("#toran").innerHTML = [2, 3, 3, 4, 3, 3, 2].map((n, i) => `
    <span class="strand" style="--n:${n};--i:${i}">${Array.from({ length: n }, (_, k) =>
      `<svg style="color:${k % 2 ? "#e9a23b" : "#d9792a"}"><use href="#i-marigold"/></svg>`).join("")}</span>`).join("");

  // ---- text bindings ----
  function bindText() {
    const binds = {
      groomFirst: L.tx(groom.first), brideFirst: L.tx(bride.first), dateLabel: U.fullDate(W.weddingDate), city: L.tx(W.city),
      tagline: L.tx(W.tagline), intro: L.tx(W.intro), monogram: W.monogram, invitation: L.tx(W.invitation), vineet: L.tx(W.vineet),
      venueName: L.tx(V.name), venueAddress: L.tx(V.address), venueWhen: L.tx(V.when),
      venueCoords: V.lat != null ? `${V.lat}° ${L.t("north")}, ${V.lng}° ${L.t("east")}` : "",
      closingLine: L.tx(W.closing.line), closingSub: L.tx(W.closing.sub), closingThanks: L.tx(W.closing.thanks),
    };
    $$("[data-bind]").forEach((n) => { n.textContent = binds[n.dataset.bind] ?? ""; });
    document.title = `${coupleTitle()} · ${L.t("title")}`;
  }

  // ---- couple ----
  function renderCouple() {
    const person = (p, role) => {
      const hon = L.tx(p.honorific);
      const ph = p.photo, name = esc(L.tx(p.first));
      const photo = ph?.src ? `<figure class="person__photo"><img src="${esc(ph.src)}" width="${ph.w}" height="${ph.h}" alt="${name}" loading="lazy" decoding="async" /></figure>` : "";
      return `<div class="person">${photo}<p class="eyebrow person__role">${L.t(role)}</p>
        <h2 class="person__name">${hon ? `<small>${esc(hon)}</small>` : ""}${esc(L.tx(p.first))}</h2>
        <ul class="person__family">${p.lines.map((l) => `<li>${esc(L.tx(l))}</li>`).join("")}</ul>
        <p class="person__addr">${esc(L.tx(p.address))}</p></div>`;
    };
    $("#coupleGrid").innerHTML = person(bride, "bride") + `<span class="couple__amp" aria-hidden="true">${esc(L.t("amp"))}</span>` + person(groom, "groom");
  }

  // ---- venue: directions + map (iframe loads only when near) ----
  $("#directionsBtn").href = U.mapsDir(V);
  new IntersectionObserver((en, ob) => {
    if (en[0].isIntersecting) { $("#venueMap").src = U.mapsEmbed(V); ob.disconnect(); }
  }, { rootMargin: "400px" }).observe($("#venue"));

  // ---- full render (initial + on language change) ----
  function render(animate) {
    L.applyStatic();
    bindText();
    renderCouple();
    $("#shareBtn").href = `https://wa.me/?text=${encodeURIComponent(`${W.shareMessage}\n${location.href.split(/[?#]/)[0]}`)}`;
  }
  render(false);

  // ---- language switch: soft crossfade while the text changes ----
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".lang"); if (!b) return;
    ev.stopPropagation();
    const next = L.lang === "en" ? "hi" : "en";
    const fadeTargets = [$("main"), $("#intro")].filter((n) => n && !n.classList.contains("is-gone"));
    if (U.reducedMotion) { L.set(next); return; }
    // The language flips on a timer, not on animation end, so it can never get stuck.
    const outs = fadeTargets.map((n) => n.animate([{ opacity: 1 }, { opacity: 0.15 }], { duration: 200, fill: "forwards" }));
    setTimeout(() => {
      L.set(next);
      outs.forEach((a) => a.cancel());
      fadeTargets.forEach((n) => n.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 450, easing: "ease-out" }));
    }, 200);
  });
  document.addEventListener("lang:change", () => render(false));
})();
