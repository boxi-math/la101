// Interactive demos for LA101 Lecture 21. Two bike stations, steady states, chains that never settle, PageRank and power iteration.
// Every code panel is copied from notes/L21-markov.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  bikes: "import numpy as np\n\nP = np.array([[0.8, 0.3], [0.2, 0.7]])\nprint(P.sum(axis=0).tolist())\nu = np.array([1.0, 0.0])\nfor k in range(1, 11):\n    u = P @ u\n    if k in (1, 2, 3, 5, 10):\n        print(k, np.round(u, 4).tolist(), round(u.sum(), 10))",
  steady: "vals, vecs = np.linalg.eig(P)\nassert np.allclose(vals.imag, 0) and np.allclose(vecs.imag, 0)\nvals, vecs = vals.real, vecs.real\nprint(np.round(vals, 10).tolist())\nv = vecs[:, np.argmax(vals)]\nprint(np.round(v, 4).tolist(), np.round(v / v.sum(), 4).tolist())\nu = np.array([1.0, 0.0])\nfor k in range(1, 11):\n    u = P @ u\nprint(bool(np.allclose(u, np.array([0.6, 0.4]) + 0.4 * 0.5**10 * np.array([1, -1]))), np.round(P @ np.array([0.6, 0.4]), 10).tolist())",
  rows: "print(P.T.sum(axis=1).tolist(), np.round(P.T @ np.array([0.6, 0.4]), 10).tolist(), np.round(np.array([0.6, 0.4]) @ P.T, 10).tolist())",
  random: "rng = np.random.default_rng(4)\nQ = rng.random((4, 4))\nQ = Q / Q.sum(axis=0)\nlam = np.linalg.eigvals(Q)\nprint(np.round(Q.sum(axis=0), 10).tolist(), np.round(sorted(abs(lam), reverse=True), 4).tolist())\nfor start in (np.array([1.0, 0, 0, 0]), np.array([0, 0, 0, 1.0])):\n    print(np.round(np.linalg.matrix_power(Q, 50) @ start, 4).tolist())",
  three: "P3 = np.array([[0.7, 0.2, 0.1], [0.2, 0.6, 0.3], [0.1, 0.2, 0.6]])\nvals3, vecs3 = np.linalg.eig(P3)\nv3 = vecs3[:, np.argmax(vals3.real)].real\nprint(np.round(P3.sum(axis=0), 10).tolist(), np.round(sorted(abs(vals3), reverse=True), 4).tolist(), np.round(v3 / v3.sum(), 4).tolist())",
  never: "S = np.array([[0, 1], [1, 0]])\nprint(sorted(np.round(np.linalg.eigvals(S).real, 10).tolist()), [(np.linalg.matrix_power(S, k) @ np.array([1, 0])).tolist() for k in (1, 2, 3)])\nB = np.zeros((4, 4))\nB[:2, :2] = P\nB[2:, 2:] = np.array([[0.5, 0.5], [0.5, 0.5]])\nprint(np.round(sorted(np.linalg.eigvals(B).real, reverse=True), 10).tolist())\nprint(np.round(np.linalg.matrix_power(B, 60) @ np.array([1.0, 0, 0, 0]), 4).tolist(), np.round(np.linalg.matrix_power(B, 60) @ np.array([0, 0, 1.0, 0]), 4).tolist())",
  web: "links = {1: [2, 3], 2: [3], 3: [1], 4: [3, 5], 5: [4, 6], 6: [5]}\nn = 6\nM = np.zeros((n, n))\nfor j, out in links.items():\n    for i in out:\n        M[i - 1, j - 1] = 1 / len(out)\nd = 0.85\nG = d * M + (1 - d) / n * np.ones((n, n))\nprint(np.round(G.sum(axis=0), 10).tolist(), bool((G > 0).all()))\nvals, vecs = np.linalg.eig(G)\nr = vecs[:, np.argmax(vals.real)].real\nr = r / r.sum()\nprint(np.round(r, 4).tolist(), (np.argsort(-r) + 1).tolist())",
  power: "x = np.ones(n) / n\nfor k in range(1, 61):\n    x = G @ x\n    if k in (1, 5, 20, 60):\n        print(k, np.round(x, 4).tolist(), f\"{np.abs(x - r).sum():.1e}\")\nprint(np.round(sorted(abs(vals), reverse=True), 4).tolist())",
  cyu: "print(round(np.log(0.5) / np.log(0.9), 2))",
  claim: "claimed = np.array([0.4, 0.6])\nswapped = np.array([[0.7, 0.2], [0.3, 0.8]])\nprint(claimed.sum(), np.round(P @ claimed, 10).tolist(), np.round(swapped @ claimed, 10).tolist())",
};

