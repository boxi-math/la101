// Interactive demos for LA101 Lecture 10: the four fundamental subspaces, rank one, ratings as tastes.
// Every code panel is copied from notes/L10-four-subspaces.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  setup: "import numpy as np\nfrom fractions import Fraction\n\nA = np.array([[1, 1, 3, 0],\n              [2, 3, 7, 1],\n              [1, 2, 4, 1]])\nm, n = A.shape\nr = int(np.linalg.matrix_rank(A))\nprint(m, n, r, int(np.linalg.matrix_rank(A.T)))\nprint(A.T.tolist())",
  rowspace: "def echelon(M, reduced=False):\n    \"\"\"Row-reduce a list of rows with exact fractions (Lecture 7). Return (rows, pivot columns).\"\"\"\n    M = [[Fraction(v) for v in row] for row in M]\n    m, n = len(M), len(M[0])\n    pivots, r = [], 0\n    for j in range(n):\n        below = [i for i in range(r, m) if M[i][j] != 0]\n        if not below:\n            continue\n        if below[0] != r:\n            M[r], M[below[0]] = M[below[0]], M[r]\n        if reduced:\n            M[r] = [a / M[r][j] for a in M[r]]\n        for i in range(m):\n            if i != r and M[i][j] != 0 and (reduced or i > r):\n                mult = M[i][j] / M[r][j]\n                M[i] = [a - mult * p for a, p in zip(M[i], M[r])]\n        pivots.append(j)\n        r += 1\n        if r == m:\n            break\n    return M, pivots\n\n\ndef as_text(M):\n    return [[str(v) for v in row] for row in M]\n\n\nR, piv = echelon(A.tolist(), reduced=True)\nprint(as_text(R), [j + 1 for j in piv])\nrow1, row2 = np.array(R[0], dtype=int), np.array(R[1], dtype=int)\nfor i in range(m):\n    a, b = int(A[i, 0]), int(A[i, 1])\n    print(A[i].tolist(), \"=\", a, \"* row1 +\", b, \"* row2:\", (a * row1 + b * row2).tolist() == A[i].tolist())",
  leftnull: "y = np.array([1, -1, 1])\nprint((y @ A).tolist(), (A.T @ y).tolist())",
  findE: "aug = [row + [int(i == k) for k in range(m)] for i, row in enumerate(A.tolist())]\nR_aug, _ = echelon(aug, reduced=True)\nE = [row[n:] for row in R_aug]\nprint(as_text(E))\nE_np = np.array(E, dtype=object)\nprint((E_np.dot(A) == np.array(R, dtype=object)).all(), as_text([E[2]]))",
  dims: "def four_dims(M):\n    M = np.array(M)\n    rows, cols = M.shape\n    rk = int(np.linalg.matrix_rank(M))\n    return {\"row\": rk, \"null\": cols - rk, \"col\": rk, \"left null\": rows - rk,\n            \"rank of transpose\": int(np.linalg.matrix_rank(M.T))}\n\n\nfor name, M in [(\"drone\", A), (\"robot M\", [[1, 2], [3, 6]]),\n                (\"B of L07\", [[1, 3, 1], [2, 6, 3]]), (\"paint\", [[2, 1, 1], [4, 3, 4], [2, 4, 8]])]:\n    print(name, four_dims(M))",
  rankone: "u = A[:, 0]\nfirst = np.outer(u, row1)\nprint(first.tolist(), int(np.linalg.matrix_rank(first)))",
  cr: "C = A[:, piv]\nR0 = np.array(R[:r], dtype=int)\nsecond = np.outer(A[:, 1], row2)\nprint(C.tolist(), R0.tolist())\nprint((C @ R0 == A).all(), (first + second == A).all())",
  matspaces: "conditions = {\"symmetric (b - c = 0)\": [[0, 1, -1, 0]],\n              \"upper triangular (c = 0)\": [[0, 0, 1, 0]],\n              \"diagonal (b = 0, c = 0)\": [[0, 1, 0, 0], [0, 0, 1, 0]]}\nfor name, rows in conditions.items():\n    print(name, 4 - int(np.linalg.matrix_rank(np.array(rows))))",
  notsub: "P1 = np.array([[1, 0], [0, 0]])\nP2 = np.array([[0, 0], [0, 1]])\nP3 = np.array([[2, 4], [1, 2]])\nP4 = np.array([[1, 2], [0, 0]])\nprint([int(np.linalg.matrix_rank(X)) for X in (P1, P2, P1 + P2, P3 + P4, P3 - P3)])",
  ratings: "p = np.array([2, 0, 1, 1])        # likes sweet: Ana, Ben, Caro, Dev\nq = np.array([0, 2, 1, 2])        # likes bitter\ng = np.array([1, 0, 2, 1, 2])     # sweetness: latte, espresso, mocha, tea, cocoa\nh = np.array([1, 2, 1, 0, 0])     # bitterness\nX = np.outer(p, g) + np.outer(q, h)\nprint(X.tolist())\nprint(four_dims(X))\nprint(X.size, p.size + g.size + q.size + h.size)",
  cancel: "for amounts in [(1, 1, -2, 0), (1, 2, 0, -2)]:\n    print(amounts, (np.array(amounts) @ X).tolist())\nprint((X @ np.array([0, 0, 0, 2, -1])).tolist())",
  scale: "print(1000 * 500, 10 * (1000 + 500))",
  claim: "claimed_left_null = np.array([1, -1, 1, 0])\nprint(claimed_left_null.size == m)\nclaimed_row_space = [np.array([1, 0, 2, -1]), np.array([0, 1, 1, 1])]\nprint([int(np.linalg.matrix_rank(np.vstack([A, v]))) == r for v in claimed_row_space])",
};

