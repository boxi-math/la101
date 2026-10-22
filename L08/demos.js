// Interactive demos for LA101 Lecture 8: solvability, the complete solution, rank.
// Every code panel is copied from notes/L08-solving-ax-b.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  two: "import numpy as np\nfrom fractions import Fraction\n\nA = np.array([[1, 1, 3, 0],\n              [2, 3, 7, 1],\n              [1, 2, 4, 1]])\nprint((A @ np.array([1, 1, 0, 0])).tolist(), (A @ np.array([0, 2, 0, -1])).tolist())",
  aug: "def echelon(M, reduced=False):\n    \"\"\"Row-reduce a list of rows with exact fractions (Lecture 7). Return (rows, pivot columns).\"\"\"\n    M = [[Fraction(v) for v in row] for row in M]\n    m, n = len(M), len(M[0])\n    pivots, r = [], 0\n    for j in range(n):\n        below = [i for i in range(r, m) if M[i][j] != 0]\n        if not below:\n            continue\n        if below[0] != r:\n            M[r], M[below[0]] = M[below[0]], M[r]\n        if reduced:\n            M[r] = [a / M[r][j] for a in M[r]]\n        for i in range(m):\n            if i != r and M[i][j] != 0 and (reduced or i > r):\n                mult = M[i][j] / M[r][j]\n                M[i] = [a - mult * p for a, p in zip(M[i], M[r])]\n        pivots.append(j)\n        r += 1\n        if r == m:\n            break\n    return M, pivots\n\n\ndef as_text(M):\n    return [[str(v) for v in row] for row in M]\n\n\nfor b in [(2, 5, 3), (1, 1, 1)]:\n    aug = [row + [bi] for row, bi in zip(A.tolist(), b)]\n    R_aug, piv = echelon(aug, reduced=True)\n    print(b, as_text(R_aug), \"pivot in last column:\", 4 in piv)",
  predict: "for b in [(3, 4, 1), (0, 0, 5)]:\n    print(b, b[0] - b[1] + b[2])",
  complete: "xp = np.array([1, 1, 0, 0])\ns1, s2 = np.array([-2, -1, 1, 0]), np.array([1, -1, 0, 1])\nfor c, d in [(0, 0), (1, 0), (0, 1), (2, -3)]:\n    x = xp + c * s1 + d * s2\n    print((c, d), x.tolist(), (A @ x).tolist())",
  describe: "def describe(M, b):\n    \"\"\"Rank, shape, and the number of solutions of M x = b: 0, 1 or 'infinitely many'.\"\"\"\n    m, n = len(M), len(M[0])\n    r = len(echelon(M)[1])\n    aug_piv = echelon([row + [bi] for row, bi in zip(M, b)])[1]\n    if n in aug_piv:\n        count = 0\n    else:\n        count = 1 if r == n else \"infinitely many\"\n    return (m, n, r, count)\n\n\npaint = [[2, 1, 1], [4, 3, 4], [2, 4, 8]]\nlayer = [[1, 2], [0, 1], [1, 3]]\ndata = [[1, 2, 0], [1, 0, 1]]\nprint(describe(paint, [5, 15, 22]))\nprint(describe(layer, [1, 1, 2]), describe(layer, [1, 1, 1]))\nprint(describe(data, [3, 2]), describe(data, [-7, 40]))\nprint(describe(A.tolist(), [2, 5, 3]), describe(A.tolist(), [1, 1, 1]))",
  lstsq: "x_ls = np.linalg.lstsq(A, np.array([2, 5, 3]), rcond=None)[0]\nprint(np.round(x_ls, 4).tolist(), np.round(A @ x_ls, 10).tolist())\nprint(round(float(np.linalg.norm(x_ls)), 4), round(float(np.linalg.norm(xp)), 4))",
  weights: "X = np.array(data)\ny = np.array([3, 2])\ntheta_p = np.array([2, Fraction(1, 2), 0])  # exact fractions inside a numpy array (dtype object)\nprint([str(v) for v in X @ theta_p])\ntheta_ls = np.linalg.lstsq(X, y, rcond=None)[0]\nprint(np.round(theta_ls, 4).tolist(), np.round(X @ theta_ls, 10).tolist())",
  claim: "claimed_xp = np.array([1, 1, 0, 0])\nclaimed_null = [np.array([1, -1, 0, 1])]\nprint((A @ claimed_xp).tolist(), [(A @ s).tolist() for s in claimed_null])\nprint(len(claimed_null), A.shape[1] - int(np.linalg.matrix_rank(A)))",
};

