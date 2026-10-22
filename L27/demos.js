// Interactive demos for LA101 Lecture 27. The sunset picture at rank k, PCA on a cloud of points.
// Every code panel is copied from notes/L27-low-rank-pca.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  keep: "import numpy as np\n\nA = np.array([[2.0, 3.0], [0.0, 2.0]])\nU, s, Vt = np.linalg.svd(A)\nA1 = s[0] * np.outer(U[:, 0], Vt[0])\nrow_only = np.array([[2.0, 3.0], [0.0, 0.0]])\ncol_only = np.outer(A[:, 0], [1, 1.5])\nfor name, M in [(\"best\", A1), (\"first row\", row_only), (\"first column\", col_only)]:\n    print(name, np.linalg.matrix_rank(M), round(float(np.linalg.norm(A - M, 2)), 4), round(float(np.linalg.norm(A - M)), 4))",
  img: "m, n = 48, 64\ny, x = np.mgrid[0:m, 0:n]\nimg = 0.2 + 0.6 * (y / (m - 1))                           # sky\nimg = img + 0.8 * (((x - 44) ** 2 + (y - 14) ** 2) < 49)   # sun\nimg[y > 40 - np.abs(x - 18) * 0.9] = 0.35                 # mountain\nimg[y > 36] = 0.15 + 0.1 * np.sin(x[y > 36] / 3)          # sea\nimg = np.clip(img, 0, 1)\nU, s, Vt = np.linalg.svd(img)\nprint(img.shape, np.linalg.matrix_rank(img), np.round(s[:6], 3).tolist())",
  table: "total = (s ** 2).sum()\nfor k in (1, 2, 5, 10, 20):\n    Ak = U[:, :k] * s[:k] @ Vt[:k]\n    rel = np.linalg.norm(img - Ak) / np.linalg.norm(img)\n    print(k, k * (m + n + 1), round(float((s[:k] ** 2).sum() / total), 4), round(float(rel), 4),\n          round(float(np.linalg.norm(img - Ak, 2)), 4), round(float(s[k]), 4))",
  share: "share = np.cumsum(s ** 2) / total\nprint(int(np.argmax(share >= 0.999)) + 1, round(float(share[19]), 4))",
  squares: "print(round(float(s[0] ** 2 / total), 4), round(float(s[0] / s.sum()), 4))",
  noise: "noise = np.random.default_rng(1).uniform(-0.5, 0.5, (m, n))\nsn_ = np.linalg.svd(noise, compute_uv=False)\nprint(np.round(sn_[:3], 3).tolist(), round(float((sn_[:10] ** 2).sum() / (sn_ ** 2).sum()), 4))",
  data: "rng = np.random.default_rng(27)\nnpeople = 200\nfit = rng.normal(0, 1, npeople)\nexercise = 30 + 12 * fit + rng.normal(0, 4, npeople)\npulse = 70 - 6 * fit + rng.normal(0, 3, npeople)\nX = np.column_stack([exercise, pulse])\nprint(X.shape, np.round(X[:3], 1).tolist(), np.round(X.mean(axis=0), 2).tolist())",
  pca: "mean = X.mean(axis=0)\nXc = X - mean\nUc, sc, Vtc = np.linalg.svd(Xc, full_matrices=False)\nv1 = Vtc[0] * np.sign(Vtc[0, 0])\nprint(np.round(sc, 2).tolist(), np.round(v1, 4).tolist(), round(float(sc[0] ** 2 / (sc ** 2).sum()), 4))\nprint(np.round((Xc @ v1)[:3], 2).tolist())",
  cols: "print(np.round((Xc ** 2).sum(axis=0) / (Xc ** 2).sum(), 4).tolist())",
  cov: "C = np.cov(X.T)\nprint(np.round(np.linalg.eigvalsh(C)[::-1], 3).tolist(), np.round(sc ** 2 / (npeople - 1), 3).tolist())",
  raw: "_, _, Vt_raw = np.linalg.svd(X, full_matrices=False)\nw = Vt_raw[0] * np.sign(Vt_raw[0, 0])\nprint(np.round(w, 4).tolist(), np.round(mean / np.linalg.norm(mean), 4).tolist())",
  lora: "d, r = 4096, 8\nprint(d * d, 2 * d * r, round(2 * d * r / (d * d) * 100, 2))\nrng2 = np.random.default_rng(8)\nB = rng2.normal(size=(64, 4))\nA_ = rng2.normal(size=(4, 64))\nprint(np.linalg.matrix_rank(B @ A_), int((np.linalg.svd(B @ A_, compute_uv=False) > 1e-9).sum()))",
  cyu: "print(round(np.sqrt(1 + 0.25), 4), 36 / 40)",
  ex3: "rel = np.sqrt(1 - np.cumsum(s ** 2) / total)\nk5 = int(np.argmax(rel < 0.05)) + 1\nprint(k5, round(float(rel[k5 - 1]), 4), round(float(rel[k5 - 2]), 4))",
  ex4: "P = np.array([[1, 1], [3, 3], [2, 3], [2, 1]], dtype=float)\nPc = P - P.mean(axis=0)\nlam, vec = np.linalg.eigh(Pc.T @ Pc)\nprint(P.mean(axis=0).tolist(), (Pc.T @ Pc).tolist(), np.round(lam[::-1], 4).tolist(), np.round(vec[:, 1] * np.sign(vec[0, 1]), 4).tolist())",
  claim: "print(round(float(sc[0] / sc.sum()), 4), round(float(sc[0] ** 2 / (sc ** 2).sum()), 4), round(float(np.linalg.eigvalsh(C)[1] / np.trace(C)), 4))",
};

