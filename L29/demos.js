// Interactive demos for LA101 Lecture 29. Unit balls of three norms, error amplification and κ, collinear features, float32/float16 storage.
// Every code panel is copied from notes/L29-norms-condition.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  vnorm: "import numpy as np\nx = np.array([3.0, -4.0, 12.0])\nprint([float(np.linalg.norm(x, p)) for p in (1, 2, np.inf)])",
  mnorm: "A = np.array([[2.0, 3.0], [0.0, 2.0]])\nprint(round(float(np.linalg.norm(A, 2)), 10), round(float(np.linalg.norm(A, \"fro\")), 4), round(float(np.sqrt(17)), 4))",
  system: "M = np.array([[1.0, 1.0], [1.0, 1.001]])\nb = np.array([2.0, 2.001])\nprint(np.round(np.linalg.solve(M, b), 6).tolist(), np.round(np.linalg.svd(M, compute_uv=False), 6).tolist(), round(float(np.linalg.cond(M)), 1))",
  jump: "x0 = np.linalg.solve(M, b)\nx1 = np.linalg.solve(M, np.array([2.0, 2.002]))\nrel_b = 0.001 / np.linalg.norm(b)\nrel_x = np.linalg.norm(x1 - x0) / np.linalg.norm(x0)\nprint(np.round(x1, 6).tolist(), round(float(rel_b), 6), round(float(rel_x), 6), round(float(rel_x / rel_b), 1))",
  det: "S = 0.001 * np.eye(2)\nprint(round(float(np.linalg.det(M)), 6), round(float(np.linalg.det(S)), 12), round(float(np.linalg.cond(M)), 1), float(np.linalg.cond(S)))",
  normal: "eps = 1e-8\nT = np.array([[1.0, 1.0], [eps, 0.0], [0.0, eps]])\nc = T @ np.array([1.0, 1.0])\nprint(f\"{np.linalg.cond(T):.3g}\", (T.T @ T).tolist())\ntry:\n    print(np.linalg.solve(T.T @ T, T.T @ c))\nexcept np.linalg.LinAlgError as e:\n    print(\"normal equations:\", e)\nprint(np.round(np.linalg.lstsq(T, c, rcond=None)[0], 6).tolist())",
  collinear: "rng = np.random.default_rng(29)\nn = 50\nx1 = rng.normal(size=n)\nx2 = x1 + 0.01 * rng.normal(size=n)\nX = np.column_stack([x1, x2])\nprint(round(float(np.linalg.cond(X)), 1))\nfor s in (1, 2, 3):\n    y = x1 + x2 + 0.1 * np.random.default_rng(100 + s).normal(size=n)\n    w = np.linalg.lstsq(X, y, rcond=None)[0]\n    w_r = np.linalg.solve(X.T @ X + 0.1 * np.eye(2), X.T @ y)\n    print(np.round(w, 2).tolist(), round(float(w.sum()), 2), np.round(w_r, 2).tolist())",
  precision: "print(float(np.finfo(np.float32).eps), float(np.finfo(np.float16).eps))\nx32 = np.linalg.solve(M.astype(np.float32), b.astype(np.float32))\nM16, b16 = M.astype(np.float16).astype(float), b.astype(np.float16).astype(float)\nprint([round(float(v), 5) for v in x32], M16.tolist(), b16.tolist(), np.round(np.linalg.solve(M16, b16), 6).tolist())",
  cyu: "print([float(np.linalg.norm(np.array([1.0, -2.0, 2.0]), p)) for p in (1, 2, np.inf)], round(float(np.linalg.det(0.01 * np.eye(3))), 12), float(np.linalg.cond(0.01 * np.eye(3))))",
  ex3: "Um, sm, Vmt = np.linalg.svd(M)\nfor i in (1, 0):\n    dx = np.linalg.solve(M, 0.001 * Um[:, i])\n    print(np.round(Um[:, i] * np.sign(Um[0, i]), 4).tolist(), round(float(np.linalg.norm(dx)), 4))",
  ex4: "T3 = np.array([[1.0, 1.0], [1e-3, 0.0], [0.0, 1e-3]])\nk = np.linalg.cond(T3)\nprint(f\"{k:.6g}\", f\"{np.linalg.cond(T3.T @ T3):.6g}\", f\"{k ** 2:.6g}\")",
  ex5: "Ux, sx, Vxt = np.linalg.svd(X, full_matrices=False)\nprint(np.round(sx, 4).tolist(), np.round(Vxt * np.sign(Vxt[:, :1]), 3).tolist())",
  claim: "print(round(float(np.linalg.det(1000 * M)), 3), round(float(np.linalg.cond(1000 * M)), 1))\nx_big = np.linalg.solve(1000 * M, 1000 * np.array([2.0, 2.002]))\nprint(np.round(x_big, 6).tolist())",
};