const OUT = {
  two: "[2, 5, 3] [2, 5, 3]",
  aug: "(2, 5, 3) [['1', '0', '2', '-1', '1'], ['0', '1', '1', '1', '1'], ['0', '0', '0', '0', '0']] pivot in last column: False\n(1, 1, 1) [['1', '0', '2', '-1', '0'], ['0', '1', '1', '1', '0'], ['0', '0', '0', '0', '1']] pivot in last column: True",
  predict: "(3, 4, 1) 0\n(0, 0, 5) 5",
  complete: "(0, 0) [1, 1, 0, 0] [2, 5, 3]\n(1, 0) [-1, 0, 1, 0] [2, 5, 3]\n(0, 1) [2, 0, 0, 1] [2, 5, 3]\n(2, -3) [-6, 2, 2, -3] [2, 5, 3]",
  describe: "(3, 3, 3, 1)\n(3, 2, 2, 1) (3, 2, 2, 0)\n(2, 3, 2, 'infinitely many') (2, 3, 2, 'infinitely many')\n(3, 4, 2, 'infinitely many') (3, 4, 2, 0)",
  lstsq: "[0.1176, 0.2941, 0.5294, 0.1765] [2.0, 5.0, 3.0]\n0.6417 1.4142",
  weights: "['3', '2']\n[1.2222, 0.8889, 0.7778] [3.0, 2.0]",
  claim: "[2, 5, 3] [[0, 0, 0]]\n1 2",
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

// ---------- Demo: the complete solution of Ax = b ----------

function solveAll(A, b) {
  const m = A.length, n = A[0].length;
  const { R, piv, steps } = rref(A.map((r, i) => [...r, b[i]]));
  const r = piv.filter((j) => j < n).length;
  const bad = piv.includes(n);
  const Rn = R.map((row) => row.slice(0, n)), pivA = piv.filter((j) => j < n);
  let xp = null;
  if (!bad) {
    xp = Array.from({ length: n }, () => q(0));
    pivA.forEach((p, i) => { xp[p] = R[i][n]; });
  }
  const count = bad ? "no solution" : r === n ? "exactly one solution" : "infinitely many solutions";
  return { m, n, r, R, piv, steps, bad, xp, sp: specials(Rn, pivA), count };
}

function demoComplete(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>A = <input class="la-in a" style="width:17em" value="1 1 3 0; 2 3 7 1; 1 2 4 1"></label>
    <label>b = <input class="la-in b" style="width:7em" value="2 5 3"></label></div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  const draw = (A, b) => {
    const show = el.querySelector(".la-show"), log = el.querySelector(".la-log");
    if (!okMat(A) || b.length !== A.length || !b.every(Number.isInteger)) { show.innerHTML = ""; log.innerHTML = "Type whole numbers; b needs one entry per row of A."; return; }
    const s = solveAll(A, b);
    show.innerHTML = `[A | b] → ${matHTML(s.R, { aug: true, pivCols: s.piv.filter((j) => j < s.n), zCols: s.bad ? [s.n] : [] })}`;
    const shape = `m = ${s.m}, n = ${s.n}, rank r = ${s.r}: <b>${s.count}</b>.`;
    if (s.bad) { log.innerHTML = `${shape} <span class="NO">A pivot in the last column: that row says 0 = (nonzero). b is not in C(A).</span>`; return; }
    log.innerHTML = `${shape} x<sub>p</sub> = ${vecStr(s.xp)} (free variables 0); A·x<sub>p</sub> = ${vecStr(mulVec(A, s.xp))}.` +
      (s.sp.length ? ` Complete solution: x = x<sub>p</sub> + ${s.sp.map((x, i) => `${"cdefgh"[i]}·${vecStr(x)}`).join(" + ")}.` : " No free variables: x<sub>p</sub> is the only solution.");
  };
  if (opts.mini) {
    const targets = [[2, 5, 3], [1, 1, 1], [3, 4, 1], [0, 0, 5]];
    let k = 0;
    const tick = () => { draw([[1, 1, 3, 0], [2, 3, 7, 1], [1, 2, 4, 1]], targets[k % 4]); k++; };
    tick(); setInterval(tick, 2600); return;
  }
  const [ia, ib] = [el.querySelector(".a"), el.querySelector(".b")];
  const go = () => draw(parseMat(ia.value), parseVec(ib.value));
  ia.addEventListener("input", go); ib.addEventListener("input", go);
  go();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Elimination on [A | b] ends with the row (0, 0, 0 | 4). What does that mean?", opts: ["x₃ = 4", "0 = 4: no solution, b is not in C(A)", "Infinitely many solutions"], a: 1,
    why: "The left side is all zeros and the right side is 4." },
  { q: "A 2-by-5 matrix has rank 2. For how many b is Ax = b solvable?", opts: ["None", "Some", "All of them"], a: 2,
    why: "r = m: no zero rows in R, so no conditions on b." },
  { q: "If Ax = b has exactly one solution, then A is square.", opts: ["True", "False"], a: 1,
    why: "A tall matrix with r = n (the 2-to-3 layer) has exactly one solution for b = (1, 1, 2)." },
  { q: "\"The particular solution is unique, because we always set the free variables to zero.\" What is wrong?", opts: ["Nothing", "Setting the free variables to zero is a convention; any solution can serve as xₚ"], a: 1,
    why: "For the drone, (0, 2, 0, −1) is an equally good particular solution of Ax = (2, 5, 3)." },
  { q: "A 3-by-3 matrix has rank 2. Can Ax = b have exactly one solution?", opts: ["Yes", "No"], a: 1,
    why: "r < n: there is a free variable, so whenever there is a solution there are infinitely many." },
];

const DEMOS = {
  complete: (el) => demoComplete(el),
  completeMini: (el) => demoComplete(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
