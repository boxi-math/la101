// Interactive demos for LA101 Lecture 22: symmetric and positive definite matrices.
// Every code panel is copied from notes/L22-symmetric-positive-definite.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  cov: "import numpy as np\n\ntemp = np.array([14, 16, 17, 18, 20])\niced = np.array([3, 5, 5, 7, 5])\nX = np.column_stack([temp - temp.mean(), iced - iced.mean()])\nC = X.T @ X / 4\nprint(C.tolist(), np.allclose(C, np.cov(temp, iced)))\nfor lam, x in [(6, np.array([2, 1])), (1, np.array([1, -2]))]:\n    print(lam, (C @ x).tolist(), (lam * x).tolist())\nprint(np.array([2, 1]) @ np.array([1, -2]), round(float(np.array([1, 1]) @ np.array([1, -2]) / np.sqrt(2 * 5)), 4))",
  spectral: "q1 = np.array([2, 1]) / np.sqrt(5)\nq2 = np.array([1, -2]) / np.sqrt(5)\nQ = np.column_stack([q1, q2])\nP1, P2 = np.outer(q1, q1), np.outer(q2, q2)\nprint(np.allclose(Q.T @ Q, np.eye(2)), np.allclose(Q @ np.diag([6, 1]) @ Q.T, C))\nprint(np.round(6 * P1, 4).tolist(), np.round(1 * P2, 4).tolist(), np.allclose(6 * P1 + P2, C))",
  s3: "S3 = np.array([[2, 1, 1], [1, 2, 1], [1, 1, 2]])\nw, V = np.linalg.eigh(S3)\nprint((np.round(w, 10) + 0.0).tolist(), np.allclose(V.T @ V, np.eye(3)), np.allclose(V @ np.diag(w) @ V.T, S3))\nfor x in [(1, 1, 1), (1, -1, 0), (1, 1, -2)]:\n    print(x, (S3 @ np.array(x)).tolist())\nprint(np.array([1, -1, 0]) @ np.array([1, 1, -2]))",
  house: "def householder(x):\n    \"\"\"Reflection H (symmetric, orthogonal) with H x = (|x|, 0, ..., 0).\"\"\"\n    x = np.asarray(x, dtype=float)\n    v = x.copy()\n    v[0] -= np.linalg.norm(x)\n    return np.eye(len(x)) - 2 * np.outer(v, v) / (v @ v)\n\n\nH = householder([3, 4])\nprint(np.round(H, 10).tolist(), (np.round(H @ [3, 4], 10) + 0.0).tolist())\nprint(np.allclose(H, H.T), np.allclose(H @ H, np.eye(2)), sorted(np.round(np.linalg.eigvalsh(H), 10).tolist()))",
  qr: "A = np.array([[2, 5], [1, 0], [2, -2]], dtype=float)\nH1 = householder(A[:, 0])\nB = H1 @ A\nG = np.eye(3)\nG[1:, 1:] = [[0.6, 0.8], [-0.8, 0.6]]\nR = G @ B\nQf = (G @ H1).T\nprint((np.round(B, 10) + 0.0).tolist())\nprint((np.round(R, 10) + 0.0).tolist(), np.allclose(Qf @ R, A), np.allclose(Qf.T @ Qf, np.eye(3)))",
  gs: "def gram_schmidt(A):\n    \"\"\"Classical Gram-Schmidt, as in Lecture 15.\"\"\"\n    Q = np.zeros(A.shape)\n    for j in range(A.shape[1]):\n        v = A[:, j].copy()\n        for i in range(j):\n            v -= (Q[:, i] @ A[:, j]) * Q[:, i]\n        Q[:, j] = v / np.linalg.norm(v)\n    return Q\n\n\neps = 1e-8\nLeps = np.array([[1, 1, 1], [eps, 0, 0], [0, eps, 0], [0, 0, eps]])\nQgs = gram_schmidt(Leps)\nQh = np.linalg.qr(Leps).Q\nprint(round(float(Qgs[:, 1] @ Qgs[:, 2]), 4), np.allclose(Qgs.T @ Qgs, np.eye(3)))\nprint(abs(float(Qh[:, 1] @ Qh[:, 2])) < 1e-12, np.allclose(Qh.T @ Qh, np.eye(3)))",
  npqr: "Qn, Rn = np.linalg.qr(A)\nprint((np.round(Rn, 10) + 0.0).tolist(), np.allclose(np.abs(Rn), R[:2]), np.allclose(Qn @ Rn, A))",
  pivots: "from fractions import Fraction as Fr\n\nCf = [[Fr(5), Fr(2)], [Fr(2), Fr(2)]]\nell = Cf[1][0] / Cf[0][0]\npivots = [Cf[0][0], Cf[1][1] - ell * Cf[0][1]]\nprint([str(p) for p in pivots], str(ell), [5, round(float(np.linalg.det(C)), 10)])\nenergy = lambda S, x: float(np.asarray(x) @ S @ np.asarray(x))\nx, y = 3.0, -7.0\nprint(energy(C, [x, y]), 5 * (x + 0.4 * y) ** 2 + 1.2 * y ** 2)\nAq = np.array([[1, 0], [2, 1], [0, 1]])\nprint((Aq.T @ Aq).tolist(), int(np.linalg.matrix_rank(Aq)))",
  indef: "M = np.array([[1, 3], [3, 1]])\nK = np.array([[2, -1], [-1, 2]])\nprint(round(float(np.linalg.det(M)), 10), np.linalg.eigvalsh(M).tolist(), energy(M, [1, -1]))\nprint(np.linalg.eigvalsh(K).tolist(), [2, round(float(np.linalg.det(K)), 10)])",
  semi: "P = np.array([[2, 4], [4, 8]])\nprint((np.round(np.linalg.eigvalsh(P), 10) + 0.0).tolist(), round(float(np.linalg.det(P)), 10), energy(P, [2, -1]))",
  sources: "w_ = np.array([1, -2])\nprint(energy(C, w_), round(float(np.var(X @ w_, ddof=1)), 10))\nEmb = np.array([[1, 0], [1, 1], [0, 2]])\nGram = Emb @ Emb.T\nprint(Gram.tolist(), (np.round(np.linalg.eigvalsh(Gram), 4) + 0.0).tolist())\npts = np.array([0.0, 1.0, 3.0])\nKern = np.exp(-((pts[:, None] - pts[None, :]) ** 2) / 2)\nprint(np.round(Kern, 4).tolist(), np.round(np.linalg.eigvalsh(Kern), 4).tolist())",
  chol: "Lc = np.linalg.cholesky(C)\nprint(np.round(Lc, 4).tolist(), np.allclose(Lc @ Lc.T, C))\ntry:\n    np.linalg.cholesky(M.astype(float))\n    print(\"M: Cholesky succeeded\")\nexcept np.linalg.LinAlgError:\n    print(\"M: not positive definite\")\nprint(np.round(np.linalg.eigvalsh(P + 1e-6 * np.eye(2)), 6).tolist(), np.linalg.cholesky(P + 1e-6 * np.eye(2)).shape)",
  claim: "cl = np.column_stack([np.array([1, 1, 1]) / np.sqrt(3), np.array([1, -1, 0]) / np.sqrt(2),\n                      np.array([0, 1, -1]) / np.sqrt(2)])\nprint(all(np.allclose(S3 @ cl[:, i], lam * cl[:, i]) for i, lam in enumerate([4, 1, 1])))\nprint((np.round(cl.T @ cl, 4) + 0.0).tolist())",
};

