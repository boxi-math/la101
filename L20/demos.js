// Interactive demos for LA101 Lecture 20. Two rooms cooling, stability, oscillation, e^(At), gradient flow.
// Every code panel is copied from notes/L20-differential-equations.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  setup: "import numpy as np\n\nA = np.array([[-3, 1], [1, -3]])\nprint(np.poly(A).tolist())\nfor lam, x in [(-2, np.array([1, 1])), (-4, np.array([1, -1]))]:\n    print(lam, (A @ x).tolist(), (lam * x).tolist())",
  euler: "def T_formula(t):\n    return 5 * np.exp(-2 * t) * np.array([1, 1]) + 5 * np.exp(-4 * t) * np.array([1, -1])\n\nh = 0.0001\nT = np.array([10.0, 0.0])\nfor step in range(1, 10001):\n    T = T + h * (A @ T)\n    if step in (1000, 2500, 5000, 10000):\n        t = step * h\n        print(round(t, 2), np.round(T, 3).tolist(), np.round(T_formula(t), 3).tolist())",
  peak: "t_peak = 0.5 * np.log(2)\nprint(round(t_peak, 4), round(t_peak * 60, 1), np.round(T_formula(t_peak), 4).tolist())",
  nowall: "B = np.array([[-1, 1], [1, -1]])\nprint(sorted(np.round(np.linalg.eigvals(B).real, 10).tolist()))\nT = np.array([10.0, 0.0])\nfor step in range(30000):\n    T = T + 0.0001 * (B @ T)\nprint(np.round(T, 3).tolist())",
  heater: "C = np.array([[0, 1], [1, -3]])\nprint(sorted(np.round(np.linalg.eigvals(C).real, 4).tolist()), round(float(np.linalg.det(C)), 10))",
  spring: "S = np.array([[0, 1], [-2, -2]])\nprint(np.linalg.eigvals(np.array([[0, 1], [-1, 0]])).tolist(), np.round(np.linalg.eigvals(S), 10).tolist())\nu = np.array([1.0, 0.0])\nh = 0.0001\nfor step in range(1, 30001):\n    u = u + h * (S @ u)\n    if step % 10000 == 0:\n        t = step * h\n        print(round(t, 1), round(u[0], 4), round(np.exp(-t) * (np.cos(t) + np.sin(t)), 4))",
  series: "from math import factorial\nfrom scipy.linalg import expm\n\nt = 0.5\nseries = sum(np.linalg.matrix_power(A * t, k) / factorial(k) for k in range(30))\nX = np.array([[1, 1], [1, -1]])\neig_form = X @ np.diag(np.exp(np.array([-2, -4]) * t)) @ np.linalg.inv(X)\nprint(np.round(series, 6).tolist())\nprint(bool(np.allclose(series, eig_form)), bool(np.allclose(series, expm(A * t))))\nprint(np.round(series @ np.array([10, 0]), 4).tolist(), np.round(T_formula(t), 4).tolist())",
  entrywise: "print(np.round(np.exp(A * t), 4).tolist(), np.round(expm(A * t), 4).tolist())",
  gd: "H = np.array([[5.5, 4.5], [4.5, 5.5]])\nprint(sorted(np.round(np.linalg.eigvals(H).real, 10).tolist()))\nfor eta in (0.05, 0.15, 0.21):\n    w = np.array([1.0, 0.0])\n    for k in range(60):\n        w = w - eta * (H @ w)\n    print(eta, [round(1 - 10 * eta, 2), round(1 - eta, 2)], round(float(np.linalg.norm(w)), 6))",
  cyu: "print(np.round(np.linalg.eigvals(np.array([[0, 1], [-4, 0]])), 10).tolist(), 2 / 50)",
  claim: "def claimed(t):\n    return 5 * np.exp(-2 * t) * np.array([1, 1]) - 5 * np.exp(-4 * t) * np.array([1, -1])\n\nprint(claimed(0).tolist(), T_formula(0).tolist())",
};

