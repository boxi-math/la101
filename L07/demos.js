// Interactive demos for LA101 Lecture 7: pivots, free variables, special solutions.
// Every code panel is copied from notes/L07-solving-ax-0.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  drone4: "import numpy as np\nfrom fractions import Fraction\n\nA = np.array([[1, 1, 3, 0],\n              [2, 3, 7, 1],\n              [1, 2, 4, 1]])\nprint(A.shape, (A @ np.array([2, 1, -1, 0])).tolist())",
  echelon: "def echelon(M, reduced=False, show=False):\n    \"\"\"Row-reduce a list of rows with exact fractions. Return (rows, pivot columns).\n\n    reduced=True also scales each pivot to 1 and clears the entries above it (the form R of section 5).\n    Rows are exchanged when a pivot position holds 0 but a row below does not.\n    \"\"\"\n    M = [[Fraction(v) for v in row] for row in M]\n    m, n = len(M), len(M[0])\n    pivots, r = [], 0\n    for j in range(n):\n        below = [i for i in range(r, m) if M[i][j] != 0]\n        if not below:\n            continue  # no pivot in this column: a free column\n        if below[0] != r:\n            M[r], M[below[0]] = M[below[0]], M[r]\n        if reduced:\n            M[r] = [a / M[r][j] for a in M[r]]\n        for i in range(m):\n            # clear entries below the pivot; in reduced form also above it\n            if i == r or M[i][j] == 0 or (i < r and not reduced):\n                continue\n            mult = M[i][j] / M[r][j]\n            M[i] = [a - mult * p for a, p in zip(M[i], M[r])]\n            if show:\n                print(f\"row {i + 1} -= {mult} * row {r + 1}:\", [str(v) for v in M[i]])\n        pivots.append(j)\n        r += 1\n        if r == m:\n            break\n    return M, pivots\n\n\ndef as_text(M):\n    return [[str(v) for v in row] for row in M]\n\n\nU, piv = echelon(A.tolist(), show=True)\nprint(as_text(U), \"pivot columns:\", [j + 1 for j in piv])",
  rank: "print(len(piv), int(np.linalg.matrix_rank(A)))",
  special: "def special_solutions(rows, pivots):\n    \"\"\"One solution of (echelon rows) x = 0 per free column: that free variable 1, the other free ones 0.\"\"\"\n    n = len(rows[0])\n    free = [j for j in range(n) if j not in pivots]\n    sols = []\n    for f in free:\n        x = [Fraction(0)] * n\n        x[f] = Fraction(1)\n        for i in reversed(range(len(pivots))):\n            p = pivots[i]\n            x[p] = -sum(rows[i][k] * x[k] for k in range(p + 1, n)) / rows[i][p]\n        sols.append(x)\n    return sols\n\n\ns1, s2 = special_solutions(U, piv)\nprint([str(v) for v in s1], [str(v) for v in s2])\nprint((A @ np.array([int(v) for v in s1])).tolist(), (A @ np.array([int(v) for v in s2])).tolist())",
  combo: "c, d = 3, -2\nx = c * np.array([-2, -1, 1, 0]) + d * np.array([1, -1, 0, 1])\nprint(x.tolist(), (A @ x).tolist())",
  rref: "R, piv_R = echelon(A.tolist(), reduced=True)\nprint(as_text(R), [j + 1 for j in piv_R])",
  nmat: "F = np.array([[2, -1], [1, 1]])\nN = np.vstack([-F, np.eye(2, dtype=int)])\nprint(N.tolist())\nprint((A @ N).tolist())",
  fromR: "print([[str(v) for v in s] for s in special_solutions(R, piv_R)])",
  middle: "B = [[1, 3, 1], [2, 6, 3]]\nRB, pivB = echelon(B, reduced=True)\nprint(as_text(RB), [j + 1 for j in pivB], [[str(v) for v in s] for s in special_solutions(RB, pivB)])",
  tall: "tall = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1], [2, 0, 1]]\nprint([j + 1 for j in echelon(tall)[1]])",
  weights: "X = [[1, 2, 0], [1, 0, 1]]\nRX, pivX = echelon(X, reduced=True)\nn_X = [int(2 * v) for v in special_solutions(RX, pivX)[0]]\ntheta = np.array([1, 1, 1])\nX_np = np.array(X)\nprint(as_text(RX), n_X)\nprint((X_np @ theta).tolist(), (X_np @ (theta + np.array(n_X))).tolist())\nnew_input = np.array([1, 1, 1])\nprint(int(new_input @ theta), int(new_input @ (theta + np.array(n_X))))",
  claim: "claimed = [np.array([2, 1, 1, 0]), np.array([-1, 1, 0, 1])]\nfor s in claimed:\n    print(s.tolist(), (A @ s).tolist())\nprint(len(claimed) == A.shape[1] - int(np.linalg.matrix_rank(A)))",
};