const OUT = {
  bikes: "[1.0, 1.0]\n1 [0.8, 0.2] 1.0\n2 [0.7, 0.3] 1.0\n3 [0.65, 0.35] 1.0\n5 [0.6125, 0.3875] 1.0\n10 [0.6004, 0.3996] 1.0",
  steady: "[1.0, 0.5]\n[0.8321, 0.5547] [0.6, 0.4]\nTrue [0.6, 0.4]",
  rows: "[1.0, 1.0] [0.56, 0.46] [0.6, 0.4]",
  random: "[1.0, 1.0, 1.0, 1.0] [1.0, 0.2045, 0.0724, 0.0724]\n[0.22, 0.1913, 0.3109, 0.2778]\n[0.22, 0.1913, 0.3109, 0.2778]",
  three: "[1.0, 1.0, 1.0] [1.0, 0.5618, 0.3382] [0.3448, 0.3793, 0.2759]",
  never: "[-1.0, 1.0] [[0, 1], [1, 0], [0, 1]]\n[1.0, 1.0, 0.5, 0.0]\n[0.6, 0.4, 0.0, 0.0] [0.0, 0.0, 0.5, 0.5]",
  web: "[1.0, 1.0, 1.0, 1.0, 1.0, 1.0] True\n[0.2786, 0.1434, 0.2983, 0.0778, 0.1241, 0.0778] [3, 1, 2, 5, 4, 6]",
  power: "1 [0.1667, 0.0958, 0.3083, 0.0958, 0.2375, 0.0958] 3.2e-01\n5 [0.2601, 0.1375, 0.2789, 0.0831, 0.1574, 0.0831] 8.8e-02\n20 [0.2784, 0.1433, 0.2981, 0.078, 0.1242, 0.078] 9.6e-04\n60 [0.2786, 0.1434, 0.2983, 0.0778, 0.1241, 0.0778] 4.6e-09\n[1.0, 0.7361, 0.7361, 0.601, 0.601, 0.0]",
  cyu: "6.58",
  claim: "1.0 [0.5, 0.5] [0.4, 0.6]",
};

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + codeBlock(OUT[name], "out");

const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));

function slider(label, min, max, step, value) {
  return `<label class="la-slider"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${value}</output></label>`;
}

function wireSliders(el, onChange) {
  const inputs = [...el.querySelectorAll(".la-slider input")];
  const read = () => inputs.map((i) => { i.nextElementSibling.textContent = fmt(+i.value); return +i.value; });
  inputs.forEach((i) => i.addEventListener("input", () => onChange(read())));
  onChange(read());
}

// ---------- exact fractions and matrix display (shared by the matrix demos of this lecture) ----------

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
class Q {
  constructor(n, d = 1) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    this.n = n / g; this.d = d / g;
  }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Q(this.n * o.n, this.d * o.d); }
  div(o) { return new Q(this.n * o.d, this.d * o.n); }
  get zero() { return this.n === 0; }
  toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
}
const q = (v) => (v instanceof Q ? v : new Q(v));
const toQ = (M) => M.map((r) => r.map(q));
const sgn = (v) => String(v).replace("-", "−");
// "− ℓ" for a step row − ℓ × row; a negative ℓ reads "+ |ℓ|".
const minusTimes = (l) => (l.n < 0 ? `+ ${new Q(-l.n, l.d)}` : `− ${l}`);
const parseMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const okMat = (M) => M.length > 0 && M[0].length > 0 && M.every((r) => r.length === M[0].length && r.every(Number.isInteger));
const mmul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s.add(q(v).mul(q(B[k][j]))), q(0))));
const eye = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => q(i === j ? 1 : 0)));
const same = (A, B) => A.length === B.length && A.every((r, i) => r.every((v, j) => q(v).sub(q(B[i][j])).zero));

