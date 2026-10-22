// Interactive demos for LA101 Lecture 28. Shortest solution of one equation, pseudoinverse calculator with a cut-off, ridge tending to the pseudoinverse.
// Every code panel is copied from notes/L28-pseudoinverse.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  left: "import numpy as np\nA = np.array([[1.0, 0.0], [1.0, 1.0], [1.0, 2.0]])\nb = np.array([1.0, 2.0, 4.0])\nL = np.linalg.inv(A.T @ A) @ A.T\nprint(np.round(L, 4).tolist())\nprint((np.round(L @ A, 10) + 0.0).tolist(), np.round(L @ b, 4).tolist())",
  alr: "print(np.round(A @ L, 4).tolist())",
  right: "W = np.array([[1.0, 1.0, 2.0]])\nR = W.T @ np.linalg.inv(W @ W.T)\nprint(np.round(R.ravel() * 6, 10).tolist(), np.round(W @ R, 10).tolist(), np.round((R @ [4.0]).ravel(), 4).tolist())",
  bplus: "B = np.array([[1.0, 2.0], [2.0, 4.0], [2.0, 4.0]])\nUb, sb, Vbt = np.linalg.svd(B)\nBp = Vbt[0][:, None] @ Ub[:, 0][None, :] / sb[0]\nprint(round(float(sb[0] ** 2), 6), np.round(Bp * 45, 10).tolist(), np.allclose(Bp, np.linalg.pinv(B)))",
  penrose: "P_col = B @ Bp\nP_row = Bp @ B\nprint(np.round(P_col * 9, 10).tolist(), np.round(P_row * 5, 10).tolist())\nprint(np.allclose(B @ Bp @ B, B), np.allclose(Bp @ B @ Bp, Bp), np.allclose(P_col, P_col.T), np.allclose(P_row, P_row.T))",
  same: "print(np.allclose(np.linalg.pinv(A), L), np.allclose(np.linalg.pinv(W), R))",
  shortest: "xp = np.linalg.pinv(W) @ np.array([4.0])\nfor x in [xp, np.array([4.0, 0.0, 0.0]), np.array([0.0, 0.0, 2.0])]:\n    print(np.round(x, 4).tolist(), round(float((W @ x)[0]), 10), round(float(np.linalg.norm(x)), 4))",
  both: "c = np.array([1.0, 2.0, 3.0])\nxc = np.linalg.pinv(B) @ c\nprint(np.round(xc, 4).tolist(), np.round(B @ xc, 4).tolist(), round(float(np.linalg.norm(B @ xc - c)), 4))\nx2 = xc + np.array([2.0, -1.0])\nprint(np.round(B @ x2, 4).tolist(), round(float(np.linalg.norm(xc)), 4), round(float(np.linalg.norm(x2)), 4))",
  tiny: "N = np.array([[1.0, 1.0], [1.0, 1.0 + 1e-10]])\nd = np.array([2.0, 2.001])\nprint([float(f\"{v:.3g}\") for v in np.linalg.svd(N, compute_uv=False)])\nprint(np.round(np.linalg.pinv(N) @ d, 1).tolist(), np.round(np.linalg.pinv(N, rcond=1e-8) @ d, 4).tolist())",
  features: "rng = np.random.default_rng(28)\nX = rng.normal(size=(3, 5))\ny = np.array([2.0, 0.0, 1.0])\nw_plus = np.linalg.pinv(X) @ y\nprint(np.round(w_plus, 4).tolist(), (np.round(X @ w_plus, 10) + 0.0).tolist(), round(float(np.linalg.norm(w_plus)), 4))",
  ridge: "for lam in [1.0, 0.01, 1e-6]:\n    w_lam = np.linalg.solve(X.T @ X + lam * np.eye(5), X.T @ y)\n    print(lam, round(float(np.linalg.norm(w_lam - w_plus)), 8))",
  cyu: "M = np.array([[2.0, 1.0], [1.0, 1.0]])\nprint(np.allclose(np.linalg.pinv(M), np.linalg.inv(M)), np.linalg.pinv(np.ones((4, 7))).shape, np.round(np.linalg.pinv(np.array([[1.0, 1.0]])) @ [2.0], 10).tolist())",
  ex3: "G = B.T / 45\nprint(np.allclose(B @ G @ B, B), np.allclose(G @ B @ G, G), np.allclose(B @ G, (B @ G).T), np.allclose(G @ B, (G @ B).T))",
  ex4: "xs = (np.linalg.pinv(np.array([[1.0, 2.0]])) @ [5.0]).ravel()\nprint(np.round(xs, 10).tolist(), round(float(np.dot(np.array([5.0, 0.0]) - xs, xs)), 10) + 0.0)",
  ex5: "w1 = np.linalg.solve(X.T @ X + np.eye(5), X.T @ y)\nprint(round(float(np.linalg.norm(w1)), 4), round(float(np.linalg.norm(w_plus)), 4), round(float(np.linalg.norm(X @ w1 - y)), 4))",
  claim: "try:\n    print(np.linalg.inv(B.T @ B) @ B.T @ c)\nexcept np.linalg.LinAlgError as e:\n    print(\"LinAlgError:\", e)\nprint(np.round(np.linalg.lstsq(B, c, rcond=None)[0], 4).tolist())",
};