const OUT = {
  keep: "best 1 1.0 1.0\nfirst row 1 2.0 2.0\nfirst column 1 2.0 2.0",
  img: "(48, 64) 38 [20.244, 4.963, 1.982, 1.857, 1.3, 1.126]",
  table: "1 113 0.9107 0.2989 4.9635 4.9635\n2 226 0.9654 0.186 1.9824 1.9824\n5 565 0.9856 0.1201 1.1261 1.1261\n10 1130 0.9949 0.0715 0.5754 0.5754\n20 2260 0.9991 0.0294 0.2427 0.2427",
  share: "20 0.9991",
  squares: "0.9107 0.4889",
  noise: "[4.137, 3.895, 3.728] 0.4965",
  data: "(200, 2) [[40.3, 64.3], [32.2, 66.7], [37.7, 63.8]] [30.02, 69.89]",
  pca: "[190.72, 43.01] [0.9143, -0.405] 0.9516\n[11.71, 3.31, 9.5]",
  cols: "[0.8034, 0.1966]",
  cov: "[182.777, 9.294] [182.777, 9.294]",
  raw: "[0.3943, 0.919] [0.3946, 0.9189]",
  lora: "16777216 65536 0.39\n4 4",
  cyu: "1.118 0.9",
  ex3: "15 0.0462 0.0503",
  ex4: "[2.0, 2.0] [[2.0, 2.0], [2.0, 4.0]] [5.2361, 0.7639] [0.5257, 0.8507]",
  claim: "0.816 0.9516 0.9516",
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

// ---------- SVD helpers (small symmetric matrices by Jacobi) ----------
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

// ---------- Demo: the sunset picture at rank k ----------

// The same formulas as the note: sky, sun, mountain, sea with waves (48 rows, 64 columns, brightness 0..1).
function sunset() {
  const m = 48, n = 64, img = [];
  for (let y = 0; y < m; y++) {
    const row = [];
    for (let x = 0; x < n; x++) {
      let v = 0.2 + 0.6 * (y / (m - 1));
      if ((x - 44) ** 2 + (y - 14) ** 2 < 49) v += 0.8;
      if (y > 40 - Math.abs(x - 18) * 0.9) v = 0.35;
      if (y > 36) v = 0.15 + 0.1 * Math.sin(x / 3);
      row.push(Math.min(1, Math.max(0, v)));
    }
    img.push(row);
  }
  return img;
}

let SUNSET = null;
function sunsetSVD() {
  if (SUNSET) return SUNSET;
  const A = sunset(), { sig, vs } = svdSmall(A);
  const AV = vs.map((v) => mv(A, v));                     // A v_i = σ_i u_i
  const total = sig.reduce((s, x) => s + x * x, 0);
  SUNSET = { A, sig, vs, AV, total };
  return SUNSET;
}

// A_k = Σ_{i<k} (A v_i) v_iᵀ
function rankK(k) {
  const { A, vs, AV } = sunsetSVD();
  return A.map((_, r) => vs[0].map((_, c) => { let s = 0; for (let i = 0; i < k; i++) s += AV[i][r] * vs[i][c]; return s; }));
}

function paint(canvas, M) {
  const ctx = canvas.getContext("2d"), m = M.length, n = M[0].length, im = ctx.createImageData(n, m);
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
    const g = Math.round(255 * Math.min(1, Math.max(0, M[r][c]))), p = 4 * (r * n + c);
    im.data[p] = g; im.data[p + 1] = g; im.data[p + 2] = g; im.data[p + 3] = 255;
  }
  ctx.putImageData(im, 0, 0);
}

