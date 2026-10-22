// Interactive demos for LA101 Elective E6: Kronecker products, tensors and sums of subspaces.
// Every code panel is copied from notes/E6-kronecker-tensors-subspaces.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  kron: "import numpy as np\n\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[0, 1], [1, 1]])\nprint(np.kron(A, B).tolist())\nprint(np.kron(B, A).tolist())",
  rules: "Cm = np.array([[2, 0], [1, 1]])\nDm = np.array([[1, -1], [0, 2]])\nprint(np.array_equal(np.kron(A, B) @ np.kron(Cm, Dm), np.kron(A @ Cm, B @ Dm)))\nprint(np.allclose(np.linalg.inv(np.kron(A, B)), np.kron(np.linalg.inv(A), np.linalg.inv(B))),\n      np.array_equal(np.kron(A, B).T, np.kron(A.T, B.T)))",
  vec: "X = np.array([[1, 0], [2, 1]])\n\n\ndef vec(M):\n    return M.flatten(order=\"F\")\n\n\nprint((A @ X @ B).tolist(), vec(A @ X @ B).tolist())\nprint((np.kron(B.T, A) @ vec(X)).tolist(), (np.kron(A, B) @ vec(X)).tolist())",
  rowmajor: "print(X.flatten().tolist(), (np.kron(A, B.T) @ X.flatten()).tolist(), (A @ X @ B).flatten().tolist())",
  sylv: "As = np.array([[3, 1], [0, 2]])\nBs = np.array([[1, 0], [1, 1]])\nCs = np.array([[6, 7], [-1, -3]])\nI2 = np.eye(2)\nM = np.kron(I2, As) + np.kron(Bs.T, I2)\nXs = np.linalg.solve(M, vec(Cs)).reshape(2, 2, order=\"F\")\nprint(M.astype(int).tolist())\nprint((np.round(Xs, 10) + 0.0).tolist(), np.allclose(As @ Xs + Xs @ Bs, Cs))",
  kreig: "K = np.array([[2.0, -1.0], [-1.0, 2.0]])\nK2D = np.kron(K, I2) + np.kron(I2, K)\nprint(np.round(np.linalg.eigvalsh(np.kron(K, K)), 10).tolist(), np.round(np.linalg.eigvalsh(K2D), 10).tolist())\nprint((K2D + 0.0).astype(int).tolist())",
  grid: "K3 = 2 * np.eye(3) - np.eye(3, k=1) - np.eye(3, k=-1)\nL9 = np.kron(K3, np.eye(3)) + np.kron(np.eye(3), K3)\nl1 = np.linalg.eigvalsh(K3)\nprint(np.round(l1, 4).tolist())\nprint(np.round(np.linalg.eigvalsh(L9), 4).tolist())\nprint(np.round(np.sort(np.add.outer(l1, l1).ravel()), 4).tolist())",
  planes: "Vb = np.array([[1, 0], [0, 1], [1, 1]])\nWb = np.array([[1, 0], [1, 0], [0, 1]])\nVW = np.hstack([Vb, -Wb])\nprint(np.linalg.matrix_rank(np.hstack([Vb, Wb])), np.linalg.matrix_rank(VW))\n_, sv, Vt = np.linalg.svd(VW)\nnull = Vt[-1]\ncommon = Vb @ null[:2]\nprint(np.round(common / common[0], 10).tolist(), np.allclose(common, Wb @ null[2:]))",
  krank: "R1 = np.array([[1, 2], [2, 4]])\nprint(np.linalg.matrix_rank(np.kron(R1, A)), np.linalg.matrix_rank(np.kron(A, np.eye(3))))",
  tensor: "a1, b1, c1 = np.array([2, 1]), np.array([2, 0, 1]), np.array([1, 1])\na2, b2, c2 = np.array([1, 1]), np.array([1, 1, 1]), np.array([0, 1])\nT = np.einsum(\"i,j,k->ijk\", a1, b1, c1) + np.einsum(\"i,j,k->ijk\", a2, b2, c2)\nprint(T.shape, T[0, 2, 1], T[:, :, 0].tolist(), T[:, :, 1].tolist())",
  unfold: "def unfold(T, mode):\n    return np.moveaxis(T, mode, 0).reshape(T.shape[mode], -1)\n\n\nprint(unfold(T, 0).tolist())\nprint([unfold(T, m).shape for m in range(3)], [int(np.linalg.matrix_rank(unfold(T, m))) for m in range(3)])\nR1t = np.einsum(\"i,j,k->ijk\", a1, b1, c1)\nprint([int(np.linalg.matrix_rank(unfold(R1t, m))) for m in range(3)])",
  contract: "sw = np.array([1, 2])\nMuf = np.einsum(\"ufs,s->uf\", T, sw)\nprint(Muf.tolist(), (np.einsum(\"ufs,s->f\", T, sw) / 2).tolist())\nprint(np.array_equal(Muf, (sw @ unfold(T, 2)).reshape(2, 3)))",
  attn: "rngT = np.random.default_rng(0)\nQ = rngT.standard_normal((4, 5, 3))\nKt = rngT.standard_normal((4, 6, 3))\nS = np.einsum(\"bid,bjd->bij\", Q, Kt)\nprint(S.shape, np.allclose(S[2], Q[2] @ Kt[2].T), np.allclose(S, Q @ Kt.transpose(0, 2, 1)))",
  claim: "print(np.einsum(\"ij,jk\", A, B).tolist(), np.einsum(\"ij,jh\", A, B).tolist(), (A @ B).tolist())\nprint(np.einsum(\"ij,jh->ih\", A, B).tolist())",
};