const OUT = {
  cov: "[[5.0, 2.0], [2.0, 2.0]] True\n6 [12.0, 6.0] [12, 6]\n1 [1.0, -2.0] [1, -2]\n0 -0.3162",
  spectral: "True True\n[[4.8, 2.4], [2.4, 1.2]] [[0.2, -0.4], [-0.4, 0.8]] True",
  s3: "[1.0, 1.0, 4.0] True True\n(1, 1, 1) [4, 4, 4]\n(1, -1, 0) [1, -1, 0]\n(1, 1, -2) [1, 1, -2]\n0",
  house: "[[0.6, 0.8], [0.8, -0.6]] [5.0, 0.0]\nTrue True [-1.0, 1.0]",
  qr: "[[3.0, 2.0], [0.0, 3.0], [0.0, 4.0]]\n[[3.0, 2.0], [0.0, 5.0], [0.0, 0.0]] True True",
  gs: "0.5 False\nTrue True",
  npqr: "[[-3.0, -2.0], [0.0, 5.0]] True True",
  pivots: "['5', '6/5'] 2/5 [5, 6.0]\n59.0 59.0\n[[5, 2], [2, 2]] 2",
  indef: "-8.0 [-2.0, 4.0] -4.0\n[1.0, 3.0] [2, 3.0]",
  semi: "[0.0, 10.0] 0.0 0.0",
  sources: "5.0 5.0\n[[1, 1, 0], [1, 2, 2], [0, 2, 4]] [0.0, 1.6972, 5.3028]\n[[1.0, 0.6065, 0.0111], [0.6065, 1.0, 0.1353], [0.0111, 0.1353, 1.0]] [0.3808, 0.9953, 1.6239]",
  chol: "[[2.2361, 0.0], [0.8944, 1.0954]] True\nM: not positive definite\n[1e-06, 10.000001] (2, 2)",
  claim: "True\n[[1.0, 0.0, 0.0], [0.0, 1.0, -0.5], [0.0, -0.5, 1.0]]",
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

// ---------- exact fractions, matrices and row reduction (shared by the demos of this lecture) ----------

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
  neg() { return new Q(-this.n, this.d); }
  get zero() { return this.n === 0; }
  toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
}
const q = (v) => (v instanceof Q ? v : new Q(v));
const minusTimes = (l) => (l.n < 0 ? `+ ${l.neg()}` : `− ${l}`);
const parseMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const parseVec = (s) => s.trim().split(/[\s,]+/).filter(Boolean).map(Number);
const okMat = (M) => M.length > 0 && M[0].length > 0 && M.every((r) => r.length === M[0].length && r.every(Number.isInteger));
const mulVec = (A, x) => A.map((r) => r.reduce((s, v, k) => s.add(q(v).mul(q(x[k]))), q(0)));
const vecStr = (v) => `(${v.map((x) => String(x).replace("-", "−")).join(", ")})`;

