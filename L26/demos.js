// Interactive demos for LA101 Lecture 26. Circle to ellipse, singular values vs eigenvalues, hidden tastes in a ratings table.
// Every code panel is copied from notes/L26-svd.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  ellipse: "import numpy as np\n\nA = np.array([[2, 3], [0, 2]])\nv1, v2 = np.array([1, 2]) / np.sqrt(5), np.array([2, -1]) / np.sqrt(5)\nu1, u2 = np.array([2, 1]) / np.sqrt(5), np.array([1, -2]) / np.sqrt(5)\nprint(np.round(A @ v1, 4).tolist(), np.round(4 * u1, 4).tolist())\nprint(np.round(A @ v2, 4).tolist(), np.round(1 * u2, 4).tolist())\nprint(round(float(v1 @ v2), 10), round(float(u1 @ u2), 10))\ntheta = np.linspace(0, 2 * np.pi, 3601)\nlengths = np.linalg.norm(A @ np.vstack([np.cos(theta), np.sin(theta)]), axis=0)\nprint(round(lengths.max(), 4), round(lengths.min(), 4))",
  usv: "U = np.column_stack([u1, u2])\nV = np.column_stack([v1, v2])\nS = np.diag([4, 1])\nprint((np.round(U @ S @ V.T, 10) + 0.0).tolist())\nprint((np.round(U.T @ U, 10) + 0.0).tolist(), (np.round(V.T @ V, 10) + 0.0).tolist())",
  ata: "AtA = A.T @ A\nlam, X = np.linalg.eigh(AtA)\norder = np.argsort(lam)[::-1]\nlam, X = lam[order], X[:, order]\nprint(AtA.tolist(), np.round(lam, 10).tolist(), np.round(np.sqrt(lam), 10).tolist())\nfor i in range(2):\n    x = X[:, i] * np.sign(X[0, i])\n    print(np.round(x * np.sqrt(5), 6).tolist(), np.round(A @ x / np.sqrt(lam[i]) * np.sqrt(5), 6).tolist())",
  wrong: "U_wrong = np.column_stack([u1, -u2])\nprint(np.round(U_wrong @ S @ V.T, 4).tolist())",
  noteig: "print(np.linalg.eigvals(A).real.tolist(), np.round(np.linalg.svd(A, compute_uv=False), 10).tolist(), round(float(np.linalg.det(A)), 10))\nSym = np.array([[2, 1], [1, 2]])\nprint(np.round(np.linalg.eigvalsh(Sym), 10).tolist(), np.round(np.linalg.svd(Sym, compute_uv=False), 10).tolist())\nNeg = np.array([[1, 2], [2, -2]])\nprint(np.round(np.linalg.eigvalsh(Neg), 10).tolist(), np.round(np.linalg.svd(Neg, compute_uv=False), 10).tolist())",
  rot: "c, s_ = np.cos(np.pi / 6), np.sin(np.pi / 6)\nQ = np.array([[c, -s_], [s_, c]])\nprint(np.round(np.linalg.eigvals(Q), 4).tolist(), np.round(np.linalg.svd(Q, compute_uv=False), 10).tolist())",
  pieces: "P1 = 4 * np.outer(u1, v1)\nP2 = 1 * np.outer(u2, v2)\nprint(np.round(P1, 4).tolist())\nprint(np.round(P1 + P2, 10).tolist(), np.linalg.matrix_rank(P1))",
  rankB: "B = np.array([[1, 2], [2, 4], [2, 4]])\nUb, sb, Vhb = np.linalg.svd(B)\nprint(np.round(sb, 6).tolist(), np.linalg.matrix_rank(B))\nprint(np.round(Vhb[0] * np.sign(Vhb[0, 0]) * np.sqrt(5), 6).tolist(), np.round(Ub[:, 0] * np.sign(Ub[0, 0]) * 3, 6).tolist())\nprint(np.round(B @ Vhb[1], 10).tolist(), np.round(Ub[:, 1:].T @ B, 10).tolist())",
  vh: "U_, s_, Vh = np.linalg.svd(A)\nprint(np.round(A @ Vh[0], 4).tolist(), np.round(s_[0] * U_[:, 0], 4).tolist())\nprint(np.round(A @ Vh[:, 0], 4).tolist())",
  ratings: "R = np.array([[5, 4, 0, 1], [5, 5, 5, 5], [0, 1, 5, 4], [5, 4.5, 2.5, 3], [2.5, 3, 5, 4.5]])\nUr, sr, Vhr = np.linalg.svd(R)\nprint(np.round(sr, 4).tolist(), np.linalg.matrix_rank(R))\nv1r = Vhr[0] * np.sign(Vhr[0].sum())\nv2r = Vhr[1] * np.sign(Vhr[1, 0])\nprint(np.round(v1r, 3).tolist(), np.round(v2r, 3).tolist())\nprint((np.round(R @ v2r, 3) + 0.0).tolist())",
  cyu: "M = np.arange(15).reshape(3, 5) % 4  # a 3-by-5 example; its third row becomes the sum of the first two\nM[2] = M[0] + M[1]\nprint(np.linalg.matrix_rank(M), int((np.linalg.svd(M, compute_uv=False) > 1e-10).sum()), [x.shape for x in np.linalg.svd(M)])",
  extra: "for extra in ([4, 4, 4, 4], [5, 0, 0, 0]):\n    R6 = np.vstack([R, extra])\n    print(np.linalg.matrix_rank(R6), np.round(np.linalg.svd(R6, compute_uv=False), 3).tolist())",
  claim: "x = np.array([1, 2]) / np.sqrt(5)\nprint(round(float(np.linalg.norm(A @ x)), 4), round(float(np.linalg.norm(A @ np.array([0, 1]))), 4))",
};

