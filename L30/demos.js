// Interactive demos for LA101 Lecture 30. Jacobi and Gauss–Seidel, CG on a sparse plate, the shifted QR algorithm and Hessenberg form.
// Every code panel is copied from notes/L30-iterative-methods.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  jacobi0: "import numpy as np\nA = np.array([[4.0, 1.0, 0.0], [1.0, 5.0, 2.0], [0.0, 2.0, 6.0]])\nb = A @ np.array([1.0, 2.0, 3.0])\nd = np.diag(A)\nx = np.zeros(3)\nfor k in range(3):\n    x = (b - (A - np.diag(d)) @ x) / d\n    print(k + 1, np.round(x, 4).tolist())\nprint(b.tolist())",
  rho: "D, L, U = np.diag(d), np.tril(A, -1), np.triu(A, 1)\nrho = lambda M: float(max(abs(np.linalg.eigvals(M))))\nM_J = -np.linalg.solve(D, L + U)\nM_G = -np.linalg.solve(D + L, U)\nprint(round(rho(M_J), 4), round(rho(M_G), 4), round(rho(M_J) ** 2, 4))",
  count: "def jacobi(x):\n    return (b - (L + U) @ x) / d\n\ndef seidel(x):\n    return np.linalg.solve(D + L, b - U @ x)\n\nfor step in (jacobi, seidel):\n    x, k = np.zeros(3), 0\n    while np.linalg.norm(x - [1, 2, 3]) >= 1e-8:\n        x, k = step(x), k + 1\n    print(step.__name__, k)",
  diverge: "B = np.array([[1.0, 2.0], [2.0, 1.0]])\nc = B @ np.array([1.0, 1.0])\nx = np.zeros(2)\nfor k in range(5):\n    x = (c - (B - np.diag(np.diag(B))) @ x) / np.diag(B)\n    print(x.tolist(), end=\" \")\nprint()\nprint(round(float(np.linalg.det(B)), 6), round(rho(-np.diag(1 / np.diag(B)) @ (B - np.diag(np.diag(B)))), 6))",
  plate: "m = 20\nT = 2 * np.eye(m) - np.eye(m, k=1) - np.eye(m, k=-1)\nP = np.kron(np.eye(m), T) + np.kron(T, np.eye(m))\nf = np.ones(m * m)\nprint(P.shape, np.count_nonzero(P), round(np.count_nonzero(P) / P.size * 100, 2), round(float(np.linalg.cond(P)), 1))",
  steps: "def steps(update):\n    x, k = np.zeros(m * m), 0\n    while np.linalg.norm(f - P @ x) > 1e-6 * np.linalg.norm(f):\n        x, k = update(x), k + 1\n    return k\n\ndP, LP, UP = np.diag(P), np.tril(P), np.triu(P, 1)\nprint(\"Jacobi\", steps(lambda x: (f - (P - np.diag(dP)) @ x) / dP))\nprint(\"Gauss-Seidel\", steps(lambda x: np.linalg.solve(LP, f - UP @ x)))\nprint(round(rho(np.eye(m * m) - P / 4), 4), round(float(np.cos(np.pi / (m + 1))), 4))",
  cg: "def cg(P, f, tol=1e-6):\n    x = np.zeros(len(f))\n    r = f.copy()\n    p = r.copy()\n    k = 0\n    while np.linalg.norm(r) > tol * np.linalg.norm(f):\n        Pp = P @ p\n        alpha = (r @ r) / (p @ Pp)\n        x = x + alpha * p\n        r_new = r - alpha * Pp\n        p = r_new + (r_new @ r_new) / (r @ r) * p\n        r = r_new\n        k += 1\n    return x, k\n\nx_cg, k = cg(P, f)\nprint(k, f\"{np.linalg.norm(x_cg - np.linalg.solve(P, f)):.1e}\")",
  roots: "ev = np.arange(10.0, 26.0)\nQ0, _ = np.linalg.qr(np.random.default_rng(30).normal(size=(16, 16)))\nS16 = Q0 @ np.diag(ev) @ Q0.T\nroots = np.roots(np.poly(S16))\nprint(int(np.sum(abs(roots.imag) > 1e-9)), f\"{max(abs(np.sort(roots.real) - ev)):.2f}\")\nprint(f\"{max(abs(np.linalg.eigvalsh(S16) - ev)):.1e}\")",
  unshifted: "S = np.array([[2.0, 1.0, 0.0], [1.0, 3.0, 1.0], [0.0, 1.0, 4.0]])\nprint(np.round(np.linalg.eigvalsh(S), 6).tolist())\nAk = S.copy()\nfor k in range(5):\n    Qk, Rk = np.linalg.qr(Ak)\n    Ak = Rk @ Qk\nprint(np.round(Ak, 4).tolist())",
  shift: "def qr_corner(A, shift, tol=1e-12):\n    A, n, history = A.copy(), len(A), []\n    for k in range(1, 100):\n        s = A[-1, -1] if shift else 0.0\n        Qk, Rk = np.linalg.qr(A - s * np.eye(n))\n        A = Rk @ Qk + s * np.eye(n)\n        history.append(abs(A[-1, -2]))\n        if history[-1] < tol:\n            return k, A, history\n\nk0, _, _ = qr_corner(S, shift=False)\nk1, A1, h1 = qr_corner(S, shift=True)\nprint(k0, k1, [f\"{v:.1e}\" for v in h1], round(float(A1[-1, -1]), 6))",
  hess: "def hessenberg(A):\n    H = A.astype(float).copy()\n    n = len(H)\n    Q = np.eye(n)\n    for k in range(n - 2):\n        v = H[k + 1:, k].copy()\n        v[0] += np.copysign(np.linalg.norm(v), v[0])\n        v /= np.linalg.norm(v)\n        Pk = np.eye(n)\n        Pk[k + 1:, k + 1:] -= 2 * np.outer(v, v)\n        H, Q = Pk @ H @ Pk, Q @ Pk\n    return H, Q\n\nA5 = np.random.default_rng(30).integers(-4, 5, size=(5, 5)).astype(float)\nH, Q = hessenberg(A5)\nprint(A5.astype(int).tolist())\nprint((np.round(H, 3) + 0.0).tolist())\nprint(bool(np.allclose(Q.T @ A5 @ Q, H)), int(np.sum(np.abs(H[np.tril_indices(5, -2)]) < 1e-12)))\nprint(np.round(np.sort_complex(np.linalg.eigvals(A5)), 4).tolist())\nprint(np.round(np.sort_complex(np.linalg.eigvals(H)), 4).tolist())",
  hessqr: "Qh, Rh = np.linalg.qr(H)\nprint(f\"{np.max(np.abs(np.tril(Rh @ Qh, -2))):.0e}\")",
  map: "Qa, Ra = np.linalg.qr(A)\nmats = {\"LU\": np.linalg.solve(A, b), \"QR\": np.linalg.solve(Ra, Qa.T @ b), \"SVD\": np.linalg.pinv(A) @ b,\n        \"CG\": cg(A, b, 1e-12)[0]}\nprint({k: np.round(v, 6).tolist() for k, v in mats.items()})",
  cyu: "C = np.array([[5.0, 1.0], [2.0, 4.0]])\nMC = -np.diag(1 / np.diag(C)) @ (C - np.diag(np.diag(C)))\nprint(MC.tolist(), round(rho(MC), 4), round(float(np.log(1e-6) / np.log(0.9)), 1))",
  ex3: "B2 = np.array([[2.0, 1.0], [1.0, 2.0]])\nc2 = np.array([3.0, 3.0])\nx = np.zeros(2)\nfor k in range(30):\n    x = (c2 - (B2 - np.diag(np.diag(B2))) @ x) / np.diag(B2)\nprint(round(rho(-np.diag(1 / np.diag(B2)) @ (B2 - np.diag(np.diag(B2)))), 6), np.round(x, 6).tolist())",
  ex5: "def eig_qr(A, tol=1e-12):\n    A, found, steps = A.copy(), [], 0\n    while len(A) > 1:\n        n = len(A)\n        s = A[-1, -1]\n        Qk, Rk = np.linalg.qr(A - s * np.eye(n))\n        A = Rk @ Qk + s * np.eye(n)\n        steps += 1\n        if abs(A[-1, -2]) < tol:\n            found.append(A[-1, -1])\n            A = A[:-1, :-1]\n    found.append(A[0, 0])\n    return sorted(found), steps\n\nvals, total = eig_qr(S)\nprint(np.round(vals, 10).tolist(), total)",
  claim: "N = np.array([[1.0, 3.0], [-1.0, 2.0]])\nbN = N @ np.array([1.0, 1.0])\n\ndef cg_steps(A, f, steps):\n    x, r = np.zeros(len(f)), f.copy()\n    p = r.copy()\n    for _ in range(steps):\n        Ap = A @ p\n        alpha = (r @ r) / (p @ Ap)\n        x = x + alpha * p\n        r_new = r - alpha * Ap\n        p = r_new + (r_new @ r_new) / (r @ r) * p\n        r = r_new\n    return x\n\nprint(np.round(cg_steps(N, bN, 2), 4).tolist(), np.round(np.linalg.solve(N, bN), 4).tolist())",
};