// A matrix as a small bracketed table. hlRows: rows tinted; hlCells: [[i, j]] in bold; zCells: cells in red; aug: a
// dashed bar before the last column.
function matHTML(M, { hlRows = [], hlCells = [], zCells = [], aug = false } = {}) {
  const has = (list, i, j) => list.some(([a, b]) => a === i && b === j);
  return `<table class="la-mat">${M.map((r, i) => `<tr class="${hlRows.includes(i) ? "hl" : ""}">${r.map((v, j) => {
    const cls = [has(hlCells, i, j) ? "pv" : "", has(zCells, i, j) ? "z" : "", aug && j === r.length - 1 ? "bar" : ""].join(" ");
    return `<td class="${cls}">${String(v).replace("-", "−")}</td>`;
  }).join("")}</tr>`).join("")}</table>`;
}

(function matStyle() {
  if (document.getElementById("la-mat-style")) return;
  const s = document.createElement("style");
  s.id = "la-mat-style";
  s.textContent = `.la-mat{display:inline-table;border-collapse:separate;border-spacing:10px 3px;border-left:2px solid var(--ink-2);
border-right:2px solid var(--ink-2);border-radius:5px;margin:4px 6px;font:14px var(--mono);vertical-align:middle}
article table.la-mat,table.la-mat{width:auto;font-size:14px}.la-mat td,.la-mat th{text-align:right;min-width:1.7em;border:none;padding:0 2px;background:none}.la-mat td.pv{color:var(--teal);font-weight:700}
.la-mat td.z{color:var(--red);font-weight:700}.la-mat td.bar{border-left:1px dashed var(--stone);padding-left:8px}
.la-mat tr.hl td{background:var(--teal-soft)}.la-eq{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:8px 0;
font:15px var(--mono)}.la-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.la-log{font-size:14px;margin:8px 0 0;min-height:2.6em}`;
  document.head.appendChild(s);
})();