const OUT = {
  kron: "[[0, 1, 0, 2], [1, 1, 2, 2], [0, 3, 0, 4], [3, 3, 4, 4]]\n[[0, 0, 1, 2], [0, 0, 3, 4], [1, 2, 1, 2], [3, 4, 3, 4]]",
  rules: "True\nTrue True",
  vec: "[[2, 7], [4, 15]] [2, 4, 7, 15]\n[2, 4, 7, 15] [4, 5, 10, 13]",
  rowmajor: "[1, 0, 2, 1] [2, 7, 4, 15] [2, 7, 4, 15]",
  sylv: "[[4, 1, 1, 0], [0, 3, 0, 1], [0, 0, 4, 1], [0, 0, 0, 3]]\n[[1.0, 2.0], [0.0, -1.0]] True",
  kreig: "[1.0, 3.0, 3.0, 9.0] [2.0, 4.0, 4.0, 6.0]\n[[4, -1, -1, 0], [-1, 4, 0, -1], [-1, 0, 4, -1], [0, -1, -1, 4]]",
  grid: "[0.5858, 2.0, 3.4142]\n[1.1716, 2.5858, 2.5858, 4.0, 4.0, 4.0, 5.4142, 5.4142, 6.8284]\n[1.1716, 2.5858, 2.5858, 4.0, 4.0, 4.0, 5.4142, 5.4142, 6.8284]",
  planes: "3 3\n[1.0, 1.0, 2.0] True",
  krank: "2 6",
  tensor: "(2, 3, 2) 3 [[4, 0, 2], [2, 0, 1]] [[5, 1, 3], [3, 1, 2]]",
  unfold: "[[4, 5, 0, 1, 2, 3], [2, 3, 0, 1, 1, 2]]\n[(2, 6), (3, 4), (2, 6)] [2, 2, 2]\n[1, 1, 1]",
  contract: "[[14, 2, 8], [8, 2, 5]] [11.0, 2.0, 6.5]\nTrue",
  attn: "(4, 5, 6) True True",
  claim: "[[2, 3], [4, 7]] [[2, 4], [3, 7]] [[2, 3], [4, 7]]\n[[2, 3], [4, 7]]",
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

// ---------- Demo: vec(AXB) = (Bᵀ ⊗ A) vec X ----------

const kron = (A, B) => A.flatMap((ra) => B.map((rb) => ra.flatMap((a) => rb.map((b) => a * b))));
const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mv = (A, x) => A.map((r) => r.reduce((s, v, k) => s + v * x[k], 0));
const tr = (A) => A[0].map((_, j) => A.map((r) => r[j]));
const vecF = (X) => X[0].flatMap((_, j) => X.map((r) => r[j]));
const vstr = (v) => `(${v.map(num).join(", ")})`;

function demoVec(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("x₁₁", -3, 3, 1, 1)}${slider("x₂₁", -3, 3, 1, 2)}${slider("x₁₂", -3, 3, 1, 0)}${slider("x₂₂", -3, 3, 1, 1)}</div><p class="la-read"></p>`;
  const A = [[1, 2], [3, 4]], B = [[0, 1], [1, 1]];
  wireSliders(el, ([a, b, c, d]) => {
    const X = [[a, c], [b, d]], P = mm(mm(A, X), B), v = vecF(X);
    const good = mv(kron(tr(B), A), v), bad = mv(kron(A, B), v), ok = vstr(bad) === vstr(vecF(P));
    el.querySelector(".la-read").innerHTML = `X = [[${a}, ${c}], [${b}, ${d}]], vec X = ${vstr(v)}. AXB = [[${P[0].map(num).join(", ")}], [${P[1].map(num).join(", ")}]], ` +
      `vec(AXB) = <b class="A">${vstr(vecF(P))}</b>. (Bᵀ ⊗ A) vec X = <b class="A">${vstr(good)}</b> ✓; ` +
      `(A ⊗ B) vec X = <b class="${ok ? "A" : "NO"}">${vstr(bad)}</b>${ok ? " (agrees only by accident here)" : " ✗"}.`;
  });
}

// ---------- Demo: eigenvalues of the grid Laplacian K ⊕ K ----------

function demoGrid(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("grid size n", 2, 8, 1, 3)}</div>`) + `<div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  const draw = ([n]) => {
    const lam = [...Array(n).keys()].map((k) => 2 - 2 * Math.cos(((k + 1) * Math.PI) / (n + 1)));
    const sums = lam.flatMap((a) => lam.map((b) => a + b)).sort((x, y) => x - y);
    const W = 300, H = 120, sx = (v) => 15 + (v / 8) * (W - 30);
    let g = `<svg class="la-plane" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><line class="axis" x1="10" y1="40" x2="${W - 10}" y2="40"/><line class="axis" x1="10" y1="95" x2="${W - 10}" y2="95"/>`;
    lam.forEach((v) => { g += `<circle class="C" cx="${sx(v).toFixed(1)}" cy="40" r="4"/>`; });
    sums.forEach((v) => { g += `<circle class="A" cx="${sx(v).toFixed(1)}" cy="95" r="3" opacity="0.7"/>`; });
    g += `<text x="12" y="28" class="vlbl C">line K (n = ${n})</text><text x="12" y="83" class="vlbl A">grid K ⊕ K (n² = ${n * n})</text>`;
    for (let t = 0; t <= 8; t += 2) g += `<text x="${sx(t) - 3}" y="${H - 5}" class="vlbl">${t}</text>`;
    el.querySelector(".fc").innerHTML = g + "</svg>";
    el.querySelector(".la-read").innerHTML = `Line eigenvalues 2 − 2cos(kπ/(n+1)): <b class="C">${lam.map(num).join(", ")}</b>. ` +
      `The ${n * n} grid eigenvalues are all pairwise sums, from <b class="A">${num(sums[0])}</b> to <b class="A">${num(sums[sums.length - 1])}</b>; the ${n * n} × ${n * n} matrix is never needed.`;
  };
  if (opts.mini) {
    let n = 2;
    const tick = () => { draw([n]); n = n >= 7 ? 2 : n + 1; };
    tick(); setInterval(tick, 2400); return;
  }
  wireSliders(el, draw);
}

// ---------- Demo: two planes through 0 in R³ ----------

function demoPlanes(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("n₁", -2, 2, 1, 1)}${slider("n₂", -2, 2, 1, -1)}${slider("n₃", -2, 2, 1, 0)}</div><p class="la-read"></p>`;
  const nV = [1, 1, -1]; // V = span{(1,0,1), (0,1,1)} has normal (1, 1, −1)
  wireSliders(el, ([a, b, c]) => {
    const r = el.querySelector(".la-read");
    if (!a && !b && !c) { r.innerHTML = `The normal must not be 0.`; return; }
    const x = [nV[1] * c - nV[2] * b, nV[2] * a - nV[0] * c, nV[0] * b - nV[1] * a];
    const same = x.every((v) => v === 0);
    r.innerHTML = `V: normal (1, 1, −1), spanned by (1, 0, 1) and (0, 1, 1). W: normal (${a}, ${b}, ${c}). ` + (same
      ? `The normals are parallel: <b class="HL">W = V</b>, so V ∩ W = V and dim(V + W) = 2 = 2 + 2 − 2.`
      : `V ∩ W is the line through <b class="C">${vstr(x)}</b> (the cross product of the normals), and V + W = ℝ³: <b class="A">3 = 2 + 2 − 1</b>.`);
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A is 2 × 3 and B is 4 × 5. A ⊗ B is", opts: ["8 × 15", "6 × 20", "2 × 5"], a: 0,
    why: "Sizes multiply: (2·4) × (3·5)." },
  { q: "A has eigenvalues 2, 5 and B has −1, 3. The eigenvalues of A ⊗ I + I ⊗ B are", opts: ["−2, 6, −5, 15", "1, 5, 4, 8", "1, 8"], a: 1,
    why: "A Kronecker sum adds: 2 − 1, 2 + 3, 5 − 1, 5 + 3." },
  { q: "vec(AXB) with column stacking equals", opts: ["(A ⊗ B) vec X", "(Bᵀ ⊗ A) vec X", "(B ⊗ Aᵀ) vec X"], a: 1,
    why: "Column j of AXB combines the columns Axₖ with the entries of column j of B, which is row j of Bᵀ." },
  { q: "Two 3-dimensional subspaces of ℝ⁵ meet in at least", opts: ["{0}", "a line", "a plane"], a: 1,
    why: "dim(V ∩ W) = 3 + 3 − dim(V + W) ≥ 6 − 5 = 1." },
  { q: "np.einsum('ij,jh', A, B) returns", opts: ["AB", "(AB)ᵀ", "BA"], a: 1,
    why: "Implicit mode orders the output labels alphabetically: 'hi', the transpose of AB." },
];

const DEMOS = {
  vec: (el) => demoVec(el),
  grid: (el) => demoGrid(el),
  gridMini: (el) => demoGrid(el, { mini: true }),
  planes: (el) => demoPlanes(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