const OUT = {
  left: "[[0.8333, 0.3333, -0.1667], [-0.5, 0.0, 0.5]]\n[[1.0, 0.0], [0.0, 1.0]] [0.8333, 1.5]",
  alr: "[[0.8333, 0.3333, -0.1667], [0.3333, 0.3333, 0.3333], [-0.1667, 0.3333, 0.8333]]",
  right: "[1.0, 1.0, 2.0] [[1.0]] [0.6667, 0.6667, 1.3333]",
  bplus: "45.0 [[1.0, 2.0, 2.0], [2.0, 4.0, 4.0]] True",
  penrose: "[[1.0, 2.0, 2.0], [2.0, 4.0, 4.0], [2.0, 4.0, 4.0]] [[1.0, 2.0], [2.0, 4.0]]\nTrue True True True",
  same: "True True",
  shortest: "[0.6667, 0.6667, 1.3333] 4.0 1.633\n[4.0, 0.0, 0.0] 4.0 4.0\n[0.0, 0.0, 2.0] 4.0 2.0",
  both: "[0.2444, 0.4889] [1.2222, 2.4444, 2.4444] 0.7454\n[1.2222, 2.4444, 2.4444] 0.5466 2.3019",
  tiny: "[2.0, 5e-11]\n[-9999989.4, 9999991.4] [1.0002, 1.0003]",
  features: "[-0.7441, 0.0672, -1.2794, -1.0537, 0.842] [2.0, 0.0, 1.0] 2.0036",
  ridge: "1.0 1.03815957\n0.01 0.02253341\n1e-06 2.28e-06",
  cyu: "True (7, 4) [1.0, 1.0]",
  ex3: "True True True True",
  ex4: "[1.0, 2.0] 0.0",
  ex5: "1.0172 2.0036 0.9751",
  claim: "LinAlgError: Singular matrix\n[0.2444, 0.4889]",
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

// A⁺ = Σ_{σ_i > cut} v_i u_iᵀ / σ_i, with cut = rcond · σ₁.
function pinvSmall(A, rcond = 1e-15) {
  const { sig, vs, us } = svdJ(A), m = A.length, n = A[0].length, cut = rcond * sig[0];
  const P = Array.from({ length: n }, () => Array(m).fill(0));
  sig.forEach((s, i) => { if (s > cut && us[i]) for (let r = 0; r < n; r++) for (let c = 0; c < m; c++) P[r][c] += (vs[i][r] * us[i][c]) / s; });
  return { P, sig, kept: sig.filter((s) => s > cut).length };
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

// ---------- Demo: the shortest solution of a₁x + a₂y = b ----------

function demoShortest(el, opts = {}) {
  el.innerHTML = `${opts.mini ? "" : `<div class="la-ctrl">${slider("a₁", -3, 3, 0.5, 1)}${slider("a₂", -3, 3, 0.5, 2)}${slider("b", -5, 5, 0.5, 5)}${slider("move along the line", -4, 4, 0.1, 2)}</div>`}
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div class="la-plot" style="flex:1 1 300px"></div>${opts.mini ? "" : `<div class="la-show" style="flex:1 1 240px"></div>`}</div>`;
  const P = plane(el.querySelector(".la-plot"), [-5, 5], [-5, 5], { height: opts.mini ? 240 : 300 });
  const draw = (a1, a2, b, t) => {
    P.clear();
    const aa = a1 * a1 + a2 * a2;
    if (aa < 1e-12) { if (!opts.mini) el.querySelector(".la-show").innerHTML = '<p class="NO">a = (0, 0): the equation reads 0 = b.</p>'; return; }
    const xp = [a1 * b / aa, a2 * b / aa], dir = [-a2 / Math.sqrt(aa), a1 / Math.sqrt(aa)], other = [xp[0] + t * dir[0], xp[1] + t * dir[1]];
    P.line(a1, a2, b, "A");
    P.arrow([0, 0], other, "C", "another x");
    P.arrow([0, 0], xp, "A", "x⁺");
    if (!opts.mini) el.querySelector(".la-show").innerHTML = `<p>solutions of ${num(a1, 2)}x + ${num(a2, 2)}y = ${num(b, 2)}: the teal line</p>
      <p><b>x⁺ = a·b/‖a‖² = ${vecTxt(xp, 3)}</b>, length ${num(norm2(xp), 4)}: along the row a = (${num(a1, 2)}, ${num(a2, 2)})</p>
      <p>another solution ${vecTxt(other, 3)}, length ${num(norm2(other), 4)}</p>
      <p class="la-log">Pythagoras: ${num(norm2(xp), 3)}² + ${num(Math.abs(t), 3)}² = ${num(norm2(other), 3)}² — the step along the line is perpendicular to x⁺</p>`;
  };
  if (opts.mini) { let t = 0; const st = () => { draw(1, 2, 5, 3 * Math.sin(t)); t += 0.05; }; st(); setInterval(st, 60); return; }
  wireSliders(el, ([a1, a2, b, t]) => draw(a1, a2, b, t));
}

// ---------- Demo: pseudoinverse calculator with a cut-off ----------

function demoPinv(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="1 2; 2 4; 2 4"></label> <label>b = <input class="la-b" value="1 2 3"></label></div>
    <div class="la-ctrl">${slider("cut-off: log₁₀ rcond", -16, -1, 1, -15)}</div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-m="1 2; 2 4; 2 4" data-b="1 2 3">rank-one B</button> <button class="cbtn" data-m="1 0; 1 1; 1 2" data-b="1 2 4">three readings</button>
    <button class="cbtn" data-m="1 1 2" data-b="4">x₁ + x₂ + 2x₃ = 4</button> <button class="cbtn" data-m="1 1; 1 1.0000000001" data-b="2 2.001">nearly singular N</button> <button class="cbtn" data-m="2 1; 1 1" data-b="1 0">invertible</button></div>
    <div class="la-show"></div>`;
  const inA = el.querySelector(".la-in"), inB = el.querySelector(".la-b");
  let lg = -15;
  const draw = () => {
    const A = parseNumMat(inA.value), b = inB.value.trim().split(/[\s,]+/).map(Number), show = el.querySelector(".la-show");
    const ok = A.length > 0 && A.length <= 4 && A.every((r) => r.length === A[0].length && r.length <= 4 && r.every(Number.isFinite));
    if (!ok || b.length !== A.length || !b.every(Number.isFinite)) { show.innerHTML = "Type A (rows separated by ';', at most 4 by 4) and a b with one entry per row."; return; }
    const { P, sig, kept } = pinvSmall(A, 10 ** lg), x = mv(P, b), Ax = mv(A, x), res = norm2(Ax.map((v, i) => v - b[i]));
    show.innerHTML = `<p>σ = ${sig.map((s) => (s < 1e-3 && s > 0 ? s.toExponential(2) : num(s, 4))).join(", ")} · inverted: <b>${kept}</b> of them (σ &gt; ${(10 ** lg).toExponential(0)}·σ₁)</p>
      <p>A⁺ = ${matTxt(P, 4)}</p>
      <p><b>x⁺ = A⁺b = ${vecTxt(x, 4)}</b>, length ${num(norm2(x), 4)}</p>
      <p>Ax⁺ = ${vecTxt(Ax, 4)} · distance to b: ${num(res, 4)}</p>
      <p class="la-log">${norm2(x) > 1e4 ? '<b class="NO">a tiny σ was inverted: the answer is huge. Raise the cut-off.</b>' : res < 1e-9 ? "an exact solution — the shortest one" : "no exact solution: x⁺ is the shortest least-squares answer"}</p>`;
  };
  [inA, inB].forEach((i) => i.addEventListener("input", draw));
  el.querySelectorAll(".cbtn").forEach((bt) => { bt.onclick = () => { inA.value = bt.dataset.m; inB.value = bt.dataset.b; draw(); }; });
  wireSliders(el, ([v]) => { lg = v; draw(); });
}

// ---------- Demo: ridge regression tends to the pseudoinverse answer ----------

// The 3-by-5 X of the note (seed 28), rounded to 4 decimals.
const XR = [[-1.2068, 0.1314, -0.231, -0.5242, 0.2913], [0.9284, -0.0108, -1.1808, 0.4094, -0.4605], [0.9961, -0.336, 0.7051, -1.1624, 1.7114]];
const YR = [2, 0, 1];

function demoRidge(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("log₁₀ λ", -8, 2, 0.5, 0)}</div><div class="la-show"></div>`;
  const XtX = XR[0].map((_, i) => XR[0].map((_, j) => XR.reduce((s, r) => s + r[i] * r[j], 0))), Xty = XR[0].map((_, i) => XR.reduce((s, r, k) => s + r[i] * YR[k], 0));
  const wp = mv(pinvSmall(XR).P, YR);
  wireSliders(el, ([lg]) => {
    const lam = 10 ** lg, w = solveN(XtX.map((r, i) => r.map((v, j) => v + (i === j ? lam : 0))), Xty);
    const fit = norm2(mv(XR, w).map((v, i) => v - YR[i])), d = norm2(w.map((v, i) => v - wp[i]));
    const bar = (v, c) => `<span style="display:inline-block;height:0.75em;width:${Math.round(Math.min(v, 3) * 90)}px;background:var(${c});vertical-align:middle"></span>`;
    el.querySelector(".la-show").innerHTML = `<p>λ = ${lam.toExponential(1)}</p>
      <p>w<sub>λ</sub> = ${vecTxt(w, 4)}</p><p>w⁺ = ${vecTxt(wp, 4)}</p>
      <p>‖w<sub>λ</sub>‖ = ${num(norm2(w), 4)} ${bar(norm2(w), "--teal")} &nbsp; (‖w⁺‖ = ${num(norm2(wp), 4)})</p>
      <p>fit error ‖Xw<sub>λ</sub> − y‖ = ${num(fit, 4)} ${bar(fit, "--amber")}</p>
      <p class="la-log">distance to w⁺: ${d < 1e-4 ? d.toExponential(2) : num(d, 4)} — ${lam < 1e-4 ? "almost the pseudoinverse answer" : "shorter weights, but no longer an exact fit"}</p>`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "What is A⁺ when A is square and invertible?", opts: ["A⁻¹", "Aᵀ", "it does not exist"], a: 0, why: "All singular values are nonzero and are inverted: V Σ⁻¹ Uᵀ = A⁻¹." },
  { q: "A is 5-by-3 with rank 3. What is A⁺A?", opts: ["the 3-by-3 identity", "a projection of rank 2", "the 5-by-5 identity"], a: 0, why: "Independent columns: A⁺ is the left inverse. AA⁺ is the projection onto the column space (rank 3)." },
  { q: "“Σ⁺ has 1/σᵢ for every i.”", opts: ["True", "False: only the nonzero σᵢ are inverted"], a: 1, why: "Zeros stay zero; in floating point, tiny σ's are cut off too." },
  { q: "A is 4-by-7. What size is A⁺?", opts: ["4-by-7", "7-by-4", "7-by-7"], a: 1, why: "A⁺ maps the 4 outputs back to the 7 inputs." },
  { q: "The shortest solution of x + y = 2 is…", opts: ["(2, 0)", "(1, 1)", "(0, 2)"], a: 1, why: "Along the row (1, 1): length √2, against 2 for the others." },
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
  shortest: (el) => demoShortest(el),
  shortestMini: (el) => demoShortest(el, { mini: true }),
  pinv: (el) => demoPinv(el),
  ridge: (el) => demoRidge(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