// Row-reduce with exact fractions. reduced: also clear above each pivot and divide by it. Records every step.
function rref(M0, reduced = true) {
  const R = M0.map((r) => r.map(q));
  const m = R.length, n = R[0].length, piv = [], steps = [];
  const snap = (msg, o = {}) => steps.push({ M: R.map((r) => r.slice()), msg, ...o });
  snap("Start.");
  let r = 0;
  for (let j = 0; j < n && r < m; j++) {
    const k = R.findIndex((row, i) => i >= r && !row[j].zero);
    if (k < 0) { snap(`Column ${j + 1} has no pivot: <b>free column</b>.`, { zCols: [j] }); continue; }
    if (k !== r) { [R[r], R[k]] = [R[k], R[r]]; snap(`Exchange rows ${r + 1} and ${k + 1}.`, { hlRows: [r, k] }); }
    for (let i = 0; i < m; i++) {
      if (i === r || R[i][j].zero || (i < r && !reduced)) continue;
      const l = R[i][j].div(R[r][j]);
      R[i] = R[i].map((v, c) => v.sub(l.mul(R[r][c])));
      snap(`Row ${i + 1} ${minusTimes(l)} × row ${r + 1}.`, { hlRows: [i], hlCells: [[r, j]] });
    }
    if (reduced && !(R[r][j].n === 1 && R[r][j].d === 1)) {
      const p = R[r][j];
      R[r] = R[r].map((v) => v.div(p));
      snap(`Divide row ${r + 1} by ${p}.`, { hlRows: [r], hlCells: [[r, j]] });
    }
    piv.push(j);
    r++;
  }
  return { R, piv, steps };
}