const pixCanvas = (w) => `<canvas width="64" height="48" style="width:${w}px;height:${Math.round(w * 0.75)}px;image-rendering:pixelated;border:1px solid var(--line);border-radius:4px"></canvas>`;

function demoCompress(el, opts = {}) {
  if (opts.mini) {
    el.innerHTML = `<div class="la-show" style="text-align:center">${pixCanvas(256)}<p class="la-log" style="margin:4px 0"></p></div>`;
    const cv = el.querySelector("canvas"), lg = el.querySelector(".la-log");
    const ks = [1, 2, 3, 5, 10, 20, 38];
    let i = 0;
    const step = () => { const k = ks[i]; paint(cv, rankK(k)); lg.textContent = `k = ${k} pieces`; i = (i + 1) % ks.length; };
    step(); setInterval(step, 1300); return;
  }
  el.innerHTML = `<div class="la-ctrl">${slider("pieces k", 1, 48, 1, 5)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start"><div style="text-align:center">${pixCanvas(256)}<br><small>A<sub>k</sub></small></div>
    <div style="text-align:center">${pixCanvas(256)}<br><small>the original A (rank 38)</small></div><div class="la-show" style="flex:1 1 220px"></div></div>`;
  const [cvK, cvA] = el.querySelectorAll("canvas"), { A, sig, total } = sunsetSVD();
  paint(cvA, A);
  wireSliders(el, ([k]) => {
    paint(cvK, rankK(k));
    const kept = sig.slice(0, k).reduce((s, x) => s + x * x, 0) / total;
    const stored = k * (48 + 64 + 1);
    el.querySelector(".la-show").innerHTML = `<p><b>k = ${k}</b>: ${stored} numbers stored (${num(100 * stored / 3072, 1)}% of 3072)${stored > 3072 ? ' — <b class="NO">more than the picture itself</b>' : ""}</p>
      <p>share kept Σσᵢ² (i ≤ k) / Σσᵢ² = <b>${num(100 * kept, 2)}%</b></p>
      <p>relative error ‖A − A<sub>k</sub>‖<sub>F</sub>/‖A‖<sub>F</sub> = ${num(Math.sqrt(Math.max(0, 1 - kept)), 4)}</p>
      <p>2-norm error = σ<sub>k+1</sub> = ${k < sig.length ? num(sig[k], 4) : "0"}</p>
      <p class="la-log">σ₁…σ₆ = ${sig.slice(0, 6).map((x) => num(x, 3)).join(", ")}</p>`;
  });
}

// ---------- Demo: PCA on a cloud of points (drawn in the browser) ----------

function rng32(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
}

function cloud(noise, seed = 27) {
  const g = rng32(seed), pts = [];
  for (let i = 0; i < 200; i++) { const f = g(); pts.push([30 + 12 * f + noise * g(), 70 - 6 * f + 0.75 * noise * g()]); }
  return pts;
}

function pca2(pts, centre) {
  const n = pts.length, mean = [0, 1].map((j) => pts.reduce((s, p) => s + p[j], 0) / n);
  const X = centre ? pts.map((p) => [p[0] - mean[0], p[1] - mean[1]]) : pts;
  const { sig, vs } = svdSmall(X), tot = sig[0] ** 2 + sig[1] ** 2;
  return { mean, sig, v1: vs[0][0] < 0 ? vs[0].map((x) => -x) : vs[0], share: sig[0] ** 2 / tot };
}

