/* Small shared helpers (no dependencies). Dates follow the current language. */
window.U = (() => {
  const TZ = "Asia/Kolkata";
  const L = window.I18N;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fmt = (iso, opts) => new Intl.DateTimeFormat(L.locale(), { timeZone: TZ, ...opts }).format(new Date(iso));
  const time = (iso) => (L.lang === "hi"
    ? fmt(iso, { hour: "numeric", minute: "2-digit", dayPeriod: "short" })
    : fmt(iso, { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase());
  const dayNum = (iso) => fmt(iso, { day: "numeric" });
  const month = (iso) => fmt(iso, { month: "long" });
  const shortDate = (iso) => fmt(iso, { day: "numeric", month: "short" });
  const longDate = (iso) => fmt(iso, { weekday: "long", day: "numeric", month: "long" });
  const fullDate = (iso) => fmt(iso, { day: "numeric", month: "long", year: "numeric" });

  const coords = (v) => (v.lat != null ? `${v.lat},${v.lng}` : "");
  const place = (v) => [L.tx(v.name), L.tx(v.address)].filter(Boolean).join(", ");
  // Opens Google Maps in directions mode: destination pre-filled, guest picks a start
  // (phones open the Maps app and offer "Your location").
  const mapsDir = (v) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coords(v) || place(v))}`;
  const mapsEmbed = (v) => `https://maps.google.com/maps?q=${encodeURIComponent(coords(v) || place(v))}&z=16&output=embed`;
  return { $, $$, esc, reducedMotion, time, dayNum, month, shortDate, longDate, fullDate, place, mapsDir, mapsEmbed };
})();