// Special solutions from a reduced R: one per free column, that free variable 1, the other free ones 0.
function specials(R, piv) {
  const n = R[0].length, free = [...Array(n).keys()].filter((j) => !piv.includes(j));
  return free.map((f) => {
    const x = Array.from({ length: n }, () => q(0));
    x[f] = q(1);
    piv.forEach((p, i) => { x[p] = R[i][f].neg(); });
    return x;
  });
}

// A matrix as a small bracketed table. hlRows: rows tinted; hlCells: [[i, j]] in bold; zCols: columns in red; aug: a
// dashed bar before the last column; pivCols: columns in bold teal.
function matHTML(M, { hlRows = [], hlCells = [], zCols = [], pivCols = [], aug = false } = {}) {
  const has = (list, i, j) => list.some(([a, b]) => a === i && b === j);
  return `<table class="la-mat">${M.map((r, i) => `<tr class="${hlRows.includes(i) ? "hl" : ""}">${r.map((v, j) => {
    const cls = [has(hlCells, i, j) || pivCols.includes(j) ? "pv" : "", zCols.includes(j) ? "z" : "", aug && j === r.length - 1 ? "bar" : ""].join(" ");
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
font:15px var(--mono)}.la-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.la-log{font-size:14px;margin:8px 0 0;min-height:2.6em}
.la-svgrow{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}.la-svgrow figure{margin:0;text-align:center;font-size:13px}`;
  document.head.appendChild(s);
})();

// ---------- Self-check quiz (from "Check your understanding") ----------

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

// ---------- 2 × 2 symmetric matrices: eigenvalues, eigenvectors, a plane to draw on ----------

const r3 = (v) => { const x = Math.round(v * 1000) / 1000; return Object.is(x, -0) ? 0 : x; };
const num = (v) => String(r3(v)).replace("-", "−");

// S = [[a, b], [b, c]]: eigenvalues l1 >= l2 and unit eigenvectors q1, q2 (perpendicular).
function eigSym(a, b, c) {
  const m = (a + c) / 2, d = Math.hypot((a - c) / 2, b);
  const l1 = m + d, l2 = m - d;
  let q1 = Math.abs(b) > 1e-12 ? [b, l1 - a] : a >= c ? [1, 0] : [0, 1];
  const n = Math.hypot(q1[0], q1[1]);
  q1 = [q1[0] / n, q1[1] / n];
  if (q1[0] < 0 || (q1[0] === 0 && q1[1] < 0)) q1 = [-q1[0], -q1[1]];
  return { l1, l2, q1, q2: [q1[1], -q1[0]] };
}

function plane(R, W = 260) {
  const s = W / (2 * R), X = (x) => W / 2 + x * s, Y = (y) => W / 2 - y * s;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img">`;
  for (let k = -R; k <= R; k++) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${W}"/><line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${W}"/>`;
  const path = (pts, cls, extra = "") => `<polyline points="${pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" class="${cls}" style="fill:none" stroke-width="2" ${extra}/>`;
  const vec = (v, cls, lbl) => `<line class="vec ${cls}" x1="${X(0)}" y1="${Y(0)}" x2="${X(v[0])}" y2="${Y(v[1])}"/>` +
    (lbl ? `<text class="vlbl ${cls}" x="${X(v[0]) + 5}" y="${Y(v[1]) - 5}">${lbl}</text>` : "");
  const line = (d, cls) => `<line class="${cls}" x1="${X(-R * 1.5 * d[0])}" y1="${Y(-R * 1.5 * d[1])}" x2="${X(R * 1.5 * d[0])}" y2="${Y(R * 1.5 * d[1])}" stroke-dasharray="4 4" stroke-width="1"/>`;
  return { open: g, close: "</svg>", path, vec, line, clip: (pts) => pts.filter(([x, y]) => Math.abs(x) <= R * 1.2 && Math.abs(y) <= R * 1.2) };
}

// ---------- Demo: a symmetric matrix, its perpendicular eigenvectors and the five tests ----------

function demoSpectral(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("a", -5, 6, 0.5, 5)}${slider("b", -4, 4, 0.5, 2)}${slider("c", -5, 6, 0.5, 2)}</div>`) +
    `<div class="la-svgrow"><figure class="fs"></figure></div><p class="la-read"></p>`;
  const draw = ([a, b, c]) => {
    const { l1, l2, q1, q2 } = eigSym(a, b, c);
    const P = plane(7);
    const img = [];
    for (let k = 0; k <= 96; k++) { const t = (2 * Math.PI * k) / 96, x = Math.cos(t), y = Math.sin(t); img.push([a * x + b * y, b * x + c * y]); }
    const circ = [];
    for (let k = 0; k <= 96; k++) { const t = (2 * Math.PI * k) / 96; circ.push([Math.cos(t), Math.sin(t)]); }
    let g = P.open + P.line(q1, "A") + P.line(q2, "C") + P.path(circ, "NO", 'stroke-opacity="0.5"') + P.path(P.clip(img), "HL");
    g += P.vec([l1 * q1[0], l1 * q1[1]], "A", "λ₁q₁") + P.vec([l2 * q2[0], l2 * q2[1]], "C", "λ₂q₂") + P.close;
    el.querySelector(".fs").innerHTML = g + `<figcaption>S = [[${num(a)}, ${num(b)}], [${num(b)}, ${num(c)}]]: the unit circle (grey) goes to the gold curve</figcaption>`;
    const det = a * c - b * b;
    const verdict = l2 > 1e-9 ? `<b class="A">positive definite</b>: every test passes`
      : l2 > -1e-9 && l1 > 1e-9 ? `<b class="HL">positive semidefinite</b>: λ₂ = 0, the energy is zero along q₂`
      : l1 > 1e-9 ? `<b class="NO">indefinite</b>: one positive and one negative eigenvalue (a saddle)`
      : `<b class="NO">not positive</b>: no positive eigenvalue`;
    const piv = Math.abs(a) > 1e-12 ? `pivots ${num(a)}, ${num(det / a)}` : `first pivot 0 (a row exchange is needed)`;
    el.querySelector(".la-read").innerHTML =
      `λ₁ = <b class="A">${num(l1)}</b> along q₁ = (${num(q1[0])}, ${num(q1[1])}); λ₂ = <b class="C">${num(l2)}</b> along q₂ = (${num(q2[0])}, ${num(q2[1])}); ` +
      `q₁·q₂ = 0 for every symmetric S. ${piv}; upper-left determinants ${num(a)}, ${num(det)}. ${verdict}.`;
  };
  if (opts.mini) {
    const sets = [[5, 2, 2], [1, 3, 1], [2, -1, 2], [2, 4, 8]];
    let k = 0;
    const tick = () => { draw(sets[k % sets.length]); k++; };
    tick(); setInterval(tick, 2600); return;
  }
  wireSliders(el, draw);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A symmetric 2 × 2 matrix has eigenvector (1, 2) for λ = 3. The other eigenvector is a multiple of", opts: ["(2, 1)", "(2, −1)", "(1, −2)"], a: 1,
    why: "It must be perpendicular to (1, 2): (2, −1)·(1, 2) = 0." },
  { q: "Is [[4, 5], [5, 6]] positive definite?", opts: ["Yes, all entries are positive", "No"], a: 1,
    why: "D₁ = 4 > 0 but D₂ = 24 − 25 = −1 < 0: one eigenvalue is negative." },
  { q: "Why is a Householder reflection its own inverse?", opts: ["Reflecting twice gives back every vector", "Its determinant is 1"], a: 0,
    why: "H² = I: H is symmetric and orthogonal. Its determinant is −1." },
  { q: "The energy xᵀSx of S = AᵀA is", opts: ["‖Ax‖²", "‖x‖²", "can be negative"], a: 0,
    why: "xᵀAᵀAx = (Ax)·(Ax) ≥ 0, and > 0 for x ≠ 0 when the columns of A are independent." },
  { q: "A covariance matrix is always", opts: ["positive definite", "positive semidefinite", "diagonal"], a: 1,
    why: "wᵀCw is a variance, never negative; it is 0 when some combination of the features is constant." },
];

const DEMOS = {
  spectral: (el) => demoSpectral(el),
  spectralMini: (el) => demoSpectral(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
