/* Card extras that the base template does not have: the Sanskrit shlokas and the
 * family blocks (स्वागताकांक्षी / दर्शनाभिलाषी / निमंत्रक with call buttons).
 * Re-rendered on language change. No [data-reveal] inside: those nodes are
 * replaced on every render, so the reveal sits on the static wrappers instead. */
(() => {
  const W = window.WEDDING, L = window.I18N, { $, esc } = window.U, F = W.family;
  const phoneIcon = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';
  const pretty = (n) => `${n.slice(0, 5)} ${n.slice(5)}`;

  const card = (title, body, cls = "") => `
    <article class="fcard ${cls}">
      <p class="fcard__title">${esc(title)}</p>
      <svg class="fcard__rule" aria-hidden="true"><use href="#i-divider" /></svg>
      ${body}
    </article>`;

  function render() {
    $("#shlokas").innerHTML = W.shlokas.map((s) => `<p>${esc(s).replace(/\n/g, "<br>")}</p>`).join("");

    const welcome = `<ul class="fcard__list">${F.welcome.map((p) =>
      `<li><b>${esc(L.tx(p.name))}</b><small>${esc(L.tx(p.rel))}</small></li>`).join("")}</ul>`;
    const awaiting = `<p class="fcard__names">${esc(L.tx(F.awaiting.names))}</p><p class="fcard__all">${esc(L.tx(F.awaiting.all))}</p>`;
    const hosts = `<ul class="fcard__list">${F.hosts.names.map((n) => `<li><b>${esc(L.tx(n))}</b></li>`).join("")}</ul>
      <p class="fcard__addr">${esc(L.tx(F.hosts.address))}</p>
      <div class="fcard__calls">${F.hosts.phones.map((p) =>
        `<a class="btn btn--ghost btn--small" href="tel:+91${p}" aria-label="${esc(L.t("call"))} ${p}">${phoneIcon}<span>${pretty(p)}</span></a>`).join("")}</div>`;

    $("#familyGrid").innerHTML = card(L.t("welcomeLbl"), welcome) + card(L.t("awaitingLbl"), awaiting) + card(L.t("hostsLbl"), hosts, "fcard--hosts");
  }

  render();
  document.addEventListener("lang:change", render);
})();