const OUT = {
  ellipse: "[3.5777, 1.7889] [3.5777, 1.7889]\n[0.4472, -0.8944] [0.4472, -0.8944]\n0.0 0.0\n4.0 1.0",
  usv: "[[2.0, 3.0], [0.0, 2.0]]\n[[1.0, 0.0], [0.0, 1.0]] [[1.0, 0.0], [0.0, 1.0]]",
  ata: "[[4, 6], [6, 13]] [16.0, 1.0] [4.0, 1.0]\n[1.0, 2.0] [2.0, 1.0]\n[2.0, -1.0] [1.0, -2.0]",
  wrong: "[[1.2, 3.4], [1.6, 1.2]]",
  noteig: "[2.0, 2.0] [4.0, 1.0] 4.0\n[1.0, 3.0] [3.0, 1.0]\n[-3.0, 2.0] [3.0, 2.0]",
  rot: "[(0.866+0.5j), (0.866-0.5j)] [1.0, 1.0]",
  pieces: "[[1.6, 3.2], [0.8, 1.6]]\n[[2.0, 3.0], [0.0, 2.0]] 1",
  rankB: "[6.708204, 0.0] 1\n[1.0, 2.0] [1.0, 2.0, 2.0]\n[0.0, 0.0, 0.0] [[0.0, 0.0], [0.0, 0.0]]",
  vh: "[3.5777, 1.7889] [3.5777, 1.7889]\n[-1.7889, -1.7889]",
  ratings: "[16.2019, 6.5192, 0.0, 0.0] 2\n[0.5, 0.5, 0.5, 0.5] [0.606, 0.364, -0.606, -0.364]\n[4.123, 0.0, -4.123, 2.062, -2.062]",
  cyu: "2 2 [(3, 3), (3,), (5, 5)]",
  extra: "2 [18.069, 6.519, 0.0, 0.0]\n3 [16.409, 7.301, 2.726, 0.0]",
  claim: "4.0 3.6056",
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

// ---------- SVD helpers (2-by-2 in closed form, small symmetric matrices by Jacobi) ----------

// Eigen-decomposition of a symmetric matrix by cyclic Jacobi rotations; eigenvalues large to small.
function jacobiEig(S0) {
  const n = S0.length, S = S0.map((r) => r.slice()), V = S0.map((_, i) => S0.map((_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q2 = p + 1; q2 < n; q2++) off += S[p][q2] * S[p][q2];
    if (off < 1e-22) break;
    for (let p = 0; p < n; p++) for (let q2 = p + 1; q2 < n; q2++) {
      if (Math.abs(S[p][q2]) < 1e-15) continue;
      const th = (S[q2][q2] - S[p][p]) / (2 * S[p][q2]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = S[k][p], b = S[k][q2]; S[k][p] = c * a - s * b; S[k][q2] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = S[p][k], b = S[q2][k]; S[p][k] = c * a - s * b; S[q2][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q2]; V[k][p] = c * a - s * b; V[k][q2] = s * a + c * b; }
    }
  }
  const idx = [...Array(n).keys()].sort((i, j) => S[j][j] - S[i][i]);
  return { vals: idx.map((i) => S[i][i]), vecs: idx.map((i) => V.map((r) => r[i])) };
}

// SVD of any small matrix through AᵀA: σ (large to small), v's, and u = Av/σ for σ > 0.
function svdSmall(A) {
  const n = A[0].length, AtA = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => A.reduce((s, r) => s + r[i] * r[j], 0)));
  const { vals, vecs } = jacobiEig(AtA);
  const sig = vals.map((l) => Math.sqrt(Math.max(l, 0)));
  const vs = vecs.map((v) => { const k = v.find((x) => Math.abs(x) > 1e-9) || 1; return k < 0 ? v.map((x) => -x) : v; });
  const us = vs.map((v, i) => (sig[i] > 1e-9 ? mv(A, v).map((x) => x / sig[i]) : null));
  return { sig, vs, us };
}

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