const OUT = {
  vnorm: "[19.0, 13.0, 12.0]",
  mnorm: "4.0 4.1231 4.1231",
  system: "[1.0, 1.0] [2.0005, 0.0005] 4002.0",
  jump: "[0.0, 2.0] 0.000353 1.0 2829.1",
  det: "0.001 1e-06 4002.0 1.0",
  normal: "1.41e+08 [[1.0, 1.0], [1.0, 1.0]]\nnormal equations: Singular matrix\n[1.0, 1.0]",
  collinear: "215.1\n[0.05, 1.98] 2.02 [0.98, 1.04]\n[-1.39, 3.37] 1.98 [0.93, 1.05]\n[2.52, -0.52] 1.99 [1.04, 0.96]",
  precision: "1.1920928955078125e-07 0.0009765625\n[1.00012, 0.99988] [[1.0, 1.0], [1.0, 1.0009765625]] [2.0, 2.001953125] [0.0, 2.0]",
  cyu: "[5.0, 3.0, 2.0] 1e-06 1.0",
  ex3: "[0.7073, -0.7069] 2.0005\n[0.7069, 0.7073] 0.0005",
  ex4: "1414.21 2e+06 2e+06",
  ex5: "[11.3115, 0.0526] [[0.707, 0.707], [0.707, -0.707]]",
  claim: "1000.0 4002.0\n[0.0, 2.0]",
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

// ---------- SVD helpers ----------
// One-sided Jacobi SVD (Hestenes): rotates columns of A until they are perpendicular. Accurate for tiny σ too,
// unlike the route through AᵀA (Lecture 29). Returns σ large to small, v's (inputs) and u's (outputs).
function svdJ(A) {
  const m = A.length, n = A[0].length;
  if (m < n) { const r = svdJ(A[0].map((_, j) => A.map((row) => row[j]))); return { sig: r.sig, vs: r.us, us: r.vs }; }
  const U = A.map((r) => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 80; sweep++) {
    let rot = 0;
    for (let p = 0; p < n; p++) for (let q2 = p + 1; q2 < n; q2++) {
      let al = 0, be = 0, ga = 0;
      for (let i = 0; i < m; i++) { al += U[i][p] ** 2; be += U[i][q2] ** 2; ga += U[i][p] * U[i][q2]; }
      if (Math.abs(ga) <= 1e-15 * Math.sqrt(al * be) || ga === 0) continue;
      rot++;
      const ze = (be - al) / (2 * ga), t = Math.sign(ze || 1) / (Math.abs(ze) + Math.sqrt(1 + ze * ze)), c = 1 / Math.sqrt(1 + t * t), s = c * t;
      for (let i = 0; i < m; i++) { const a = U[i][p], b = U[i][q2]; U[i][p] = c * a - s * b; U[i][q2] = s * a + c * b; }
      for (let i = 0; i < n; i++) { const a = V[i][p], b = V[i][q2]; V[i][p] = c * a - s * b; V[i][q2] = s * a + c * b; }
    }
    if (!rot) break;
  }
  const nrm = [...Array(n).keys()].map((j) => Math.sqrt(U.reduce((s, r) => s + r[j] ** 2, 0)));
  const idx = [...Array(n).keys()].sort((i, j) => nrm[j] - nrm[i]);
  return { sig: idx.map((j) => nrm[j]), vs: idx.map((j) => V.map((r) => r[j])), us: idx.map((j) => (nrm[j] > 0 ? U.map((r) => r[j] / nrm[j]) : null)) };
}

// Gaussian elimination with partial pivoting (small dense systems).
function solveN(A0, b0) {
  const n = A0.length, A = A0.map((r, i) => [...r, b0[i]]);
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
    [A[k], A[p]] = [A[p], A[k]];
    for (let i = k + 1; i < n; i++) { const f = A[i][k] / A[k][k]; for (let j = k; j <= n; j++) A[i][j] -= f * A[k][j]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = A[i][n]; for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
  return x;
}
const norm2 = (v) => Math.hypot(...v);
const matTxt = (M, d = 4) => `[${M.map((r) => r.map((x) => num(x, d)).join("  ")).join("; ")}]`;

// ---------- A small SVG plot with curves, arrows and dots ----------

function svgPlot(el, R, height = 320) {
  const S = height / (2 * R), P = 14, W = height;
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", `${-P} ${-P} ${W + 2 * P} ${W + 2 * P}`);
  svg.setAttribute("class", "la-plane");
  svg.style.width = "100%"; svg.style.maxWidth = `${W + 2 * P}px`;
  el.appendChild(svg);
  const X = (x) => (x + R) * S, Y = (y) => (R - y) * S;
  const add = (tag, attrs) => { const n = document.createElementNS(SVGNS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); svg.appendChild(n); return n; };
  return {
    clear() {
      svg.innerHTML = "";
      for (let x = -Math.floor(R); x <= R; x++) { add("line", { x1: X(x), y1: 0, x2: X(x), y2: W, class: "grid" }); add("line", { x1: 0, y1: Y(x), x2: W, y2: Y(x), class: "grid" }); }
      add("line", { x1: 0, y1: Y(0), x2: W, y2: Y(0), class: "axis" });
      add("line", { x1: X(0), y1: 0, x2: X(0), y2: W, class: "axis" });
    },
    curve(pts, color, width = 2, dash = "") {
      add("polyline", { points: pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(" "), fill: "none", stroke: color, "stroke-width": width, "stroke-dasharray": dash });
    },
    arrow(to, color, label) {
      const [tx, ty] = [X(to[0]), Y(to[1])], [fx, fy] = [X(0), Y(0)], len = Math.hypot(tx - fx, ty - fy);
      if (len < 2) return;
      const ux = (tx - fx) / len, uy = (ty - fy) / len, h = Math.min(10, len * 0.5);
      add("line", { x1: fx, y1: fy, x2: tx - ux * h * 0.8, y2: ty - uy * h * 0.8, stroke: color, "stroke-width": 2.5 });
      add("polygon", { points: `${tx},${ty} ${tx - ux * h - uy * h * 0.45},${ty - uy * h + ux * h * 0.45} ${tx - ux * h + uy * h * 0.45},${ty - uy * h - ux * h * 0.45}`, fill: color });
      if (label) { const t = add("text", { x: tx + ux * 8 - 4, y: ty + uy * 8 + 4, fill: color, "font-size": 13 }); t.textContent = label; }
    },
  };
}

const circlePts = (k = 120) => Array.from({ length: k + 1 }, (_, i) => [Math.cos((2 * Math.PI * i) / k), Math.sin((2 * Math.PI * i) / k)]);

const cond = (A) => { const s = svdJ(A).sig; return s[s.length - 1] > 0 ? s[0] / s[s.length - 1] : Infinity; };
const sci = (v, d = 2) => (v === Infinity ? "∞" : Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(d) : num(v, 4));

// ---------- Demo: unit balls of three norms ----------

function demoNorms(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("x₁", -3, 3, 0.25, 1.5)}${slider("x₂", -3, 3, 0.25, -1)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div class="la-plot" style="flex:1 1 280px"></div><div class="la-show" style="flex:1 1 220px"></div></div>`;
  const plot = svgPlot(el.querySelector(".la-plot"), 3.2, 280);
  wireSliders(el, ([a, b]) => {
    const n1 = Math.abs(a) + Math.abs(b), n2 = Math.hypot(a, b), ni = Math.max(Math.abs(a), Math.abs(b));
    plot.clear();
    plot.curve([[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]], "var(--amber)", 2);
    plot.curve(circlePts(), "var(--teal)", 2);
    plot.curve([[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]], "var(--stone)", 2, "5 3");
    plot.arrow([a, b], "var(--ink)", "x");
    el.querySelector(".la-show").innerHTML = `<p>x = (${num(a, 2)}, ${num(b, 2)})</p>
      <p><span style="color:var(--amber)">■</span> ‖x‖₁ = ${num(n1, 4)} (diamond: ‖x‖₁ = 1)</p>
      <p><span style="color:var(--teal)">■</span> ‖x‖₂ = ${num(n2, 4)} (circle)</p>
      <p><span style="color:var(--stone)">■</span> ‖x‖∞ = ${num(ni, 4)} (square)</p>
      <p class="la-log">always ‖x‖∞ ≤ ‖x‖₂ ≤ ‖x‖₁</p>`;
  });
}

// ---------- Demo: how much does a small change in b move x? ----------

function drawEllipse(plot, A, R) {
  plot.clear();
  plot.curve(circlePts(), "#999", 1.5, "4 3");
  plot.curve(circlePts().map((p) => mv(A, p)), "var(--teal)", 2.5);
  const { sig, us } = svdJ(A);
  if (us[0]) plot.arrow(us[0].map((x) => x * sig[0]), "var(--amber)", "σmax");
  if (us[1] && sig[1] * 8 > R / 40) plot.arrow(us[1].map((x) => x * sig[1]), "var(--red)", "σmin");
  return sig;
}

function demoCond(el, opts = {}) {
  if (opts.mini) {
    el.innerHTML = `<div class="la-show" style="text-align:center"></div><p class="la-log" style="text-align:center;margin:2px 0"></p>`;
    const plot = svgPlot(el.querySelector(".la-show"), 2.6, 250), lg = el.querySelector(".la-log");
    let t = 0;
    const st = () => { const d = 0.001 + 0.999 * (0.5 + 0.5 * Math.cos(t)), A = [[1, 1], [1, 1 + d]]; const s = drawEllipse(plot, A, 2.6); lg.textContent = `[1 1; 1 ${num(1 + d, 3)}]   κ = ${sci(s[0] / s[1], 1)}`; t += 0.03; };
    st(); setInterval(st, 60); return;
  }
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="1 1; 1 1.001"></label> <label>b = <input class="la-b" value="2 2.001" style="width:9em"></label></div>
    <div class="la-ctrl">${slider("direction of δb (degrees)", 0, 180, 5, 90)}${slider("log₁₀ ‖δb‖", -6, -1, 0.5, -3)}</div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-m="1 1; 1 1.001" data-b="2 2.001">nearly singular M</button> <button class="cbtn" data-m="0.001 0; 0 0.001" data-b="0.002 0.002">0.001 I</button>
    <button class="cbtn" data-m="2 3; 0 2" data-b="5 2">L26's A</button> <button class="cbtn" data-m="0.6 -0.8; 0.8 0.6" data-b="1 0">rotation</button> <button class="cbtn" data-m="1000 1000; 1000 1001" data-b="2000 2001">1000 M</button></div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div class="la-plot" style="flex:1 1 280px"></div><div class="la-show" style="flex:1 1 260px"></div></div>`;
  const inA = el.querySelector(".la-in"), inB = el.querySelector(".la-b"), host = el.querySelector(".la-plot");
  let cur = [90, -3], plot = null, Rcur = 0;
  const draw = () => {
    const A = parseNumMat(inA.value), b = inB.value.trim().split(/[\s,]+/).map(Number), show = el.querySelector(".la-show");
    if (!ok2(A) || b.length !== 2 || !b.every(Number.isFinite)) { show.innerHTML = "Type a 2-by-2 A and a b with two entries."; return; }
    const { sig } = svdJ(A), R = Math.max(1.5, Math.ceil(sig[0] * 1.15));
    if (R !== Rcur) { host.innerHTML = ""; plot = svgPlot(host, R, 280); Rcur = R; }
    drawEllipse(plot, A, R);
    const k = sig[1] > 0 ? sig[0] / sig[1] : Infinity;
    if (!(sig[1] > 1e-14 * sig[0])) { show.innerHTML = `<p>σ = ${sci(sig[0])}, 0 → <b class="NO">singular: κ = ∞</b></p>`; return; }
    const th = (cur[0] * Math.PI) / 180, sz = 10 ** cur[1], db = [sz * Math.cos(th), sz * Math.sin(th)];
    const x = solveN(A, b), x2 = solveN(A, [b[0] + db[0], b[1] + db[1]]);
    const rb = norm2(db) / norm2(b), rx = norm2([x2[0] - x[0], x2[1] - x[1]]) / norm2(x);
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    show.innerHTML = `<p>σmax = ${sci(sig[0])}, σmin = ${sci(sig[1])} → <b>κ = ${sci(k, 1)}</b> · det = ${sci(det)}</p>
      <p>x = ${vecTxt(x, 4)} → with δb: ${vecTxt(x2, 4)}</p>
      <p>relative change of b: ${sci(rb)} · of x: ${sci(rx)}</p>
      <p><b>amplification ${sci(rx / rb, 1)}</b> ≤ κ = ${sci(k, 1)}</p>
      <p class="la-log">${k > 100 ? "turn the direction: δb along the short axis (σmin) is amplified most" : "well conditioned: every direction is amplified about equally"}</p>`;
  };
  [inA, inB].forEach((i) => i.addEventListener("input", draw));
  el.querySelectorAll(".cbtn").forEach((bt) => { bt.onclick = () => { inA.value = bt.dataset.m; inB.value = bt.dataset.b; draw(); }; });
  wireSliders(el, (v) => { cur = v; draw(); });
}

// ---------- Demo: collinear features (points drawn in the browser) ----------

function rngN(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
}

function demoCollinear(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("noise in x₂ (log₁₀)", -4, 0, 0.25, -2)}${slider("ridge λ", 0, 1, 0.05, 0.1)}</div>
    <div class="la-ctrl"><button class="cbtn la-new">new noise in y</button></div><div class="la-show"></div>`;
  let draw = 0, cur = [-2, 0.1];
  const go = () => {
    const g = rngN(29), n = 50, x1 = [], x2 = [];
    for (let i = 0; i < n; i++) { const a = g(); x1.push(a); x2.push(a + 10 ** cur[0] * g()); }
    const gy = rngN(100 + draw), y = x1.map((a, i) => a + x2[i] + 0.1 * gy());
    const X = x1.map((a, i) => [a, x2[i]]), XtX = [[0, 0], [0, 0]], Xty = [0, 0];
    X.forEach((r, i) => { for (let p = 0; p < 2; p++) { Xty[p] += r[p] * y[i]; for (let q2 = 0; q2 < 2; q2++) XtX[p][q2] += r[p] * r[q2]; } });
    const { sig, vs, us } = svdJ(X);
    const w = [0, 1].reduce((acc, i) => { const c = us[i].reduce((s, u, k) => s + u * y[k], 0) / sig[i]; return acc.map((v, j) => v + c * vs[i][j]); }, [0, 0]);
    const wr = solveN(XtX.map((r, i) => r.map((v, j) => v + (i === j ? cur[1] : 0))), Xty);
    el.querySelector(".la-show").innerHTML = `<p>κ(X) = <b>${sci(sig[0] / sig[1], 1)}</b> (σ = ${num(sig[0], 3)}, ${sci(sig[1], 2)})</p>
      <p>least squares w = ${vecTxt(w, 3)} · sum w₁ + w₂ = <b>${num(w[0] + w[1], 3)}</b></p>
      <p>ridge (λ = ${num(cur[1], 2)}): ${vecTxt(wr, 3)}</p>
      <p class="la-log">draw ${draw + 1}. The truth is (1, 1). ${sig[0] / sig[1] > 50 ? "Press ‘new noise in y’: w swings, the sum stays near 2." : "With independent-looking features both weights are well determined."}</p>`;
  };
  el.querySelector(".la-new").onclick = () => { draw++; go(); };
  wireSliders(el, (v) => { cur = v; go(); });
}

// ---------- Demo: what float32 and float16 do to the data ----------

const f16 = (x) => { if (x === 0) return 0; const e = Math.floor(Math.log2(Math.abs(x))), sp = 2 ** (e - 10); return Math.round(x / sp) * sp; };

function demoPrecision(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("δ in [1 1; 1 1+δ] (log₁₀)", -6, -1, 0.5, -3)}</div><div class="la-show"></div>`;
  wireSliders(el, ([lg]) => {
    const d = 10 ** lg, A = [[1, 1], [1, 1 + d]], b = [2, 2 + d];
    const r = (fn) => { const As = A.map((row) => row.map(fn)), bs = b.map(fn); const det = As[0][0] * As[1][1] - As[0][1] * As[1][0]; return { As, bs, x: Math.abs(det) > 0 ? solveN(As, bs) : null }; };
    const p64 = r((v) => v), p32 = r(Math.fround), p16 = r(f16);
    const row = (nm, p) => `<tr><td><b>${nm}</b></td><td style="padding:2px 8px">${p.As[1][1].toPrecision(10)}</td><td style="padding:2px 8px">${p.bs[1].toPrecision(10)}</td><td style="padding:2px 8px">${p.x ? vecTxt(p.x, 5) : '<b class="NO">singular</b>'}</td></tr>`;
    el.querySelector(".la-show").innerHTML = `<p>exact answer (1, 1); κ ≈ ${sci(cond(A), 1)}</p>
      <table style="border-collapse:collapse;font-size:14px"><tr><th></th><th style="padding:2px 8px">stored 1 + δ</th><th style="padding:2px 8px">stored 2 + δ</th><th style="padding:2px 8px">solution of the stored system</th></tr>${row("float64", p64)}${row("float32 (storage)", p32)}${row("float16 (storage)", p16)}</table>
      <p class="la-log">float16 keeps about 3 digits: once δ is below about 0.001, rounding the data alone changes the answer.</p>`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "x = (1, −2, 2). What are ‖x‖₁, ‖x‖₂, ‖x‖∞?", opts: ["5, 3, 2", "3, 5, 2", "5, 9, 2"], a: 0, why: "1 + 2 + 2 = 5, √(1 + 4 + 4) = 3, largest entry 2." },
  { q: "κ(Q) for an orthogonal matrix Q is…", opts: ["0", "1", "it depends on Q"], a: 1, why: "Every stretch is 1, so σmax = σmin = 1." },
  { q: "“det A = 10⁻⁶, so A is badly conditioned.”", opts: ["True", "False"], a: 1, why: "0.01·I (3-by-3) has det 10⁻⁶ and κ = 1. Only the ratio of stretches counts." },
  { q: "κ(A) = 10⁵. About how many digits can a float32 solve keep?", opts: ["about 11", "about 2", "none"], a: 1, why: "float32 has about 7 digits; losing about 5 leaves about 2 (float64: about 11)." },
  { q: "κ(A) = 10⁶. What is κ(AᵀA)?", opts: ["10⁶", "10¹²", "10³"], a: 1, why: "AᵀA has the squared singular values." },
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
  norms: (el) => demoNorms(el),
  cond: (el) => demoCond(el),
  condMini: (el) => demoCond(el, { mini: true }),
  collinear: (el) => demoCollinear(el),
  precision: (el) => demoPrecision(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
