/* Ornamental section border (like an illustrated book cover / invitation card):
 * patterned top band with a central lotus crest, carved side pillars, corner
 * rosette medallions, and a bottom band of almond cartouches.
 * Drawn in real pixels for the element's size and re-drawn on resize.
 * Usage: <div class="border-frame" data-theme="light|dark"></div> */
(() => {
  const { $$ } = window.U;
  const n = (v) => +v.toFixed(1);

  const lotus = (x, y, z) => `<g transform="translate(${n(x)} ${n(y)}) scale(${n(z)})">
    <path d="M0 -7C3.5 -3 3.5 2 0 6C-3.5 2 -3.5 -3 0 -7Z"/>
    <path d="M0 6C-5 4 -8 0 -8 -4C-4 -3 -1 1 0 6ZM0 6C5 4 8 0 8 -4C4 -3 1 1 0 6Z" opacity=".7"/></g>`;
  const diamond = (x, y, s) => `<path d="M${n(x)} ${n(y - s)}L${n(x + s)} ${n(y)}L${n(x)} ${n(y + s)}L${n(x - s)} ${n(y)}Z"/>`;
  const rosette = (x, y, r, bg) => `<g transform="translate(${n(x)} ${n(y)})">
    <circle r="${n(r)}" fill="${bg}"/><circle r="${n(r - 3)}" opacity=".6"/>
    ${Array.from({ length: 8 }, (_, i) => `<ellipse rx="${n(r * 0.16)}" ry="${n(r * 0.36)}" cy="${n(-r * 0.42)}" transform="rotate(${i * 45})" class="bf-tint"/>`).join("")}
    <circle r="${n(r * 0.16)}" class="bf-solid"/></g>`;

  function draw(W, H, theme) {
    const dark = theme === "dark", compact = W < 700;
    const stroke = dark ? "#d8b878" : "#b88a44", bg = dark ? "#3d1019" : "#f4e6cf";
    const bh = compact ? 24 : 44;          // band height
    const sw = compact ? 12 : 44;          // side (pillar) width
    const o = 5;                            // gap between outer and inner rule
    const parts = [];

    // rules + band fills
    parts.push(`<rect x="0.7" y="0.7" width="${n(W - 1.4)}" height="${n(H - 1.4)}"/>`);
    parts.push(`<rect x="${o}" y="${o}" width="${n(W - 2 * o)}" height="${n(H - 2 * o)}" opacity=".55"/>`);
    parts.push(`<rect class="bf-band" x="${o}" y="${o}" width="${n(W - 2 * o)}" height="${n(bh - o)}"/>`);
    parts.push(`<rect class="bf-band" x="${o}" y="${n(H - bh)}" width="${n(W - 2 * o)}" height="${n(bh - o)}"/>`);
    parts.push(`<path d="M${o} ${bh}H${n(W - o)}M${o} ${n(H - bh)}H${n(W - o)}"/>`);

    // side borders: pillars on wide screens, a double rule on phones
    const top = bh, bot = H - bh;
    if (compact) {
      parts.push(`<path d="M${sw} ${top}V${n(bot)}M${n(W - sw)} ${top}V${n(bot)}" opacity=".7"/>`);
    } else {
      const pillar = (x0) => {
        const x1 = x0 + sw - 2 * o, shaft = [x0 + 7, x1 - 7];
        return `<rect x="${n(shaft[0])}" y="${n(top + 30)}" width="${n(shaft[1] - shaft[0])}" height="${n(bot - top - 60)}"/>
          <path d="M${n(shaft[0] + 7)} ${n(top + 36)}V${n(bot - 36)}M${n((shaft[0] + shaft[1]) / 2)} ${n(top + 36)}V${n(bot - 36)}M${n(shaft[1] - 7)} ${n(top + 36)}V${n(bot - 36)}" opacity=".45"/>
          <rect class="bf-tint" x="${n(x0 + 2)}" y="${n(top + 14)}" width="${n(x1 - x0 - 4)}" height="16"/>
          <rect class="bf-tint" x="${n(x0 + 2)}" y="${n(bot - 30)}" width="${n(x1 - x0 - 4)}" height="16"/>
          <path d="M${n(x0)} ${n(top + 14)}H${n(x1)}M${n(x0)} ${n(bot - 14)}H${n(x1)}"/>
          ${diamond((x0 + x1) / 2, H / 2, 7)}<circle cx="${n((x0 + x1) / 2)}" cy="${n(H / 2)}" r="13" opacity=".6"/>`;
      };
      parts.push(`<path d="M${sw} ${top}V${n(bot)}M${n(W - sw)} ${top}V${n(bot)}"/>`);
      parts.push(pillar(o), pillar(W - sw + o)); // mirrored: [o, sw-o] and [W-sw+o, W-o]
    }

    // top band: repeating lotus / diamond pattern with a central crest
    const crestW = compact ? 86 : 180, my = (o + bh) / 2, step = compact ? 22 : 38;
    let i = 0;
    for (let x = sw + step; x < W - sw - step / 2; x += step, i++) {
      if (Math.abs(x - W / 2) < crestW / 2 + step * 0.4) continue;
      parts.push(i % 2 ? diamond(x, my, compact ? 3 : 4.5) : lotus(x, my + 1, compact ? 0.62 : 1.05));
    }
    const rx = crestW / 2, ry = compact ? 17 : 30, cy = my + (compact ? 3 : 6);
    const rays = Array.from({ length: 13 }, (_, k) => {
      const a = Math.PI + (k + 1) * (Math.PI / 14), r0 = ry * 0.35, r1 = ry * 0.82;
      return `M${n(W / 2 + Math.cos(a) * r0 * 1.6)} ${n(cy + Math.sin(a) * r0)}L${n(W / 2 + Math.cos(a) * r1 * 1.9)} ${n(cy + Math.sin(a) * r1)}`;
    }).join("");
    parts.push(`<ellipse cx="${n(W / 2)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${bg}"/>
      <ellipse cx="${n(W / 2)}" cy="${n(cy)}" rx="${n(rx - 4)}" ry="${n(ry - 4)}" opacity=".6"/>
      <path d="${rays}" opacity=".55"/>${lotus(W / 2, cy + ry * 0.25, compact ? 1.1 : 2)}`);

    // bottom band: almond cartouches
    const innerW = W - 2 * sw, cells = Math.max(3, Math.round(innerW / (compact ? 56 : 104))), cw = innerW / cells, by = H - bh / 2 - o / 2;
    for (let c = 0; c < cells; c++) {
      const x = sw + c * cw;
      if (c) parts.push(`<path d="M${n(x)} ${n(H - bh)}V${n(H - o)}" opacity=".6"/>`);
      parts.push(`<ellipse class="bf-tint" cx="${n(x + cw / 2)}" cy="${n(by)}" rx="${n(cw * 0.3)}" ry="${n(bh * 0.24)}"/>`,
        `<circle class="bf-solid" cx="${n(x + cw / 2 - cw * 0.38)}" cy="${n(by)}" r="1.6"/><circle class="bf-solid" cx="${n(x + cw / 2 + cw * 0.38)}" cy="${n(by)}" r="1.6"/>`);
    }

    // corner medallions
    const r = compact ? 14 : 30;
    [[sw / 2 + o, bh / 2 + o / 2], [W - sw / 2 - o, bh / 2 + o / 2], [sw / 2 + o, H - bh / 2 - o / 2], [W - sw / 2 - o, H - bh / 2 - o / 2]]
      .forEach(([x, y]) => parts.push(rosette(x, y, r, bg)));

    return `<svg viewBox="0 0 ${n(W)} ${n(H)}" aria-hidden="true" focusable="false">
      <g fill="none" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round">${parts.join("")}</g></svg>`;
  }

  const ro = new ResizeObserver((entries) => entries.forEach(({ target: el }) => {
    const W = Math.round(el.clientWidth), H = Math.round(el.clientHeight);
    if (!W || !H || (el._w === W && el._h === H)) return;
    el._w = W; el._h = H;
    el.innerHTML = draw(W, H, el.dataset.theme);
  }));
  $$(".border-frame").forEach((el) => ro.observe(el));
})();