const SVGNS = "http://www.w3.org/2000/svg";
function plane(el, xr, yr, { xlabel = "x", ylabel = "y", height = 300, stretch = 1 } = {}) {
  const [x0, x1] = xr, [y0, y1] = yr;
  const u = height / (y1 - y0), ux = u * stretch, W = (x1 - x0) * ux, H = height, P = 22;
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", `${-P} ${-P} ${W + 2 * P} ${H + 2 * P}`);
  svg.setAttribute("class", "la-plane");
  svg.style.width = "100%"; svg.style.maxWidth = `${W + 2 * P}px`;
  el.appendChild(svg);
  const X = (x) => (x - x0) * ux, Y = (y) => (y1 - y) * u;
  const add = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  };
  for (let x = Math.ceil(x0); x <= x1; x++) add("line", { x1: X(x), y1: 0, x2: X(x), y2: H, class: "grid" });
  for (let y = Math.ceil(y0); y <= y1; y++) add("line", { x1: 0, y1: Y(y), x2: W, y2: Y(y), class: "grid" });
  add("line", { x1: 0, y1: Y(0), x2: W, y2: Y(0), class: "axis" });
  add("line", { x1: X(0), y1: 0, x2: X(0), y2: H, class: "axis" });
  add("text", { x: W + 4, y: Y(0) + 4, class: "albl" }).textContent = xlabel;
  add("text", { x: X(0) + 6, y: -6, class: "albl" }).textContent = ylabel;
  for (let x = Math.ceil(x0); x <= x1; x++) if (x) add("text", { x: X(x), y: Y(0) + 14, class: "tick" }).textContent = x;
  for (let y = Math.ceil(y0); y <= y1; y++) if (y) add("text", { x: X(0) - 8, y: Y(y) + 4, class: "tick r" }).textContent = y;
  const layer = add("g", {});
  const clip = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  return {
    clear() { layer.innerHTML = ""; },
    // The line p*x + q*y = r, clipped to the window.
    line(p, q, r, cls) {
      const pts = [];
      if (Math.abs(q) > 1e-12) for (const x of [x0, x1]) pts.push([x, (r - p * x) / q]);
      else for (const y of [y0, y1]) pts.push([r / p, y]);
      const [[ax, ay], [bx, by]] = pts;
      add("line", { x1: X(ax), y1: Y(clip(ay, y0 - 50, y1 + 50)), x2: X(bx), y2: Y(clip(by, y0 - 50, y1 + 50)), class: `ln ${cls}` }, layer);
    },
    arrow(from, to, cls, label) {
      const [fx, fy] = [X(from[0]), Y(from[1])], [tx, ty] = [X(to[0]), Y(to[1])];
      const len = Math.hypot(tx - fx, ty - fy);
      if (len < 1) return;
      const ux = (tx - fx) / len, uy = (ty - fy) / len, h = Math.min(11, len * 0.5);
      add("line", { x1: fx, y1: fy, x2: tx - ux * h * 0.8, y2: ty - uy * h * 0.8, class: `vec ${cls}` }, layer);
      add("polygon", { points: `${tx},${ty} ${tx - ux * h - uy * h * 0.45},${ty - uy * h + ux * h * 0.45} ${tx - ux * h + uy * h * 0.45},${ty - uy * h - ux * h * 0.45}`, class: `head ${cls}` }, layer);
      if (label) add("text", { x: (fx + tx) / 2 - uy * 14, y: (fy + ty) / 2 + ux * 14 + 4, class: `vlbl ${cls}` }, layer).textContent = label;
    },
    dot(p, cls, label) {
      add("circle", { cx: X(p[0]), cy: Y(p[1]), r: 4.5, class: `dot ${cls}` }, layer);
      if (label) add("text", { x: X(p[0]) + 7, y: Y(p[1]) - 7, class: `plbl ${cls}` }, layer).textContent = label;
    },
  };
}

// ---------- 2-by-2 eigenvalues in closed form (shared by the eigenvalue demos of Lectures 18–21) ----------

const num = (v, d = 4) => (Math.abs(v) < 1e-12 ? "0" : sgn(+v.toFixed(d)));
const vecTxt = (v, d = 4) => `(${v.map((x) => num(x, d)).join(", ")})`;
const parseNumMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const ok2 = (M) => M.length === 2 && M.every((r) => r.length === 2 && r.every(Number.isFinite));
const mv = (M, x) => M.map((r) => r.reduce((s, v, j) => s + v * x[j], 0));
const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mpow = (M, k) => { let R = [[1, 0], [0, 1]]; for (let i = 0; i < k; i++) R = mm(M, R); return R; };

// λ² − tr·λ + det = 0. Real roots come with an eigenvector each (null space of A − λI); complex roots as {re, im}.
function eig2([[a, b], [c, d]]) {
  const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
  if (disc < -1e-12) return { tr, det, disc, complex: true, re: tr / 2, im: Math.sqrt(-disc) / 2 };
  const s = Math.sqrt(Math.max(disc, 0));
  const lams = [(tr + s) / 2, (tr - s) / 2];
  const vecOf = (l) => {
    const r1 = [a - l, b], r2 = [c, d - l];
    const r = Math.hypot(...r1) > Math.hypot(...r2) ? r1 : r2;
    if (Math.hypot(...r) < 1e-12) return null;              // A − λI = 0: every vector is an eigenvector
    const v = [-r[1], r[0]], k = Math.abs(v[0]) > 1e-12 ? v[0] : v[1];
    return v.map((x) => x / k);
  };
  return { tr, det, disc, complex: false, lams, vecs: lams.map(vecOf), repeated: Math.abs(disc) < 1e-12 };
}

// ---------- Demo: two bike stations, day by day ----------