function demoPCA(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("extra noise", 0, 12, 0.5, 4)}</div>
    <div class="la-ctrl"><label><input type="checkbox" class="la-c" checked> centre first</label></div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div class="la-plot" style="flex:1 1 320px"></div><div class="la-show" style="flex:1 1 240px"></div></div>`;
  const box = el.querySelector(".la-c"), host = el.querySelector(".la-plot");
  const W = 340, H = 300, X0 = -10, X1 = 80, Y0 = 35, Y1 = 105;
  const X = (x) => ((x - X0) / (X1 - X0)) * W, Y = (y) => H - ((y - Y0) / (Y1 - Y0)) * H;
  let cur = [4];
  const draw = () => {
    const pts = cloud(cur[0]), r = pca2(pts, box.checked), [m0, m1] = r.mean;
    const from = box.checked ? [m0, m1] : [0, 0], L = box.checked ? 40 : 110;
    const p1 = [from[0] - (box.checked ? L : 0) * r.v1[0], from[1] - (box.checked ? L : 0) * r.v1[1]], p2 = [from[0] + L * r.v1[0], from[1] + L * r.v1[1]];
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;background:var(--card);border:1px solid var(--line);border-radius:6px">
      ${pts.map(([a, b]) => `<circle cx="${X(a).toFixed(1)}" cy="${Y(b).toFixed(1)}" r="2.2" fill="var(--teal)" opacity="0.55"/>`).join("")}
      <line x1="${X(p1[0])}" y1="${Y(p1[1])}" x2="${X(p2[0])}" y2="${Y(p2[1])}" stroke="var(--amber)" stroke-width="3"/>
      <circle cx="${X(m0)}" cy="${Y(m1)}" r="5" fill="var(--amber)"/>
      <circle cx="${X(0)}" cy="${Y(Math.max(Y0, 0))}" r="0"/>
      <text x="6" y="16" font-size="12" fill="var(--ink)">pulse ↑ · exercise minutes →</text></svg>`;
    el.querySelector(".la-show").innerHTML = `<p>mean (${num(m0, 2)}, ${num(m1, 2)})</p>
      <p>first direction v₁ = ${vecTxt(r.v1, 3)}</p>
      <p>${box.checked ? `share of the spread σ₁²/(σ₁² + σ₂²) = <b>${num(100 * r.share, 1)}%</b>` : `the direction of the mean is ${vecTxt([m0, m1].map((v) => v / Math.hypot(m0, m1)), 3)}`}</p>
      <p class="la-log">${box.checked ? "the line through the centre along v₁ is the closest line to the points" : '<b class="NO">not centred: v₁ points from the origin at the centre of the cloud, not along it</b>'}</p>`;
  };
  box.addEventListener("change", draw);
  wireSliders(el, (v) => { cur = v; draw(); });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A has singular values 10, 3, 1, 0.5. What is ‖A − A₂‖₂?", opts: ["3", "1", "1.118"], a: 1, why: "The 2-norm error is σ₃ = 1; the Frobenius error is √(1² + 0.5²) ≈ 1.118." },
  { q: "How many numbers does a rank-k approximation of an m-by-n image store?", opts: ["k·m·n", "k(m + n + 1)", "m + n + k"], a: 1, why: "k columns u (m each), k rows v (n each) and k numbers σ." },
  { q: "“PCA is the SVD of the data table.” What is missing?", opts: ["nothing", "the table must be centred first", "the table must be square"], a: 1, why: "Without centring, the first direction points at the mean." },
  { q: "The singular values of a centred table are 6 and 2. The first direction carries…", opts: ["75%", "90%", "50%"], a: 1, why: "36 / (36 + 4) = 0.9: shares use σ², not σ." },
  { q: "Why is BA (B 4096-by-8, A 8-by-4096) of rank at most 8?", opts: ["every column of BA is a combination of the 8 columns of B", "A has 4096 columns", "4096 is a power of 2"], a: 0, why: "So the column space of BA has dimension at most 8." },
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
  compress: (el) => demoCompress(el),
  compressMini: (el) => demoCompress(el, { mini: true }),
  pca: (el) => demoPCA(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