const OUT = {
  setup: "[1.0, 6.0, 8.0]\n-2 [-2, -2] [-2, -2]\n-4 [-4, 4] [-4, 4]",
  euler: "0.1 [7.445, 0.742] [7.445, 0.742]\n0.25 [4.872, 1.193] [4.872, 1.193]\n0.5 [2.516, 1.163] [2.516, 1.163]\n1.0 [0.768, 0.585] [0.768, 0.585]",
  peak: "0.3466 20.8 [3.75, 1.25]",
  nowall: "[-2.0, 0.0]\n[5.012, 4.988]",
  heater: "[-3.3028, 0.3028] -1.0",
  spring: "[1j, -1j] [(-1+1j), (-1-1j)]\n1.0 0.5083 0.5083\n2.0 0.0667 0.0667\n3.0 -0.0423 -0.0423",
  series: "[[0.251607, 0.116272], [0.116272, 0.251607]]\nTrue True\n[2.5161, 1.1627] [2.5161, 1.1627]",
  entrywise: "[[0.2231, 1.6487], [1.6487, 0.2231]] [[0.2516, 0.1163], [0.1163, 0.2516]]",
  gd: "[1.0, 10.0]\n0.05 [0.5, 0.95] 0.032576\n0.15 [-0.5, 0.85] 4.1e-05\n0.21 [-1.1, 0.79] 215.301032",
  cyu: "[2j, -2j] 0.04",
  claim: "[0.0, 10.0] [10.0, 0.0]",
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

// ---------- Demo: two rooms cooling, formula against Euler steps ----------

const roomsT = (t) => [5 * Math.exp(-2 * t) + 5 * Math.exp(-4 * t), 5 * Math.exp(-2 * t) - 5 * Math.exp(-4 * t)];

function demoRooms(el, opts = {}) {
  el.innerHTML = `${opts.mini ? "" : `<div class="la-ctrl">${slider("time t (hours)", 0, 2, 0.01, 0.35)}${slider("Euler step h", 0.01, 0.6, 0.01, 0.1)}</div>`}<div class="la-show"></div>`;
  const bar = (v, cls) => `<span style="display:inline-block;height:0.8em;width:${Math.max(0, v) * 24}px;vertical-align:middle" class="la-bar ${cls}"></span>`;
  const draw = (t, h) => {
    const T = roomsT(t);
    let u = [10, 0], s = 0;
    const n = Math.round(t / h);
    for (let i = 0; i < n; i++) { u = [u[0] + h * (-3 * u[0] + u[1]), u[1] + h * (u[0] - 3 * u[1])]; s += h; }
    const show = el.querySelector(".la-show");
    show.innerHTML = `<p><b>t = ${num(t, 2)} h</b> (${num(t * 60, 0)} min)</p>
      <p>room 1: <b>${num(T[0], 3)}</b>° ${bar(T[0], "A")}</p><p>room 2: <b>${num(T[1], 3)}</b>° ${bar(T[1], "C")}</p>` +
      (opts.mini ? "" : `<p class="la-log">formula 5e<sup>−2t</sup>(1, 1) + 5e<sup>−4t</sup>(1, −1); Euler with h = ${num(h, 2)} (${n} steps, t = ${num(s, 2)}): ${vecTxt(u, 3)}
      ${h > 0.5 ? '<b class="NO">— h too large: 1 − 4h is below −1, the steps swing and blow up</b>' : ""}<br>room 2 peaks at t = ½ ln 2 ≈ 0.347 h at 1.25°</p>`);
    show.querySelectorAll(".la-bar.A").forEach((b) => { b.style.background = "var(--teal)"; });
    show.querySelectorAll(".la-bar.C").forEach((b) => { b.style.background = "var(--amber)"; });
  };
  if (opts.mini) { let t = 0; draw(t); setInterval(() => { t = t >= 2 ? 0 : t + 0.04; draw(t); }, 120); return; }
  wireSliders(el, ([t, h]) => draw(t, h));
}

// ---------- Demo: stable, unstable or oscillating? ----------

function demoStab(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="-3 1; 1 -3"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-m="-3 1; 1 -3">rooms</button> <button class="cbtn" data-m="-1 1; 1 -1">no outside walls</button>
    <button class="cbtn" data-m="0 1; 1 -3">heater</button> <button class="cbtn" data-m="0 1; -1 0">spring</button> <button class="cbtn" data-m="0 1; -2 -2">damped</button></div>
    <div class="la-show"></div>`;
  const inp = el.querySelector("input");
  const draw = () => {
    const A = parseNumMat(inp.value), show = el.querySelector(".la-show");
    if (!ok2(A)) { show.innerHTML = "Type a 2-by-2 matrix: two rows separated by ';'."; return; }
    const tr = A[0][0] + A[1][1], dt = A[0][0] * A[1][1] - A[0][1] * A[1][0], e = eig2(A);
    const lamTxt = e.complex ? `λ = ${num(e.re, 3)} ± ${num(e.im, 3)}i` : `λ = ${num(e.lams[0], 3)}, ${num(e.lams[1], 3)}`;
    const re = e.complex ? [e.re, e.re] : e.lams, top = Math.max(...re);
    const verdict = top < -1e-12 ? '<b class="C">stable</b>: every solution decays to 0' :
      top > 1e-12 ? '<b class="NO">unstable</b>: some solution grows without bound' : "<b>neutral</b>: a part neither grows nor decays (steady state or a swing that lasts)";
    show.innerHTML = `<p>trace ${num(tr, 3)}, determinant ${num(dt, 3)} &nbsp; → &nbsp; ${lamTxt}</p>
      <p>${verdict}${e.complex ? "; complex eigenvalues: it oscillates" : ""}.</p>
      <p class="la-log">2-by-2 test: stable exactly when trace &lt; 0 and determinant &gt; 0 — here ${tr < 0 ? "trace &lt; 0" : "trace ≥ 0"}, ${dt > 0 ? "det &gt; 0" : "det ≤ 0"}.</p>`;
  };
  inp.addEventListener("input", draw);
  el.querySelectorAll(".cbtn").forEach((b) => { b.onclick = () => { inp.value = b.dataset.m; draw(); }; });
  draw();
}

// ---------- Demo: the series for e^(At), and the entrywise trap ----------

function demoExpm(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("time t", 0, 2, 0.05, 0.5)}${slider("terms of the series", 1, 30, 1, 4)}</div><div class="la-show"></div>`;
  const A = [[-3, 1], [1, -3]];
  const mtx = (M) => `[${M.map((r) => r.map((v) => num(v, 4)).join(" ")).join("; ")}]`;
  wireSliders(el, ([t, n]) => {
    let S = [[0, 0], [0, 0]], P = [[1, 0], [0, 1]];
    for (let k = 0; k < n; k++) { S = S.map((r, i) => r.map((v, j) => v + P[i][j])); P = mm(P, A).map((r) => r.map((v) => v * t / (k + 1))); }
    const a = Math.exp(-2 * t), b = Math.exp(-4 * t), E = [[(a + b) / 2, (a - b) / 2], [(a - b) / 2, (a + b) / 2]];
    const err = Math.max(...S.flat().map((v, i) => Math.abs(v - E.flat()[i])));
    const W = A.map((r) => r.map((v) => Math.exp(v * t)));
    el.querySelector(".la-show").innerHTML = `<p>series with ${n} term${n > 1 ? "s" : ""}: ${mtx(S)}</p>
      <p>X e<sup>Λt</sup> X⁻¹: ${mtx(E)} &nbsp; <span class="${err < 1e-4 ? "C" : "NO"}">difference ${err < 1e-12 ? "0" : err.toExponential(1)}</span></p>
      <p class="la-log"><b class="NO">entrywise</b> exp(A t): ${mtx(W)} — not e<sup>At</sup>${t > 0 ? " (an entry above 1 would create heat)" : ""}</p>`;
  });
}

// ---------- Demo: gradient descent and the learning rate ----------

function demoGD(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("learning rate η", 0.01, 0.25, 0.005, 0.15)}${slider("steps", 1, 100, 1, 60)}</div><div class="la-show"></div>`;
  const H = [[5.5, 4.5], [4.5, 5.5]];
  wireSliders(el, ([eta, n]) => {
    let w = [1, 0];
    for (let k = 0; k < n; k++) { const g = mv(H, w); w = [w[0] - eta * g[0], w[1] - eta * g[1]]; }
    const f1 = 1 - 10 * eta, f2 = 1 - eta, r = Math.hypot(...w), worst = Math.max(Math.abs(f1), Math.abs(f2));
    el.querySelector(".la-show").innerHTML = `<p>factors: steep 1 − 10η = <b>${num(f1, 3)}</b>, flat 1 − η = <b>${num(f2, 3)}</b></p>
      <p>size of w after ${n} steps: <b class="${worst >= 1 ? "NO" : "C"}">${r > 1e4 || r < 1e-3 ? r.toExponential(2) : num(r, 4)}</b> ${worst >= 1 ? "— diverges (|1 − 10η| ≥ 1)" : `— converges, limited by ${Math.abs(f1) > Math.abs(f2) ? "the steep" : "the flat"} factor ${num(worst, 3)}`}</p>
      <p class="la-log">stable for η &lt; 2/10 = 0.2; fastest at η = 2/11 ≈ 0.182 (both factors 0.818)</p>`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Ax = −3x. Which is a solution of du/dt = Au?", opts: ["e<sup>−3t</sup>x", "e<sup>3t</sup>x", "−3t·x"], a: 0, why: "d/dt(e<sup>λt</sup>x) = λe<sup>λt</sup>x = A(e<sup>λt</sup>x) with λ = −3." },
  { q: "Eigenvalues −1 and 2: is the system stable?", opts: ["Yes", "No"], a: 1, why: "The e<sup>2t</sup> part grows." },
  { q: "e<sup>At</sup> has entries e<sup>a<sub>ij</sub>t</sup>.", opts: ["True", "False"], a: 1, why: "That is the entrywise exponential; e<sup>At</sup> is the series I + At + (At)²/2! + ⋯ = Xe<sup>Λt</sup>X⁻¹." },
  { q: "y″ = −4y as a system has eigenvalues…", opts: ["±2i: it oscillates forever", "±2: one part grows", "−4 and 0"], a: 0, why: "[0 1; −4 0]: λ² + 4 = 0. Real part 0, so cos 2t and sin 2t swing forever." },
  { q: "H has eigenvalues 50 and 2. Gradient descent converges for…", opts: ["η < 0.04", "η < 1", "η < 0.5"], a: 0, why: "Both 1 − 50η and 1 − 2η need size below 1: η < 2/50." },
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
  rooms: (el) => demoRooms(el),
  roomsMini: (el) => demoRooms(el, { mini: true }),
  stab: (el) => demoStab(el),
  expm: (el) => demoExpm(el),
  gd: (el) => demoGD(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