const OUT = {
  drone4: "(3, 4) [0, 0, 0]",
  echelon: "row 2 -= 2 * row 1: ['0', '1', '1', '1']\nrow 3 -= 1 * row 1: ['0', '1', '1', '1']\nrow 3 -= 1 * row 2: ['0', '0', '0', '0']\n[['1', '1', '3', '0'], ['0', '1', '1', '1'], ['0', '0', '0', '0']] pivot columns: [1, 2]",
  rank: "2 2",
  special: "['-2', '-1', '1', '0'] ['1', '-1', '0', '1']\n[0, 0, 0] [0, 0, 0]",
  combo: "[-8, -1, 3, -2] [0, 0, 0]",
  rref: "[['1', '0', '2', '-1'], ['0', '1', '1', '1'], ['0', '0', '0', '0']] [1, 2]",
  nmat: "[[-2, 1], [-1, -1], [1, 0], [0, 1]]\n[[0, 0], [0, 0], [0, 0]]",
  fromR: "[['-2', '-1', '1', '0'], ['1', '-1', '0', '1']]",
  middle: "[['1', '3', '0'], ['0', '0', '1']] [1, 3] [['-3', '1', '0']]",
  tall: "[1, 2, 3]",
  weights: "[['1', '0', '1'], ['0', '1', '-1/2']] [-2, 1, 2]\n[3, 2] [3, 2]\n3 4",
  claim: "[2, 1, 1, 0] [6, 14, 8]\n[-1, 1, 0, 1] [0, 2, 2]\nTrue",
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

// ---------- Demo: Ax = 0 step by step: reduce to R, find pivot and free columns, read off the special solutions ----------

function demoNullspace(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>A = <input class="la-in" style="width:17em" value="1 1 3 0; 2 3 7 1; 1 2 4 1"></label></div>
    <div class="la-btns"><button class="cbtn next">Next step</button><button class="cbtn all">Show R</button><button class="cbtn reset">Start again</button></div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p><div class="la-eq la-spec"></div>`;
  const inp = el.querySelector("input");
  let A = [], res = null, k = 0;
  const show = () => {
    const s = res.steps[k], last = k === res.steps.length - 1;
    el.querySelector(".la-show").innerHTML = matHTML(s.M, { ...s, pivCols: last ? res.piv : [] });
    el.querySelector(".la-log").innerHTML = `<b>Step ${k} of ${res.steps.length - 1}.</b> ${s.msg}` + (last
      ? ` <b>R is done.</b> Rank r = ${res.piv.length}; pivot columns ${res.piv.map((j) => j + 1).join(", ") || "none"}; free columns ${[...Array(A[0].length).keys()].filter((j) => !res.piv.includes(j)).map((j) => j + 1).join(", ") || "none"}.`
      : "");
    const sp = specials(res.R, res.piv);
    el.querySelector(".la-spec").innerHTML = !last ? "" : sp.length === 0
      ? `<span>No free columns: N(A) = {0}.</span>`
      : `<span>n − r = ${A[0].length} − ${res.piv.length} = ${sp.length} special solution${sp.length > 1 ? "s" : ""}:</span> ` +
        sp.map((x, i) => `<span>s${i + 1} = ${vecStr(x)}, A·s${i + 1} = ${vecStr(mulVec(A, x))}</span>`).join(" ");
  };
  const load = () => {
    A = opts.mini ? [[1, 1, 3, 0], [2, 3, 7, 1], [1, 2, 4, 1]] : parseMat(inp.value);
    if (!okMat(A)) { el.querySelector(".la-show").innerHTML = ""; el.querySelector(".la-spec").innerHTML = ""; el.querySelector(".la-log").innerHTML = "Type whole numbers, rows separated by ';'."; res = null; return; }
    res = rref(A); k = 0; show();
  };
  load();
  if (opts.mini) { setInterval(() => { k = (k + 1) % res.steps.length; show(); }, 1800); return; }
  el.querySelector(".next").onclick = () => { if (res && k < res.steps.length - 1) { k++; show(); } };
  el.querySelector(".all").onclick = () => { if (res) { k = res.steps.length - 1; show(); } };
  el.querySelector(".reset").onclick = load;
  inp.addEventListener("input", load);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A 4-by-6 matrix has rank 3. How many special solutions does Ax = 0 have?", opts: ["1", "3", "4", "6"], a: 1,
    why: "n − r = 6 − 3 = 3." },
  { q: "In a special solution, what are the free entries?", opts: ["All 0", "All 1", "One free entry is 1, the others are 0"], a: 2,
    why: "Each special solution sets one free variable to 1 and the other free variables to 0." },
  { q: "If R has a zero row, then Ax = 0 has a nonzero solution.", opts: ["True", "False"], a: 1,
    why: "A zero row means r < m; the nullspace depends on r < n. A tall 5-by-3 matrix of rank 3 has zero rows and N = {0}." },
  { q: "\"Column 3 of R is (2, 1, 0), so the special solution is (2, 1, 1, 0).\" What is wrong?", opts: ["Nothing", "The pivot entries must be the negatives: (−2, −1, 1, 0)", "The free entry should be 0"], a: 1,
    why: "A·(2, 1, 1, 0) = (6, 14, 8), but A·(−2, −1, 1, 0) = (0, 0, 0)." },
  { q: "A matrix has more columns than rows. Its nullspace…", opts: ["is always {0}", "always contains a nonzero vector", "depends on the entries"], a: 1,
    why: "At most m pivots, so n − r ≥ n − m > 0: at least one free variable." },
];

const DEMOS = {
  nullspace: (el) => demoNullspace(el),
  nullspaceMini: (el) => demoNullspace(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
