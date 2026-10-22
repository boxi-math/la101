// Interactive demos for LA101 Lecture 4. A = LU: building L, forward/back solves, the cost of factoring.
// Every code panel is copied from notes/L04-lu.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  undo: "import numpy as np\n\nA = np.array([[2, 1, 1], [4, 3, 4], [2, 4, 8]])\nE21 = np.array([[1, 0, 0], [-2, 1, 0], [0, 0, 1]])\nE31 = np.array([[1, 0, 0], [0, 1, 0], [-1, 0, 1]])\nE32 = np.array([[1, 0, 0], [0, 1, 0], [0, -3, 1]])\nE21inv = np.array([[1, 0, 0], [2, 1, 0], [0, 0, 1]])\nprint((E21inv @ E21).tolist())",
  elim: "E31inv = np.array([[1, 0, 0], [0, 1, 0], [1, 0, 1]])\nE32inv = np.array([[1, 0, 0], [0, 1, 0], [0, 3, 1]])\nL = E21inv @ E31inv @ E32inv\nE = E32 @ E31 @ E21\nU = E @ A\nprint(L.tolist())\nprint(E.tolist())\nprint((L @ U).tolist())",
  lu: "from fractions import Fraction\n\n\ndef lu(M):\n    \"\"\"A = LU without row exchanges. Returns L, U (lists of Fractions) and the number of multiply-subtract steps.\"\"\"\n    n = len(M)\n    U = [[Fraction(v) for v in row] for row in M]\n    L = [[Fraction(int(i == j)) for j in range(n)] for i in range(n)]\n    ops = 0\n    for k in range(n):\n        if U[k][k] == 0:\n            raise ZeroDivisionError(f\"zero pivot in row {k + 1}: a row exchange is needed\")\n        for i in range(k + 1, n):\n            L[i][k] = U[i][k] / U[k][k]\n            for j in range(k, n):\n                U[i][j] -= L[i][k] * U[k][j]\n                if j > k:\n                    ops += 1\n    return L, U, ops\n\n\ndef show(M):\n    return [[str(v) for v in row] for row in M]\n\n\nL_f, U_f, ops3 = lu(A.tolist())\nprint(show(L_f))\nprint(show(U_f))",
  pitfall: "L_wrong = np.array([[1, 0, 0], [-2, 1, 0], [-1, -3, 1]])\nprint((L_wrong @ U).tolist(), bool(np.array_equal(L_wrong @ U, A)))",
  ldu: "D = np.diag([2, 1, 1])\nU1 = np.array([[1, Fraction(1, 2), Fraction(1, 2)], [0, 1, 2], [0, 0, 1]], dtype=object)\nprint((np.array(L, dtype=object) @ D @ U1).tolist() == A.tolist())",
  solve: "def forward(L, b):\n    c = []\n    for i in range(len(b)):\n        c.append(Fraction(b[i]) - sum(L[i][k] * c[k] for k in range(i)))\n    return c\n\n\ndef back(U, c):\n    n = len(c)\n    x = [Fraction(0)] * n\n    for i in reversed(range(n)):\n        x[i] = (c[i] - sum(U[i][k] * x[k] for k in range(i + 1, n))) / U[i][i]\n    return x\n\n\nc = forward(L_f, [5, 15, 22])\nx = back(U_f, c)\nprint([str(v) for v in c], [str(v) for v in x])",
  reuse: "print([str(v) for v in back(U_f, forward(L_f, [4, 11, 14]))])",
  count: "def factor_steps(n):\n    return (n - 1) * n * (2 * n - 1) // 6\n\n\ndef solve_steps(n):\n    return n * (n - 1)  # forward n(n-1)/2, back n(n-1)/2 (plus n divisions)\n\n\nrng = np.random.default_rng(4)\nfor n in [3, 10, 40]:\n    M = (rng.integers(1, 9, size=(n, n)) + 10 * n * np.eye(n, dtype=int)).tolist()\n    print(n, lu(M)[2], factor_steps(n), solve_steps(n))",
  factory: "n, days_orders = 100, 1000\nredo_each_time = days_orders * (factor_steps(n) + solve_steps(n))\nfactor_once = factor_steps(n) + days_orders * solve_steps(n)\nprint(factor_steps(n), solve_steps(n))\nprint(redo_each_time, factor_once, round(redo_each_time / factor_once, 1))",
  many: "Bs = np.array([[5, 4], [15, 11], [22, 14]])\nprint(np.round(np.linalg.solve(A, Bs), 10).tolist())",
  smooth: "n6 = 6\nT = 3 * np.eye(n6, dtype=int) - np.eye(n6, k=1, dtype=int) - np.eye(n6, k=-1, dtype=int)\nT[0, 0] = T[-1, -1] = 2\ny = np.array([4, 7, 3, 8, 5, 9])\nprint(T.tolist())\nprint(np.round(np.linalg.solve(T, y), 3).tolist())",
  band: "L_T, U_T, ops_T = lu(T.tolist())\nprint([[round(float(v), 3) for v in row] for row in L_T])\nprint([[round(float(v), 3) for v in row] for row in U_T])",
  visits: "big = 3 * np.eye(200, dtype=int) - np.eye(200, k=1, dtype=int) - np.eye(200, k=-1, dtype=int)\n_, _, steps_full_loop = lu(big.tolist())\nnonzero_updates = sum(1 for k in range(199) for j in range(k + 1, 200) if big[k, j] != 0)\nprint(steps_full_loop, factor_steps(200), nonzero_updates)",
  zero: "B = np.array([[1, 2, 1], [2, 4, 5], [3, 7, 2]])\ntry:\n    lu(B.tolist())\nexcept ZeroDivisionError as error:\n    print(\"ZeroDivisionError:\", error)",
  plu: "P = np.array([[1, 0, 0], [0, 0, 1], [0, 1, 0]])\nL_B, U_B, _ = lu((P @ B).tolist())\nprint((P @ B).tolist())\nprint(show(L_B), show(U_B))\nprint((np.array(L_B, dtype=object) @ np.array(U_B, dtype=object)).tolist() == (P @ B).tolist())",
  claim: "claimed_U = np.array([[2, 1, 1], [0, 1, 2], [0, 3, 7]])\nprint((L @ claimed_U).tolist(), bool(np.array_equal(L @ claimed_U, A)))\nprint((L @ claimed_U - A).tolist())",
};