const OUT = {
  setup: "3 4 2 2\n[[1, 2, 1], [1, 3, 2], [3, 7, 4], [0, 1, 1]]",
  rowspace: "[['1', '0', '2', '-1'], ['0', '1', '1', '1'], ['0', '0', '0', '0']] [1, 2]\n[1, 1, 3, 0] = 1 * row1 + 1 * row2: True\n[2, 3, 7, 1] = 2 * row1 + 3 * row2: True\n[1, 2, 4, 1] = 1 * row1 + 2 * row2: True",
  leftnull: "[0, 0, 0, 0] [0, 0, 0, 0]",
  findE: "[['0', '2', '-3'], ['0', '-1', '2'], ['1', '-1', '1']]\nTrue [['1', '-1', '1']]",
  dims: "drone {'row': 2, 'null': 2, 'col': 2, 'left null': 1, 'rank of transpose': 2}\nrobot M {'row': 1, 'null': 1, 'col': 1, 'left null': 1, 'rank of transpose': 1}\nB of L07 {'row': 2, 'null': 1, 'col': 2, 'left null': 0, 'rank of transpose': 2}\npaint {'row': 3, 'null': 0, 'col': 3, 'left null': 0, 'rank of transpose': 3}",
  rankone: "[[1, 0, 2, -1], [2, 0, 4, -2], [1, 0, 2, -1]] 1",
  cr: "[[1, 1], [2, 3], [1, 2]] [[1, 0, 2, -1], [0, 1, 1, 1]]\nTrue True",
  matspaces: "symmetric (b - c = 0) 3\nupper triangular (c = 0) 3\ndiagonal (b = 0, c = 0) 2",
  notsub: "[1, 1, 2, 1, 0]",
  ratings: "[[2, 0, 4, 2, 4], [2, 4, 2, 0, 0], [2, 2, 3, 1, 2], [3, 4, 4, 1, 2]]\n{'row': 2, 'null': 3, 'col': 2, 'left null': 2, 'rank of transpose': 2}\n20 18",
  cancel: "(1, 1, -2, 0) [0, 0, 0, 0, 0]\n(1, 2, 0, -2) [0, 0, 0, 0, 0]\n[0, 0, 0, 0]",
  scale: "500000 15000",
  claim: "False\n[True, True]",
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

// ---------- Demo: the four subspaces of any matrix, with a basis of each ----------

// Left nullspace: the special solutions of A transpose.
function leftNull(A) {
  const At = A[0].map((_, j) => A.map((row) => row[j]));
  const { R, piv } = rref(At);
  return specials(R, piv);
}

const EXAMPLES = [
  ["the drone", [[1, 1, 3, 0], [2, 3, 7, 1], [1, 2, 4, 1]]],
  ["the robot M", [[1, 2], [3, 6]]],
  ["B of Lecture 7", [[1, 3, 1], [2, 6, 3]]],
  ["the café ratings X", [[2, 0, 4, 2, 4], [2, 4, 2, 0, 0], [2, 2, 3, 1, 2], [3, 4, 4, 1, 2]]],
];

function demoSubspaces(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl"><label>A = <input class="la-in m" style="width:22em" value="1 1 3 0; 2 3 7 1; 1 2 4 1"></label></div>
    <p class="hint">Whole numbers; rows separated by ';'.</p>`) + `<div class="la-eq la-show"></div><p class="la-read"></p>`;
  const draw = (A, label = "") => {
    const show = el.querySelector(".la-show"), read = el.querySelector(".la-read");
    if (!okMat(A)) { show.innerHTML = ""; read.innerHTML = "Type whole numbers, the same number in every row."; return; }
    const m = A.length, n = A[0].length;
    const { R, piv } = rref(A), r = piv.length;
    const list = (vs) => (vs.length ? vs.map(vecStr).join(", ") : "only the zero vector");
    show.innerHTML = `${label}A = ${matHTML(A, { pivCols: piv })} R = ${matHTML(R, { pivCols: piv })}`;
    read.innerHTML = `${m} × ${n}, rank ${r}.<br>` +
      `<b class="A">row space</b> C(Aᵀ), in R<sup>${n}</sup>, dimension ${r}: ${list(R.slice(0, r))}<br>` +
      `<b class="C">nullspace</b> N(A), in R<sup>${n}</sup>, dimension ${n - r}: ${list(specials(R, piv))}<br>` +
      `<b class="A">column space</b> C(A), in R<sup>${m}</sup>, dimension ${r}: ${list(piv.map((j) => A.map((row) => row[j])))}<br>` +
      `<b class="C">left nullspace</b> N(Aᵀ), in R<sup>${m}</sup>, dimension ${m - r}: ${list(leftNull(A))}`;
  };
  if (opts.mini) {
    let k = 0;
    const tick = () => { const [name, A] = EXAMPLES[k % EXAMPLES.length]; draw(A, `<b>${name}</b>&nbsp; `); k++; };
    tick(); setInterval(tick, 3200); return;
  }
  const inp = el.querySelector(".m");
  const go = () => draw(parseMat(inp.value));
  inp.addEventListener("input", go);
  go();
}

// ---------- Demo: one customer's ratings from two tastes ----------

const SWEET = [1, 0, 2, 1, 2], BITTER = [1, 2, 1, 0, 0], DRINKS = ["latte", "espresso", "mocha", "tea", "cocoa"];

function demoTastes(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("likes sweet", 0, 2, 1, 1)}${slider("likes bitter", 0, 2, 1, 1)}</div>
    <div class="la-eq la-show"></div><p class="la-read"></p>`;
  wireSliders(el, ([p, q]) => {
    const row = SWEET.map((g, j) => p * g + q * BITTER[j]);
    el.querySelector(".la-show").innerHTML = `<table class="la-mat"><tr>${DRINKS.map((d) => `<th>${d}</th>`).join("")}</tr>
      <tr>${row.map((v) => `<td class="pv">${v}</td>`).join("")}</tr></table>`;
    el.querySelector(".la-read").innerHTML = `ratings = ${p} × sweetness ${vecStr(SWEET)} + ${q} × bitterness ${vecStr(BITTER)} = ${vecStr(row)}. ` +
      `Every customer's row is a combination of the same two profiles, so it lies in a <b class="A">two-dimensional row space</b>` +
      (p === 1 && q === 1 ? ": this is Caro." : p === 2 && q === 0 ? ": this is Ana." : p === 0 && q === 2 ? ": this is Ben." : p === 1 && q === 2 ? ": this is Dev." : ".");
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Where do the four subspaces of an m × n matrix live?", opts: ["Row space and nullspace in Rⁿ; column space and left nullspace in Rᵐ", "Row space and column space in Rᵐ; both nullspaces in Rⁿ", "All four in Rᵐ"], a: 0,
    why: "Rows and recipes have n entries; columns and row amounts have m entries." },
  { q: "A 6 × 4 matrix has rank 4. Row space, nullspace, column space, left nullspace dimensions?", opts: ["4, 0, 4, 2", "4, 2, 4, 0", "6, 0, 4, 2"], a: 0,
    why: "r = 4, n − r = 0, r = 4, m − r = 6 − 4 = 2." },
  { q: "Elimination does not change the column space.", opts: ["True", "False"], a: 1,
    why: "It keeps the row space and the nullspace. The columns of R are not even in C(A) for the drone." },
  { q: "\"[[1, 2], [2, 4]] and [[0, 0], [0, 1]] have rank one, so their sum has rank one.\" What is wrong?", opts: ["Nothing", "Rank-one matrices are not closed under addition: the sum [[1, 2], [2, 5]] has rank 2"], a: 1,
    why: "The rank-one matrices are not a subspace; the zero matrix is not even among them." },
];

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  subspaces: (el) => demoSubspaces(el),
  subspacesMini: (el) => demoSubspaces(el, { mini: true }),
  tastes: (el) => demoTastes(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