function demoBikes(el, opts = {}) {
  el.innerHTML = `${opts.mini ? "" : `<div class="la-ctrl">${slider("market → beach (a)", 0, 1, 0.05, 0.2)}${slider("beach → market (b)", 0, 1, 0.05, 0.3)}${slider("start at the market", 0, 1, 0.05, 1)}${slider("day k", 0, 30, 1, 5)}</div>`}<div class="la-show"></div>`;
  const bar = (v, c) => `<span style="display:inline-block;height:0.8em;width:${Math.round(v * 220)}px;background:var(${c});vertical-align:middle"></span>`;
  const draw = (a, b, s, k) => {
    const P = [[1 - a, b], [a, 1 - b]];
    let u = [s, 1 - s];
    for (let i = 0; i < k; i++) u = mv(P, u);
    const l2 = 1 - a - b, ss = a + b > 1e-12 ? [b / (a + b), a / (a + b)] : null;
    el.querySelector(".la-show").innerHTML = `<p><b>day ${k}</b> &nbsp; market ${num(u[0], 4)} ${bar(u[0], "--teal")}</p><p style="margin-left:4.6em">beach ${num(u[1], 4)} ${bar(u[1], "--amber")}</p>` +
      (opts.mini ? "" : `<p>P = [${num(1 - a, 2)} ${num(b, 2)}; ${num(a, 2)} ${num(1 - b, 2)}] &nbsp; λ = 1 and λ₂ = ${num(l2, 3)}</p>
      <p class="la-log">${ss ? `steady state (b, a)/(a + b) = ${vecTxt(ss, 4)}` : "a = b = 0: nobody moves, every start is steady"}${Math.abs(l2) > 1 - 1e-12 && a + b > 1e-12 ? ' — <b class="NO">λ₂ = −1: it swings forever</b>' : ss ? `; the distance shrinks by |λ₂| = ${num(Math.abs(l2), 3)} per day` : ""}</p>`);
  };
  if (opts.mini) { let k = 0; draw(0.2, 0.3, 1, 0); setInterval(() => { k = (k + 1) % 13; draw(0.2, 0.3, 1, k); }, 900); return; }
  wireSliders(el, ([a, b, s, k]) => draw(a, b, s, k));
}

// ---------- Demo: PageRank on the mini-web by power iteration ----------

const WEB = { 1: [2, 3], 2: [3], 3: [1], 4: [3, 5], 5: [4, 6], 6: [5] };

function pagerank(links, d, steps) {
  const n = Object.keys(links).length;
  let x = Array(n).fill(1 / n);
  const hist = [];
  for (let k = 1; k <= steps; k++) {
    const y = Array(n).fill((1 - d) / n * x.reduce((s, v) => s + v, 0));
    for (const [j, out] of Object.entries(links)) for (const i of out) y[i - 1] += d * x[j - 1] / out.length;
    x = y;
    hist.push(x);
  }
  return hist;
}