const OUT = {
  undo: "[[1, 0, 0], [0, 1, 0], [0, 0, 1]]",
  elim: "[[1, 0, 0], [2, 1, 0], [1, 3, 1]]\n[[1, 0, 0], [-2, 1, 0], [5, -3, 1]]\n[[2, 1, 1], [4, 3, 4], [2, 4, 8]]",
  lu: "[['1', '0', '0'], ['2', '1', '0'], ['1', '3', '1']]\n[['2', '1', '1'], ['0', '1', '2'], ['0', '0', '1']]",
  pitfall: "[[2, 1, 1], [-4, -1, 0], [-2, -4, -6]] False",
  ldu: "True",
  solve: "['5', '5', '2'] ['1', '1', '2']",
  reuse: "['1', '1', '1']",
  count: "3 5 5 6\n10 285 285 90\n40 20540 20540 1560",
  factory: "328350 9900\n338250000 10228350 33.1",
  many: "[[1.0, 1.0], [1.0, 1.0], [2.0, 1.0]]",
  smooth: "[[2, -1, 0, 0, 0, 0], [-1, 3, -1, 0, 0, 0], [0, -1, 3, -1, 0, 0], [0, 0, -1, 3, -1, 0], [0, 0, 0, -1, 3, -1], [0, 0, 0, 0, -1, 2]]\n[4.806, 5.611, 5.028, 6.472, 6.389, 7.694]",
  band: "[[1.0, 0.0, 0.0, 0.0, 0.0, 0.0], [-0.5, 1.0, 0.0, 0.0, 0.0, 0.0], [0.0, -0.4, 1.0, 0.0, 0.0, 0.0], [0.0, 0.0, -0.385, 1.0, 0.0, 0.0], [0.0, 0.0, 0.0, -0.382, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0, -0.382, 1.0]]\n[[2.0, -1.0, 0.0, 0.0, 0.0, 0.0], [0.0, 2.5, -1.0, 0.0, 0.0, 0.0], [0.0, 0.0, 2.6, -1.0, 0.0, 0.0], [0.0, 0.0, 0.0, 2.615, -1.0, 0.0], [0.0, 0.0, 0.0, 0.0, 2.618, -1.0], [0.0, 0.0, 0.0, 0.0, 0.0, 1.618]]",
  visits: "2646700 2646700 199",
  zero: "ZeroDivisionError: zero pivot in row 2: a row exchange is needed",
  plu: "[[1, 2, 1], [3, 7, 2], [2, 4, 5]]\n[['1', '0', '0'], ['3', '1', '0'], ['2', '0', '1']] [['1', '2', '1'], ['0', '1', '-1'], ['0', '0', '3']]\nTrue",
  claim: "[[2, 1, 1], [4, 3, 4], [2, 7, 14]] False\n[[0, 0, 0], [0, 0, 0], [0, 3, 6]]",
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

// ---------- Demo: build L while eliminating ----------

function luSteps(M0) {
  const n = M0.length;
  const U = toQ(M0), L = eye(n);
  const steps = [];
  const snap = (msg, o = {}) => steps.push({ L: L.map((r) => r.slice()), U: U.map((r) => r.slice()), msg, ...o });
  snap("Start: U = A, L = I. Watch the multipliers drop into L.");
  for (let k = 0; k < n; k++) {
    if (U[k][k].zero) {
      const r = U.findIndex((row, i) => i > k && !row[k].zero);
      snap(`<b class="NO">Zero in pivot position ${k + 1}: plain LU stops.</b> ` +
        (r < 0 ? "No row below can help: A is not invertible." : `Exchange rows ${k + 1} and ${r + 1} of A first (a permutation P), then factor PA = LU.`),
        { zU: [[k, k]] });
      return steps;
    }
    for (let i = k + 1; i < n; i++) {
      if (U[i][k].zero) continue;
      const l = U[i][k].div(U[k][k]);
      L[i][k] = l;
      U[i] = U[i].map((v, c) => v.sub(l.mul(U[k][c])));
      snap(`Row ${i + 1} ${minusTimes(l)} × row ${k + 1} in U; the multiplier <b>${sgn(l)}</b> goes into L at (${i + 1}, ${k + 1}).`,
        { hlL: [[i, k]], hlU: [i] });
    }
  }
  snap(`<b>Done: A = LU.</b> Pivots ${U.map((r, i) => sgn(r[i])).join(", ")}. Multiply back: LU = A is ${same(mmul(L, U), M0) ? "true" : "false"}.`);
  return steps;
}

function demoLU(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>A = <input class="la-in" style="width:15em" value="2 1 1; 4 3 4; 2 4 8"></label></div>
    <div class="la-btns"><button class="cbtn next">Next step</button><button class="cbtn reset">Start again</button></div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  const inp = el.querySelector("input");
  let steps = [], k = 0;
  const show = () => {
    const s = steps[k];
    el.querySelector(".la-show").innerHTML = `L = ${matHTML(s.L, { hlCells: s.hlL || [] })} U = ${matHTML(s.U, { hlRows: s.hlU || [], zCells: s.zU || [] })}`;
    el.querySelector(".la-log").innerHTML = `<b>Step ${k} of ${steps.length - 1}.</b> ${s.msg}`;
  };
  const load = () => {
    const M = opts.mini ? [[2, 1, 1], [4, 3, 4], [2, 4, 8]] : parseMat(inp.value);
    if (!okMat(M) || M.length !== M[0].length) { el.querySelector(".la-show").innerHTML = ""; el.querySelector(".la-log").innerHTML = "Type a square matrix of whole numbers, rows separated by ';'."; steps = []; return; }
    steps = luSteps(M); k = 0; show();
  };
  load();
  if (opts.mini) { setInterval(() => { k = (k + 1) % steps.length; show(); }, 2200); return; }
  el.querySelector(".next").onclick = () => { if (steps.length && k < steps.length - 1) { k++; show(); } };
  el.querySelector(".reset").onclick = load;
  inp.addEventListener("input", load);
}

// ---------- Demo: forward and back solves with the paint L and U ----------

const PAINT_L = [[1, 0, 0], [2, 1, 0], [1, 3, 1]];
const PAINT_U = [[2, 1, 1], [0, 1, 2], [0, 0, 1]];

function demoSolveLU(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("b₁", 0, 20, 1, 5)}${slider("b₂", 0, 40, 1, 15)}${slider("b₃", 0, 60, 1, 22)}</div>
    <div class="la-eq la-show"></div><p class="la-read"></p>`;
  wireSliders(el, ([b1, b2, b3]) => {
    const c1 = q(b1), c2 = q(b2).sub(q(2).mul(c1)), c3 = q(b3).sub(c1).sub(q(3).mul(c2));
    const x3 = c3, x2 = c2.sub(q(2).mul(x3)), x1 = c1.sub(x2).sub(x3).div(q(2));
    const x = [x1, x2, x3];
    el.querySelector(".la-show").innerHTML = `L = ${matHTML(PAINT_L)} c = ${matHTML([[c1], [c2], [c3]])} U = ${matHTML(PAINT_U)} x = ${matHTML(x.map((v) => [v]))}`;
    const neg = x.some((v) => v.n < 0);
    el.querySelector(".la-read").innerHTML = `<b>Forward</b> (L c = b): c₁ = ${b1}, c₂ = ${b2} − 2·${b1} = ${sgn(c2)}, c₃ = ${b3} − ${b1} − 3·${sgn(c2)} = ${sgn(c3)}.
      <b>Back</b> (U x = c): x₃ = ${sgn(x3)}, x₂ = ${sgn(x2)}, x₁ = ${sgn(x1)}. ` +
      (neg ? `<span class="NO">A negative amount: this colour cannot be mixed from the three paints.</span>` : "Litres of Meadow, Harbour and Brick.");
  });
}

// ---------- Demo: what factoring once saves ----------

const factorSteps = (n) => ((n - 1) * n * (2 * n - 1)) / 6;
const solveSteps = (n) => n * (n - 1);
const big = (v) => Math.round(v).toLocaleString("en-US");

function demoCost(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("n (size)", 10, 2000, 10, 100)}${slider("orders", 1, 5000, 1, 1000)}</div>
    <div class="la-show"></div><p class="la-read"></p>`;
  wireSliders(el, ([n, k]) => {
    const f = factorSteps(n), s = solveSteps(n), redo = k * (f + s), once = f + k * s;
    const bar = (v, cls) => `<div style="height:14px;width:${Math.max(0.5, (100 * v) / redo)}%;background:var(--${cls});border-radius:3px"></div>`;
    el.querySelector(".la-show").innerHTML = `<p>Eliminate from scratch every time: <b>${big(redo)}</b> steps</p>${bar(redo, "red")}
      <p>Factor once, then two triangular solves per order: <b>${big(once)}</b> steps</p>${bar(once, "teal")}
      <p>Tridiagonal matrix of the same size (factor once, solve each order): about <b>${big(2 * n + k * 3 * n)}</b> steps</p>`;
    el.querySelector(".la-read").innerHTML = `Factoring costs ${big(f)} ≈ n³/3; each pair of solves ${big(s)} ≈ n². Factoring once is <b>${(redo / once).toFixed(1)} times</b> cheaper.`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "What is the inverse of the elimination matrix with −4 in position (3, 2)?", opts: ["The same matrix with +4 in (3, 2)", "Its transpose", "The matrix with −1/4 in (3, 2)"], a: 0,
    why: "Undo a step by adding back the same multiple of the row: only the sign of the multiplier changes." },
  { q: "Multipliers ℓ₂₁ = 5, ℓ₃₁ = −1, ℓ₃₂ = 2. Which entry of L is in position (3, 1)?", opts: ["1", "−1", "5", "2"], a: 1,
    why: "L holds each multiplier as it is, in its own position: (3, 1) holds ℓ₃₁ = −1." },
  { q: "You must solve Ax = b for 500 different b. Best plan?", opts: ["Compute A⁻¹ once and multiply", "Factor A = LU once, two triangular solves per b", "Eliminate from scratch each time"], a: 1,
    why: "Factoring costs about n³/3 once, each solve about n²; finding A⁻¹ costs about n³." },
  { q: "\"L is the matrix E = E₃₂E₃₁E₂₁ from elimination.\"", opts: ["True", "False"], a: 1, why: "L = E⁻¹. E mixes the multipliers (the 5 in Lecture 2); L keeps them clean." },
  { q: "Does [[0, 1], [1, 1]] have an LU factorization without row exchanges?", opts: ["Yes", "No, but PA = LU works"], a: 1, why: "The first pivot is 0. Exchanging the rows gives PA = I = LU with L = U = I." },
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
  lu: (el) => demoLU(el),
  luMini: (el) => demoLU(el, { mini: true }),
  solveLU: (el) => demoSolveLU(el),
  cost: (el) => demoCost(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