const OUT = {
  jacobi0: "1 [1.5, 3.4, 3.6667]\n2 [0.65, 1.6333, 2.5333]\n3 [1.0917, 2.2567, 3.1222]\n[6.0, 17.0, 22.0]",
  rho: "0.4282 0.1833 0.1833",
  count: "jacobi 24\nseidel 13",
  diverge: "[3.0, 3.0] [-3.0, -3.0] [9.0, 9.0] [-15.0, -15.0] [33.0, 33.0] \n-3.0 2.0",
  plate: "(400, 400) 1920 1.2 178.1",
  steps: "Jacobi 1216\nGauss-Seidel 609\n0.9888 0.9888",
  cg: "32 4.0e-06",
  roots: "8 0.70\n2.1e-14",
  unshifted: "[1.267949, 3.0, 4.732051]\n[[4.6062, 0.4497, 0.0], [0.4497, 3.1234, -0.0662], [0.0, -0.0662, 1.2704]]",
  shift: "34 5 ['7.5e-01', '2.7e-01', '7.2e-03', '1.2e-07', '6.3e-22'] 4.732051",
  hess: "[[-4, -2, 2, -1, -1], [-4, 1, 1, -2, 3], [-3, 3, -4, -2, 2], [-4, -3, -1, 2, 1], [-3, -2, -2, 1, 2]]\n[[-4.0, 1.273, -1.236, 2.579, -0.446], [7.071, -0.04, 1.473, 2.92, -3.485], [0.0, -1.414, 1.84, 2.961, 2.169], [0.0, 0.0, 4.714, -1.944, 2.569], [0.0, 0.0, 0.0, -0.628, 1.144]]\nTrue 6\n[(-5.1421-1.3146j), (-5.1421+1.3146j), (0.9283+0j), (3.178-1.9348j), (3.178+1.9348j)]\n[(-5.1421-1.3146j), (-5.1421+1.3146j), (0.9283+0j), (3.178-1.9348j), (3.178+1.9348j)]",
  hessqr: "6e-16",
  map: "{'LU': [1.0, 2.0, 3.0], 'QR': [1.0, 2.0, 3.0], 'SVD': [1.0, 2.0, 3.0], 'CG': [1.0, 2.0, 3.0]}",
  cyu: "[[0.0, -0.2], [-0.5, 0.0]] 0.3162 131.1",
  ex3: "0.5 [1.0, 1.0]",
  ex5: "[1.2679491924, 3.0, 4.7320508076] 7",
  claim: "[2.8462, 1.4615] [1.0, 1.0]",
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

// ---------- Small dense helpers (floats) ----------
const matMul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const tr = (A) => A[0].map((_, j) => A.map((r) => r[j]));
const idn = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
const nrm = (v) => Math.hypot(...v);
const matHtmlF = (M, d = 3, zeroBelow = -1) => `<table class="la-mat" style="border-collapse:collapse;font-size:13px;margin:4px 0">${M.map((r, i) => `<tr>${r.map((v, j) => `<td style="padding:2px 7px;text-align:right;${zeroBelow >= 0 && i - j >= zeroBelow ? "color:var(--teal);font-weight:700" : ""}">${Math.abs(v) < 5e-13 ? "0" : num(v, d)}</td>`).join("")}</tr>`).join("")}</table>`;

// Householder QR of a square matrix: returns Q, R with A = QR.
function qrH(A0) {
  const n = A0.length, R = A0.map((r) => r.slice());
  let Q = idn(n);
  for (let k = 0; k < n - 1; k++) {
    const x = R.slice(k).map((r) => r[k]), a = nrm(x);
    if (a < 1e-300) continue;
    const v = x.slice(); v[0] += (x[0] >= 0 ? 1 : -1) * a;
    const vn = nrm(v); if (vn < 1e-300) continue;
    for (let i = 0; i < v.length; i++) v[i] /= vn;
    for (let j = 0; j < n; j++) { let s = 0; for (let i = k; i < n; i++) s += v[i - k] * R[i][j]; for (let i = k; i < n; i++) R[i][j] -= 2 * v[i - k] * s; }
    for (let i = 0; i < n; i++) { let s = 0; for (let j = k; j < n; j++) s += Q[i][j] * v[j - k]; for (let j = k; j < n; j++) Q[i][j] -= 2 * s * v[j - k]; }
  }
  return { Q, R };
}

// Reduction to upper Hessenberg form by Householder reflections on both sides.
function hessenbergJS(A0) {
  const n = A0.length; let H = A0.map((r) => r.slice());
  for (let k = 0; k < n - 2; k++) {
    const x = H.slice(k + 1).map((r) => r[k]), a = nrm(x);
    if (a < 1e-14) continue;
    const v = x.slice(); v[0] += (x[0] >= 0 ? 1 : -1) * a;
    const vn = nrm(v); for (let i = 0; i < v.length; i++) v[i] /= vn;
    const P = idn(n); for (let i = 0; i < v.length; i++) for (let j = 0; j < v.length; j++) P[k + 1 + i][k + 1 + j] -= 2 * v[i] * v[j];
    H = matMul(matMul(P, H), P);
  }
  return H;
}

// ---------- A log-scale plot of errors against the step number ----------
function logPlot(el, series, { maxK = 40, lo = -12, hi = 2, height = 220 } = {}) {
  const W = 520, H = height, P = 34, X = (k) => P + (k / maxK) * (W - P - 8), Y = (lg) => 8 + ((hi - Math.max(lo, Math.min(hi, lg))) / (hi - lo)) * (H - 8 - 22);
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px" class="la-plane">`;
  for (let e = lo; e <= hi; e += 2) s += `<line x1="${P}" y1="${Y(e)}" x2="${W - 8}" y2="${Y(e)}" class="grid"/><text x="2" y="${Y(e) + 4}" font-size="10" fill="var(--stone)">1e${e}</text>`;
  s += `<text x="${W - 60}" y="${H - 4}" font-size="11" fill="var(--stone)">step k</text>`;
  for (const { ys, color } of series) {
    const pts = ys.map((v, k) => (v > 0 && k <= maxK ? `${X(k)},${Y(Math.log10(v))}` : null)).filter(Boolean).join(" ");
    s += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.2"/>`;
  }
  el.innerHTML = s + "</svg>";
}

// ---------- Jacobi and Gauss–Seidel on a small system ----------
function iterate(A, b, kind, steps) {
  const n = A.length; let x = Array(n).fill(0); const out = [x.slice()];
  for (let k = 0; k < steps; k++) {
    const old = x.slice();
    for (let i = 0; i < n; i++) {
      let s = b[i];
      for (let j = 0; j < n; j++) if (j !== i) s -= A[i][j] * (kind === "gs" ? x[j] : old[j]);
      x[i] = s / A[i][i];
    }
    out.push(x.slice());
    if (!x.every(Number.isFinite) || nrm(x) > 1e12) break;
  }
  return out;
}

function demoIter(el, opts = {}) {
  const A0 = "4 1 0; 1 5 2; 0 2 6";
  if (opts.mini) {
    el.innerHTML = `<div class="la-plot"></div><p class="la-log" style="text-align:center;margin:2px 0">error per step on a log scale: <span style="color:var(--teal)">Jacobi ρ ≈ 0.43</span> · <span style="color:var(--amber)">Gauss–Seidel ρ ≈ 0.18</span></p>`;
    const A = parseNumMat(A0), xs = [1, 2, 3], b = A.map((r) => r.reduce((s, v, j) => s + v * xs[j], 0));
    const err = (kind) => iterate(A, b, kind, 30).map((x) => nrm(x.map((v, i) => v - xs[i])));
    const ej = err("j"), eg = err("gs"); let k = 1;
    const st = () => { logPlot(el.querySelector(".la-plot"), [{ ys: ej.slice(0, k + 1), color: "var(--teal)" }, { ys: eg.slice(0, k + 1), color: "var(--amber)" }], { maxK: 30, height: 200 }); k = k >= 30 ? 1 : k + 1; };
    st(); setInterval(st, 180); return;
  }
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="${A0}" style="width:14em"></label> <label>answer x* = <input class="la-x" value="1 2 3" style="width:7em"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-m="${A0}" data-x="1 2 3">section 1</button> <button class="cbtn" data-m="1 2; 2 1" data-x="1 1">B (not dominant)</button> <button class="cbtn" data-m="2 1; 1 2" data-x="1 1">B with rows swapped</button> <button class="cbtn" data-m="5 1; 2 4" data-x="1 -1">check question 1</button></div>
    <div class="la-plot"></div><div class="la-show"></div>`;
  const inA = el.querySelector(".la-in"), inX = el.querySelector(".la-x");
  const draw = () => {
    const A = parseNumMat(inA.value), xs = inX.value.trim().split(/[\s,]+/).map(Number), show = el.querySelector(".la-show");
    const n = A.length;
    if (!(n >= 2 && n <= 4 && A.every((r) => r.length === n && r.every(Number.isFinite)) && xs.length === n && xs.every(Number.isFinite))) { show.innerHTML = "Type a square A (2-by-2 to 4-by-4) and an answer with as many entries."; return; }
    if (A.some((r, i) => r[i] === 0)) { show.innerHTML = '<b class="NO">A zero on the diagonal: Jacobi and Gauss–Seidel divide by it. Reorder the rows.</b>'; return; }
    const b = A.map((r) => r.reduce((s, v, j) => s + v * xs[j], 0));
    const res = {};
    for (const kind of ["j", "gs"]) {
      const it = iterate(A, b, kind, 200), e = it.map((x) => nrm(x.map((v, i) => v - xs[i])));
      const hit = e.findIndex((v) => v < 1e-8);
      let k1 = Math.min(e.length - 1, 60); while (k1 > 1 && e[k1] < 1e-11) k1--;
      const k0 = Math.max(0, k1 - 8), rho = k1 > k0 && e[k0] > 0 ? (e[k1] / e[k0]) ** (1 / (k1 - k0)) : NaN;
      res[kind] = { it, e, hit, rho };
    }
    logPlot(el.querySelector(".la-plot"), [{ ys: res.j.e, color: "var(--teal)" }, { ys: res.gs.e, color: "var(--amber)" }], { maxK: 40, hi: 4 });
    const dom = A.every((r, i) => Math.abs(r[i]) > r.reduce((s, v, j) => s + (j === i ? 0 : Math.abs(v)), 0));
    const line = (nm, r, col) => `<p><span style="color:${col}">■</span> <b>${nm}</b>: steps 1–3 ${r.it.slice(1, 4).map((x) => vecTxt(x, 3)).join(" → ")}<br>${r.hit >= 0 ? `within 10⁻⁸ of x* after <b>${r.hit}</b> steps` : '<b class="NO">does not reach 10⁻⁸</b>'} · error factor per step ≈ ${Number.isFinite(r.rho) ? num(r.rho, 3) : "—"}</p>`;
    show.innerHTML = `<p>b = A x* = ${vecTxt(b, 3)} · ${dom ? "diagonally dominant: both converge" : '<b class="NO">not diagonally dominant</b>: no guarantee'}</p>${line("Jacobi", res.j, "var(--teal)")}${line("Gauss–Seidel", res.gs, "var(--amber)")}
      <p class="la-log">The error factor is measured from the curve; in the long run it is the spectral radius ρ of the iteration matrix.</p>`;
  };
  [inA, inX].forEach((i) => i.addEventListener("input", draw));
  el.querySelectorAll(".cbtn").forEach((bt) => { bt.onclick = () => { inA.value = bt.dataset.m; inX.value = bt.dataset.x; draw(); }; });
  draw();
}

// ---------- The heated plate: steps of Jacobi, Gauss–Seidel and CG ----------
function plateSteps(m, tol = 1e-6) {
  const n = m * m, f = Array(n).fill(1), id = (i, j) => i * m + j;
  const Pmul = (x) => { const y = Array(n); for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) { let s = 4 * x[id(i, j)]; if (i > 0) s -= x[id(i - 1, j)]; if (i < m - 1) s -= x[id(i + 1, j)]; if (j > 0) s -= x[id(i, j - 1)]; if (j < m - 1) s -= x[id(i, j + 1)]; y[id(i, j)] = s; } return y; };
  const resid = (x) => { const y = Pmul(x); return nrm(y.map((v, k) => f[k] - v)); }, fn = nrm(f);
  const count = (sweep) => { let x = Array(n).fill(0), k = 0; while (resid(x) > tol * fn && k < 20000) { x = sweep(x); k++; } return k; };
  const jac = (x) => { const y = Array(n); for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) { let s = 1; if (i > 0) s += x[id(i - 1, j)]; if (i < m - 1) s += x[id(i + 1, j)]; if (j > 0) s += x[id(i, j - 1)]; if (j < m - 1) s += x[id(i, j + 1)]; y[id(i, j)] = s / 4; } return y; };
  const gs = (x0) => { const x = x0.slice(); for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) { let s = 1; if (i > 0) s += x[id(i - 1, j)]; if (i < m - 1) s += x[id(i + 1, j)]; if (j > 0) s += x[id(i, j - 1)]; if (j < m - 1) s += x[id(i, j + 1)]; x[id(i, j)] = s / 4; } return x; };
  let x = Array(n).fill(0), r = f.slice(), p = r.slice(), kc = 0;
  while (nrm(r) > tol * fn && kc < 5000) { const Pp = Pmul(p), rr = r.reduce((s, v) => s + v * v, 0), al = rr / p.reduce((s, v, k) => s + v * Pp[k], 0); x = x.map((v, k) => v + al * p[k]); const rn = r.map((v, k) => v - al * Pp[k]); const be = rn.reduce((s, v) => s + v * v, 0) / rr; p = rn.map((v, k) => v + be * p[k]); r = rn; kc++; }
  return { n, J: count(jac), G: count(gs), C: kc, rho: Math.cos(Math.PI / (m + 1)) };
}

function demoPlate(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("grid m (m × m interior points)", 4, 30, 1, 20)}</div><div class="la-show"></div>`;
  wireSliders(el, ([m]) => {
    const r = plateSteps(m), bar = (k, col, max) => `<span style="display:inline-block;height:12px;width:${Math.max(2, (300 * k) / max)}px;background:${col};vertical-align:middle"></span>`;
    const mx = Math.max(r.J, r.G, r.C);
    el.querySelector(".la-show").innerHTML = `<p>${r.n} unknowns · nonzeros ${5 * r.n - 4 * m} of ${r.n * r.n} (${num((100 * (5 * r.n - 4 * m)) / (r.n * r.n), 2)}%) · Jacobi ρ = cos(π/${m + 1}) = ${num(r.rho, 4)}</p>
      <p>${bar(r.J, "var(--teal)", mx)} Jacobi <b>${r.J}</b> steps</p><p>${bar(r.G, "var(--amber)", mx)} Gauss–Seidel <b>${r.G}</b></p><p>${bar(r.C, "var(--red)", mx)} conjugate gradients <b>${r.C}</b></p>
      <p class="la-log">steps until the residual is a millionth of ‖f‖. Double m: Jacobi needs about four times as many steps, CG about twice as many.</p>`;
  });
}

// ---------- The QR algorithm, step by step ----------
function demoQR(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>symmetric S = <input class="la-in" value="2 1 0; 1 3 1; 0 1 4" style="width:13em"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn la-step">one QR step</button> <button class="cbtn la-five">five steps</button> <label><input type="checkbox" class="la-shift"> shift by the corner entry</label> <button class="cbtn la-reset">reset</button></div>
    <div class="la-show"></div>`;
  const inA = el.querySelector(".la-in"), sh = el.querySelector(".la-shift");
  let A = null, k = 0, hist = [];
  const reset = () => { A = parseNumMat(inA.value); k = 0; hist = []; show(); };
  const step = () => {
    if (!A) return; const n = A.length, s = sh.checked ? A[n - 1][n - 1] : 0;
    const { Q, R } = qrH(A.map((r, i) => r.map((v, j) => v - (i === j ? s : 0))));
    A = matMul(R, Q).map((r, i) => r.map((v, j) => v + (i === j ? s : 0))); k++; hist.push(Math.abs(A[n - 1][n - 2]));
  };
  const show = () => {
    const out = el.querySelector(".la-show");
    if (!(A && A.length >= 2 && A.length <= 5 && A.every((r) => r.length === A.length && r.every(Number.isFinite)))) { out.innerHTML = "Type a square matrix (2-by-2 to 5-by-5); symmetric gives real eigenvalues."; return; }
    const n = A.length, trace = A.reduce((s, r, i) => s + r[i], 0);
    out.innerHTML = `<p>after <b>${k}</b> step${k === 1 ? "" : "s"}${sh.checked ? " (shifted)" : ""}: trace ${num(trace, 6)} (unchanged: similar matrices)</p>${matHtmlF(A, 6)}
      <p>corner |a<sub>${n}${n - 1}</sub>|: ${hist.length ? hist.slice(-6).map((v) => sci(v, 1)).join(" → ") : "—"}</p>
      <p class="la-log">${hist.length && hist[hist.length - 1] < 1e-12 ? `the corner is an eigenvalue: ${num(A[n - 1][n - 1], 6)}. Deflate: continue on the top-left block.` : sh.checked ? "with the shift, the corner shrinks faster and faster" : "without a shift, the corner shrinks by a fixed ratio of eigenvalues per step"}</p>`;
  };
  el.querySelector(".la-step").onclick = () => { step(); show(); };
  el.querySelector(".la-five").onclick = () => { for (let i = 0; i < 5; i++) step(); show(); };
  el.querySelector(".la-reset").onclick = reset;
  sh.onchange = reset; inA.addEventListener("input", reset);
  reset();
}

// ---------- Hessenberg form ----------
function demoHess(el) {
  const A5 = [[-4, -2, 2, -1, -1], [-4, 1, 1, -2, 3], [-3, 3, -4, -2, 2], [-4, -3, -1, 2, 1], [-3, -2, -2, 1, 2]];
  el.innerHTML = `<div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn la-note">the 5-by-5 of the note</button> <button class="cbtn la-rand">random integer matrix</button> <button class="cbtn la-sym">random symmetric</button></div><div class="la-show"></div>`;
  let seed = 1;
  const go = (A) => {
    const H = hessenbergJS(A), n = A.length, zeros = H.reduce((s, r, i) => s + r.filter((v, j) => i - j >= 2 && Math.abs(v) < 1e-12).length, 0);
    const trA = A.reduce((s, r, i) => s + r[i], 0), trH = H.reduce((s, r, i) => s + r[i], 0);
    el.querySelector(".la-show").innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:18px"><div><p><b>A</b></p>${matHtmlF(A, 0)}</div><div><p><b>H = QᵀAQ</b> (zeros below the subdiagonal in teal)</p>${matHtmlF(H, 3, 2)}</div></div>
      <p>${zeros} zeros below the subdiagonal · trace A = ${num(trA, 4)}, trace H = ${num(trH, 4)} (similar: same eigenvalues)</p>
      <p class="la-log">${H.every((r, i) => r.every((v, j) => j - i < 2 || Math.abs(v) < 1e-9)) ? "symmetric A: H is tridiagonal" : "the diagonal of H is not the list of eigenvalues: shifted QR steps come next"}</p>`;
  };
  const rnd = () => { const g = rngN(seed++); return Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => Math.max(-4, Math.min(4, Math.round(2 * g()))))); };
  el.querySelector(".la-note").onclick = () => go(A5);
  el.querySelector(".la-rand").onclick = () => go(rnd());
  el.querySelector(".la-sym").onclick = () => { const R = rnd(); go(R.map((r, i) => r.map((v, j) => R[i][j] + R[j][i]))); };
  go(A5);
}

function rngN(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
}
const sci = (v, d = 2) => (v === Infinity ? "∞" : Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(d) : num(v, 4));

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Jacobi for [5 1; 2 4]: what is the spectral radius of the iteration matrix?", opts: ["about 0.32", "0.5", "about 1.2"], a: 0, why: "M = [0 −0.2; −0.5 0] has eigenvalues ±√0.1 ≈ ±0.316." },
  { q: "An iteration has ρ = 0.9. About how many steps reduce the error by 10⁻⁶?", opts: ["about 13", "about 131", "about 1300"], a: 1, why: "log 10⁻⁶ / log 0.9 ≈ 131." },
  { q: "Why does one QR step A → RQ keep the eigenvalues?", opts: ["R is triangular", "RQ = QᵀAQ is similar to A", "Q is symmetric"], a: 1, why: "R = QᵀA, so RQ = QᵀAQ." },
  { q: "“The diagonal of the Hessenberg form gives the eigenvalues.”", opts: ["True", "False"], a: 1, why: "The subdiagonal is not zero yet; shifted QR steps must remove it first." },
  { q: "Conjugate gradients need a matrix that is…", opts: ["sparse", "symmetric positive definite", "diagonally dominant"], a: 1, why: "The P-orthogonal directions rely on a symmetric positive definite matrix." },
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
// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  iter: (el) => demoIter(el),
  iterMini: (el) => demoIter(el, { mini: true }),
  plate: (el) => demoPlate(el),
  qr: (el) => demoQR(el),
  hess: (el) => demoHess(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