function demoRank(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("damping d", 0.5, 1, 0.01, 0.85)}${slider("steps", 1, 100, 1, 20)}</div>
    <div class="la-ctrl"><label><input type="checkbox" class="la-extra"> add the link 3 → 4</label></div><div class="la-show"></div>`;
  const box = el.querySelector(".la-extra");
  let cur = [0.85, 20];
  const draw = () => {
    const [d, k] = cur, links = { ...WEB, 3: box.checked ? [1, 4] : [1] };
    const hist = pagerank(links, d, Math.max(k, 400)), x = hist[k - 1], r = hist[hist.length - 1];
    const err = x.reduce((s, v, i) => s + Math.abs(v - r[i]), 0);
    const order = x.map((v, i) => [v, i + 1]).sort((p, q) => q[0] - p[0]);
    el.querySelector(".la-show").innerHTML = order.map(([v, i]) => `<p style="margin:2px 0">page ${i}: <b>${num(v, 4)}</b> <span style="display:inline-block;height:0.7em;width:${Math.round(v * 500)}px;background:var(--teal);vertical-align:middle"></span></p>`).join("") +
      `<p class="la-log">after ${k} steps from the uniform start; distance to the steady state ${err < 1e-12 ? "0" : err.toExponential(1)}${d > 0.995 ? ' — <b class="NO">d = 1: no jumps, pages 4–6 lose all their rank</b>' : ""}</p>`;
  };
  box.addEventListener("change", draw);
  wireSliders(el, (v) => { cur = v; draw(); });
}

// ---------- Demo: is it a Markov matrix, and where does it settle? ----------

function demoMarkov(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>P = <input class="la-in" value="0.8 0.3; 0.2 0.7"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-m="0.8 0.3; 0.2 0.7">bikes</button> <button class="cbtn" data-m="0.9 0.4; 0.1 0.6">exercise 1</button>
    <button class="cbtn" data-m="0 1; 1 0">swap</button> <button class="cbtn" data-m="0.5 0.6; 0.5 0.6">not Markov</button> <button class="cbtn" data-m="0.8 0.2; 0.3 0.7">rows add to 1</button></div>
    <div class="la-show"></div>`;
  const inp = el.querySelector("input");
  const draw = () => {
    const P = parseNumMat(inp.value), show = el.querySelector(".la-show");
    if (!ok2(P)) { show.innerHTML = "Type a 2-by-2 matrix: two rows separated by ';'."; return; }
    const c = [P[0][0] + P[1][0], P[0][1] + P[1][1]], neg = P.flat().some((v) => v < 0);
    const markov = !neg && c.every((v) => Math.abs(v - 1) < 1e-9);
    if (!markov) {
      show.innerHTML = `<p><b class="NO">Not a Markov matrix</b>: column sums ${num(c[0], 3)} and ${num(c[1], 3)}${neg ? ", and a negative entry" : ""}. Columns must add to 1.</p>`;
      return;
    }
    const a = P[1][0], b = P[0][1], l2 = 1 - a - b;
    const ss = a + b > 1e-12 ? [b / (a + b), a / (a + b)] : null;
    const chk = ss ? mv(P, ss) : null;
    show.innerHTML = `<p>Markov: columns add to 1. λ = 1 and λ₂ = ${num(l2, 3)}</p>
      <p>${ss ? `steady state <b>${vecTxt(ss, 4)}</b>; check P v = ${vecTxt(chk, 4)}` : "every vector is steady (nobody moves)"}</p>
      <p class="la-log">${Math.abs(l2) >= 1 - 1e-12 && ss ? '<b class="NO">|λ₂| = 1: starts away from the steady state never settle</b>' : ss ? `every start converges; the distance shrinks by ${num(Math.abs(l2), 3)} per step` : ""}</p>`;
  };
  inp.addEventListener("input", draw);
  el.querySelectorAll(".cbtn").forEach((bt) => { bt.onclick = () => { inp.value = bt.dataset.m; draw(); }; });
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Is [0.5 0.6; 0.5 0.6] a Markov matrix (columns adding to 1)?", opts: ["Yes", "No"], a: 1, why: "The second column adds to 1.2." },
  { q: "λ₂ = 0.9. About how many steps halve the distance to the steady state?", opts: ["about 2", "about 7", "about 50"], a: 1, why: "0.9ᵏ = 0.5 at k ≈ 6.6." },
  { q: "The steady state is numpy's eigenvector for λ = 1, as returned.", opts: ["True", "False"], a: 1, why: "numpy's has length 1; divide by its sum to get total 1." },
  { q: "Why does the swap [0 1; 1 0] not converge from (1, 0)?", opts: ["its eigenvalue −1 has size 1", "it is not a Markov matrix", "it has no steady state"], a: 0, why: "The λ = −1 part never shrinks, so the distribution alternates; (0.5, 0.5) is steady but never reached." },
  { q: "Why does the Google matrix add the jump term (1 − d)/n?", opts: ["to make every entry positive", "to make the columns add to 1", "to speed up eig"], a: 0, why: "Positive entries: one steady state, and convergence from every start (|λ₂| ≤ d)." },
];

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((qq, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${qq.q}</p>
      <div class="opts">${qq.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${qq.why}</div></div>`).join("") +
    `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const qq = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[qq.a].classList.add("right");
        if (j !== qq.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  bikes: (el) => demoBikes(el),
  bikesMini: (el) => demoBikes(el, { mini: true }),
  markov: (el) => demoMarkov(el),
  rank: (el) => demoRank(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