// ---------- Demo: circle to ellipse, singular values next to eigenvalues ----------

function drawSVD(plot, A) {
  const { sig, vs, us } = svdSmall(A);
  plot.clear();
  plot.curve(circlePts(), "#999", 1.5, "4 3");
  plot.curve(circlePts().map((p) => mv(A, p)), "var(--teal)", 2.5);
  plot.arrow(vs[0], "#999", "v₁");
  plot.arrow(vs[1], "#999", "v₂");
  if (us[0]) plot.arrow(us[0].map((x) => x * sig[0]), "var(--amber)", "σ₁u₁");
  if (us[1]) plot.arrow(us[1].map((x) => x * sig[1]), "var(--amber)", "σ₂u₂");
  return { sig, vs, us };
}

function demoSVD(el, opts = {}) {
  if (opts.mini) {
    el.innerHTML = `<div class="la-show"></div>`;
    const plot = svgPlot(el.querySelector(".la-show"), 4.6, 260);
    let t = 0;
    const step = () => { const s = 0.5 - 0.5 * Math.cos(t); drawSVD(plot, [[1 + s, 3 * s], [0, 1 + s]]); t += 0.06; };
    step(); setInterval(step, 60); return;
  }
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="2 3; 0 2"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-m="2 3; 0 2">our A</button> <button class="cbtn" data-m="2 1; 1 2">symmetric</button>
    <button class="cbtn" data-m="1 2; 2 -2">negative λ</button> <button class="cbtn" data-m="0.866 -0.5; 0.5 0.866">rotation 30°</button> <button class="cbtn" data-m="1 2; 2 4">rank one</button> <button class="cbtn" data-m="3 0; 0 -2">exercise 1</button></div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div class="la-plot" style="flex:1 1 300px"></div><div class="la-show" style="flex:1 1 260px"></div></div>`;
  const inp = el.querySelector("input"), plot = svgPlot(el.querySelector(".la-plot"), 5, 320);
  const draw = () => {
    const A = parseNumMat(inp.value), show = el.querySelector(".la-show");
    if (!ok2(A)) { show.innerHTML = "Type a 2-by-2 matrix: two rows separated by ';'."; return; }
    const { sig, vs, us } = drawSVD(plot, A), e = eig2(A);
    const lamTxt = e.complex ? `${num(e.re, 3)} ± ${num(e.im, 3)}i (complex)` : `${num(e.lams[0], 4)} and ${num(e.lams[1], 4)}`;
    show.innerHTML = `<p><b>singular values</b> σ₁ = ${num(sig[0], 4)}, σ₂ = ${num(sig[1], 4)}</p>
      <p>v₁ = ${vecTxt(vs[0], 3)}, v₂ = ${vecTxt(vs[1], 3)}</p>
      <p>u₁ = ${us[0] ? vecTxt(us[0], 3) : "—"}, u₂ = ${us[1] ? vecTxt(us[1], 3) : "— (σ₂ = 0)"}</p>
      <p><b>eigenvalues</b> ${lamTxt}</p>
      <p class="la-log">σ₁σ₂ = ${num(sig[0] * sig[1], 4)} = |det A| = ${num(Math.abs(e.det), 4)}${sig[1] < 1e-9 ? ' — <b class="NO">σ₂ = 0: the ellipse is flat, rank one</b>' : ""}</p>`;
  };
  inp.addEventListener("input", draw);
  el.querySelectorAll(".cbtn").forEach((bt) => { bt.onclick = () => { inp.value = bt.dataset.m; draw(); }; });
  draw();
}

// ---------- Demo: hidden tastes in the ratings table ----------

const FILMS = ["Star Chase", "Robot Run", "Rain Garden", "Paris Letters"];
const FRIENDS = [["Ana", [5, 4, 0, 1]], ["Ben", [5, 5, 5, 5]], ["Cai", [0, 1, 5, 4]], ["Dev", [5, 4.5, 2.5, 3]], ["Eli", [2.5, 3, 5, 4.5]]];

function demoRatings(el) {
  el.innerHTML = `<div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:14px"><label><input type="radio" name="sixth" value="" checked> five friends</label>
    <label><input type="radio" name="sixth" value="4 4 4 4"> add Fay (4, 4, 4, 4)</label><label><input type="radio" name="sixth" value="5 0 0 0"> add Fay (5, 0, 0, 0)</label></div><div class="la-show"></div>`;
  const draw = () => {
    const pick = el.querySelector("input:checked").value;
    const rows = pick ? [...FRIENDS, ["Fay", pick.split(" ").map(Number)]] : FRIENDS;
    const R = rows.map((r) => r[1]), { sig, vs } = svdSmall(R);
    const rank = sig.filter((s) => s > 1e-8 * sig[0]).length, v2 = vs[1], sc = R.map((r) => r.reduce((s, x, j) => s + x * v2[j], 0));
    const tbl = `<table class="la-tbl" style="border-collapse:collapse;font-size:14px;margin:6px 0"><tr><th></th>${FILMS.map((f) => `<th style="padding:3px 8px;border-bottom:1px solid var(--line)">${f}</th>`).join("")}<th>score Rv₂</th></tr>` +
      rows.map(([nm, r], i) => `<tr><td><b>${nm}</b></td>${r.map((x) => `<td style="padding:3px 8px;text-align:center">${x}</td>`).join("")}<td style="color:var(${sc[i] > 0.01 ? "--teal" : sc[i] < -0.01 ? "--amber" : "--ink"})"><b>${num(sc[i], 2)}</b></td></tr>`).join("") + `</table>`;
    el.querySelector(".la-show").innerHTML = tbl +
      `<p>σ = ${sig.map((s) => num(s, 3)).join(", ")} → <b>rank ${rank}</b></p>
       <p>v₁ = ${vecTxt(vs[0], 3)} (likes films at all) · v₂ = ${vecTxt(v2, 3)} (adventure + / drama −)</p>
       <p class="la-log">${rank > 2 ? '<b class="NO">a third taste appears: Fay likes only Star Chase, which no mix of the two tastes explains</b>' : "two tastes explain every rating exactly"}</p>`;
  };
  el.querySelectorAll("input").forEach((b) => b.addEventListener("change", draw));
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A is 3-by-5 with rank 2. How many positive singular values does it have?", opts: ["2", "3", "5"], a: 0, why: "One for each dimension of the column space: the rank. U is 3-by-3, Σ 3-by-5, V 5-by-5." },
  { q: "“The singular values are the absolute values of the eigenvalues.”", opts: ["Always true", "Only for symmetric matrices", "Never true"], a: 1, why: "[2 3; 0 2] has eigenvalues 2, 2 and singular values 4, 1." },
  { q: "σ₁ = 7. The largest possible length of Ax for a unit vector x is…", opts: ["7", "49", "√7"], a: 0, why: "σ₁ is the largest stretch, reached at x = v₁." },
  { q: "Why are singular values never negative?", opts: ["they are square roots of eigenvalues of AᵀA, which are ‖Av‖² ≥ 0", "numpy sorts them", "A must be symmetric"], a: 0, why: "A sign can always be moved into uᵢ." },
  { q: "In U, s, Vh = np.linalg.svd(A), where is v₂?", opts: ["column 1 of Vh", "row 1 of Vh", "column 1 of U"], a: 1, why: "Vh is Vᵀ: the v's are its rows (counting from 0)." },
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
  svd: (el) => demoSVD(el),
  svdMini: (el) => demoSVD(el, { mini: true }),
  ratings: (el) => demoRatings(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
