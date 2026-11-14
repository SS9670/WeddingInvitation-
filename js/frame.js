/* Ornate palace-arch frame (jharokha): cusped arch on carved pillars, small domed
 * finials on the apex and shoulders, corner rosettes.
 * Drawn in real pixels for the element's current size (re-drawn on resize), so it
 * never stretches. Usage: <div class="palace" data-theme="light|dark"></div> */
(() => {
  const { $$ } = window.U;
  let uid = 0;
  const n = (v) => +v.toFixed(1);

  function cubic(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
  }

  function draw(W, H, theme) {
    const id = ++uid, k = Math.min(1.1, Math.max(0.68, W / 400));
    const dark = theme === "dark";
    const stroke = dark ? "#d8b878" : "#b88a44";
    const m = 4 + 16 * k, halfW = W / 2 - m, rise = Math.min(halfW * 0.95, H * 0.42), sy = 4 + rise;

    // outer pointed arch + inner parallel line
    const arch = (mm, ap, s) => {
      const hw = W / 2 - mm, r = s - ap;
      return `M${n(mm)} ${H}V${n(s)}C${n(mm)} ${n(s - r * 0.52)} ${n(W / 2 - hw * 0.5)} ${n(ap + r * 0.14)} ${n(W / 2)} ${n(ap)}C${n(W / 2 + hw * 0.5)} ${n(ap + r * 0.14)} ${n(W - mm)} ${n(s - r * 0.52)} ${n(W - mm)} ${n(s)}V${H}`;
    };
    const d = 10 * k;

    // pillars with capital + base
    const pw = 24 * k, px = m + 18 * k, cy = sy + 30 * k, base = H - 16 * k;
    const pillar = (x) => `
      <rect x="${n(x)}" y="${n(cy + 12 * k)}" width="${n(pw)}" height="${n(base - cy - 12 * k)}"/>
      <path d="M${n(x + pw * 0.33)} ${n(cy + 18 * k)}V${n(base - 6 * k)}M${n(x + pw * 0.66)} ${n(cy + 18 * k)}V${n(base - 6 * k)}" opacity=".55"/>
      <rect x="${n(x - 5 * k)}" y="${n(cy)}" width="${n(pw + 10 * k)}" height="${n(12 * k)}"/>
      <path d="M${n(x - 8 * k)} ${n(cy)}H${n(x + pw + 8 * k)}"/>
      <rect x="${n(x - 5 * k)}" y="${n(base)}" width="${n(pw + 10 * k)}" height="${n(12 * k)}"/>`;

    // cusped (multifoil) inner arch
    const L = [px + pw + 5 * k, cy + 4 * k], A = [W / 2, 4 + 74 * k];
    const c1 = [L[0], L[1] - (L[1] - A[1]) * 0.55], c2 = [W / 2 - (W / 2 - L[0]) * 0.45, A[1] + (L[1] - A[1]) * 0.12];
    const steps = 7, left = Array.from({ length: steps + 1 }, (_, i) => cubic(L, c1, c2, A, i / steps));
    const right = left.slice(0, -1).reverse().map(([x, y]) => [W - x, y]);
    const pts = [...left, ...right];
    let cusp = `M${n(L[0])} ${n(base)}V${n(L[1])}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], r = Math.hypot(x1 - x0, y1 - y0) * 0.62;
      cusp += `A${n(r)} ${n(r)} 0 0 1 ${n(x1)} ${n(y1)}`;
    }
    cusp += `V${n(base)}Z`;
    const hood = `M${n(L[0] - 7 * k)} ${n(L[1] - 4 * k)}C${n(c1[0] - 7 * k)} ${n(c1[1] - 6 * k)} ${n(c2[0])} ${n(c2[1] - 9 * k)} ${n(A[0])} ${n(A[1] - 11 * k)}C${n(W - c2[0])} ${n(c2[1] - 9 * k)} ${n(W - c1[0] + 7 * k)} ${n(c1[1] - 6 * k)} ${n(W - L[0] + 7 * k)} ${n(L[1] - 4 * k)}`;

    // corner rosettes in the spandrels
    const rosette = (x, y, s) => `<g transform="translate(${n(x)} ${n(y)})"><circle r="${n(4 * s)}"/>${Array.from({ length: 8 }, (_, i) => `<circle r="${n(2.4 * s)}" cx="${n(Math.cos(i * Math.PI / 4) * 9 * s)}" cy="${n(Math.sin(i * Math.PI / 4) * 9 * s)}"/>`).join("")}</g>`;
    const ry = (sy + A[1]) / 2 + 22 * k, rx = halfW * 0.5;

    // small domed finials on the outer shoulders
    const finial = (x, sy) => `<path class="pf-gold" d="M${n(x - 9 * k)} ${n(sy)}C${n(x - 9 * k)} ${n(sy - 12 * k)} ${n(x - 3 * k)} ${n(sy - 14 * k)} ${n(x)} ${n(sy - 22 * k)}C${n(x + 3 * k)} ${n(sy - 14 * k)} ${n(x + 9 * k)} ${n(sy - 12 * k)} ${n(x + 9 * k)} ${n(sy)}Z"/>
      <path d="M${n(x)} ${n(sy - 22 * k)}V${n(sy - 31 * k)}"/><circle class="pf-gold" cx="${n(x)}" cy="${n(sy - 33 * k)}" r="${n(2.2 * k)}"/>`;

    const g = `pg${id}`, o = `po${id}`;
    // the viewBox starts a little above 0 so the apex finial sits inside the drawing
    const T = n(40 * k);
    return `<svg viewBox="0 ${-T} ${n(W)} ${n(H + T)}" style="top:${-T}px;height:calc(100% + ${T}px)" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dfa8"/><stop offset="1" stop-color="#c3913d"/></linearGradient>
        <radialGradient id="${o}" cx=".5" cy=".3" r=".8">${dark
          ? '<stop offset="0" stop-color="#f6c97a" stop-opacity=".14"/><stop offset="1" stop-color="#f6c97a" stop-opacity=".03"/>'
          : '<stop offset="0" stop-color="#fff3dc"/><stop offset=".5" stop-color="#f3d9b0"/><stop offset="1" stop-color="#e2b685"/>'}</radialGradient>
      </defs>
      <g fill="none" stroke="${stroke}" stroke-width="${n(1.3 * Math.max(k, 0.85))}" stroke-linejoin="round" style="--pf-gold:url(#${g})">
        <path d="${arch(m, 4, sy)}" ${dark ? "" : 'fill="rgba(251,246,238,.55)"'}/>
        <path d="${arch(m + d, 4 + d * 1.5, sy + d * 0.3)}" opacity=".55"/>
        <path d="${cusp}" fill="url(#${o})"/>
        <path d="${hood}" opacity=".6"/>
        ${pillar(px)}${pillar(W - px - pw)}
        ${rosette(W / 2 - rx, ry, k)}${rosette(W / 2 + rx, ry, k)}
        ${finial(m, sy)}${finial(W - m, sy)}${finial(W / 2, 4.5)}
      </g>
    </svg>`;
  }

  const ro = new ResizeObserver((entries) => entries.forEach(({ target: el }) => {
    const W = el.clientWidth, H = el.clientHeight;
    if (!W || !H || (el._w === W && el._h === H)) return;
    el._w = W; el._h = H;
    el.innerHTML = draw(W, H, el.dataset.theme);
  }));
  $$(".palace").forEach((el) => ro.observe(el));
})();
