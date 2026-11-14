/* Procedural line-art mandalas.
 * Each ring is its own <svg> so rotation runs on the GPU (CSS transform on
 * an HTML element). Rings ink themselves in on first view, then turn slowly
 * in alternating directions; everything pauses while off-screen.
 * Usage: <div class="mandala" data-mandala="a|b"></div> */
(() => {
  const { $$ } = window.U;
  let uid = 0;
  const tan = (n) => Math.tan(Math.PI / n);
  const f = (n) => +n.toFixed(2);

  // ---- petal shapes, all drawn pointing "up" (negative y) from radius r1 to r2 ----
  const P = {
    almond: (r1, r2, w) => `M0 ${-r1}Q${w} ${f(-(r1 + r2) / 2)} 0 ${-r2}Q${-w} ${f(-(r1 + r2) / 2)} 0 ${-r1}Z`,
    lotus: (r1, r2, w) => {
      const m = f(-(r1 + (r2 - r1) * 0.45)), k = f(-(r2 - (r2 - r1) * 0.15));
      return `M${-w} ${-r1}C${-w} ${m} ${f(-w * 0.25)} ${k} 0 ${-r2}C${f(w * 0.25)} ${k} ${w} ${m} ${w} ${-r1}`;
    },
    scallop: (r, w) => `M${-w} ${-r}A${w} ${w} 0 0 1 ${w} ${-r}`,
    drop: (r1, r2, w) => `M0 ${-r2}C${w} ${f(-r2 + (r2 - r1) * 0.45)} ${w} ${-r1} 0 ${-r1}C${-w} ${-r1} ${-w} ${f(-r2 + (r2 - r1) * 0.45)} 0 ${-r2}Z`,
    spike: (r1, r2, w) => `M${-w} ${-r1}L0 ${-r2}L${w} ${-r1}`,
    vein: (r1, r2) => `M0 ${-r1}L0 ${-r2}`,
  };

  // part: [shape, count, args, {fill, offset}] | ["circle", r] | ["dots", count, r, size]
  function partSVG(p) {
    const [kind] = p;
    if (kind === "circle") return `<circle r="${p[1]}" pathLength="1"/>`;
    if (kind === "dots") {
      const [, n, r, s] = p;
      return Array.from({ length: n }, (_, i) => `<circle class="m-dot" r="${s}" cy="${-r}" transform="rotate(${f((360 / n) * i)})"/>`).join("");
    }
    const [, n, args, o = {}] = p, id = `mp${++uid}`;
    const d = P[kind](...args), off = o.offset || 0;
    return `<defs><path id="${id}" d="${d}" pathLength="1"/></defs>` +
      Array.from({ length: n }, (_, i) => `<use href="#${id}"${o.fill ? ' class="m-fill"' : ""} transform="rotate(${f((360 / n) * i + off)})"/>`).join("");
  }

  const DESIGNS = {
    // Rich, lotus-led — used for the large hero pieces
    a: [
      { t: 140, parts: [["circle", 5], ["almond", 8, [5, 21, 6], { fill: 1 }], ["vein", 8, [7, 18]], ["dots", 8, 24, 1.1]] },
      { t: 110, parts: [["circle", 27], ["lotus", 12, [27, 44, f(27 * tan(12))], { fill: 1 }], ["lotus", 12, [30, 40, 4.2]], ["dots", 12, 47, 1.2]] },
      { t: 170, parts: [["circle", 50], ["scallop", 24, [50, f(50 * Math.sin(Math.PI / 24))]], ["dots", 24, 56.5, 0.8], ["circle", 59]] },
      { t: 130, parts: [["lotus", 16, [59, 81, f(59 * tan(16))]], ["almond", 16, [63, 77, 4], { fill: 1 }], ["almond", 16, [61, 71, 2.4], { offset: 11.25 }]] },
      { t: 200, parts: [["circle", 83], ["spike", 32, [83, 94, f(83 * tan(32))]], ["dots", 32, 97, 1]] },
    ],
    // Lighter, leaf-and-drop — used for corner / background accents
    b: [
      { t: 120, parts: [["circle", 7], ["drop", 10, [7, 26, 7], { fill: 1 }], ["dots", 10, 29, 1.2]] },
      { t: 150, parts: [["circle", 32], ["almond", 20, [32, 52, 5.5], { fill: 1 }], ["vein", 20, [35, 48]], ["almond", 20, [34, 46, 2.5], { offset: 9 }]] },
      { t: 100, parts: [["circle", 55], ["scallop", 30, [55, f(55 * Math.sin(Math.PI / 30))]], ["circle", 61], ["dots", 40, 64.5, 0.75]] },
      { t: 180, parts: [["lotus", 20, [67, 90, f(67 * tan(20))]], ["drop", 20, [70, 84, 3.2], { fill: 1 }], ["dots", 20, 94, 1.3]] },
    ],
  };

  function build(el) {
    const rings = DESIGNS[el.dataset.mandala] || DESIGNS.a;
    el.innerHTML = rings.map((r, i) => `
      <svg class="m-ring${i % 2 ? " m-rev" : ""}" viewBox="-100 -100 200 200" style="--t:${r.t}s;--r:${i}" aria-hidden="true" focusable="false">
        ${r.parts.map(partSVG).join("")}
      </svg>`).join("");
  }

  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    en.target.classList.toggle("m-play", en.isIntersecting);
    if (en.isIntersecting) en.target.classList.add("m-drawn");
  }), { rootMargin: "80px" });

  $$(".mandala").forEach((el) => { build(el); io.observe(el); });
})();
