// Interactive demos for LA101 Lecture 2. Elimination step by step, elimination matrices, breakdowns.
// Every code panel is copied from notes/L02-elimination.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  setup: "import numpy as np\n\nA = np.array([[2, 1, 1],\n              [4, 3, 4],\n              [2, 4, 8]])\nb = np.array([5, 15, 22])\nprint(A[:, 0].tolist(), A[:, 1].tolist(), A[:, 2].tolist(), b.tolist())",
  eliminate: "from fractions import Fraction\n\n\ndef eliminate(M):\n    \"\"\"Forward elimination without row exchanges on a list of rows; print every step.\"\"\"\n    M = [[Fraction(v) for v in row] for row in M]\n    n = len(M)\n    for j in range(n):\n        for i in range(j + 1, n):\n            mult = M[i][j] / M[j][j]\n            M[i] = [a - mult * p for a, p in zip(M[i], M[j])]\n            print(f\"row {i + 1} -= {mult} * row {j + 1}:\", [str(v) for v in M[i]])\n    return M\n\n\naugmented = [[2, 1, 1, 5], [4, 3, 4, 15], [2, 4, 8, 22]]\nU_aug = eliminate(augmented)",
  backsub: "def back_substitute(M):\n    \"\"\"Solve an upper-triangular augmented system, last unknown first.\"\"\"\n    n = len(M)\n    x = [Fraction(0)] * n\n    for i in reversed(range(n)):\n        known = sum(M[i][k] * x[k] for k in range(i + 1, n))\n        x[i] = (M[i][n] - known) / M[i][i]\n    return x\n\n\nsol = back_substitute(U_aug)\nprint([str(v) for v in sol])\nprint((A @ np.array([int(v) for v in sol])).tolist())",
  check2: "print([str(v) for v in back_substitute(eliminate([[3, 1, 7], [6, 5, 23]]))])",
  steps: "E21 = np.array([[1, 0, 0], [-2, 1, 0], [0, 0, 1]])\nE31 = np.array([[1, 0, 0], [0, 1, 0], [-1, 0, 1]])\nE32 = np.array([[1, 0, 0], [0, 1, 0], [0, -3, 1]])\n\nprint((E21 @ A).tolist())\nprint((E31 @ E21 @ A).tolist())\nU = E32 @ E31 @ E21 @ A\nprint(U.tolist())",
  combine: "E = E32 @ E31 @ E21\nc = E @ b\nprint(E.tolist())\nprint((E @ A).tolist(), c.tolist())",
  order: "print((A @ E21).tolist())\nprint(bool(np.array_equal(A @ E21, E21 @ A)))",
  exchange: "B = np.array([[1, 2, 1], [2, 4, 5], [3, 7, 2]])\nstep1 = np.array([[1, 0, 0], [-2, 1, 0], [-3, 0, 1]]) @ B\nP23 = np.array([[1, 0, 0], [0, 0, 1], [0, 1, 0]])\nprint(step1.tolist())\nprint((P23 @ step1).tolist())",
  singular: "C = np.array([[1, 2, 1], [2, 4, 5], [3, 6, 4]])\nprint((np.array([[1, 0, 0], [-2, 1, 0], [-3, 0, 1]]) @ C).tolist())\nprint(C[:, 1].tolist(), (2 * C[:, 0]).tolist())\nprint(int(np.linalg.matrix_rank(B)), int(np.linalg.matrix_rank(C)))",
  firstzero: "D = np.array([[0, 1, 2], [1, 1, 1], [2, 0, 3]])\nprint((np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]]) @ D).tolist(), int(np.linalg.matrix_rank(D)))",
  solve: "print(np.round(np.linalg.solve(A, b), 10).tolist())",
  claimed: "claimed_after_step1 = [[2, 1, 1], [0, 1, 2], [2, 4, 8]]\nE_claimed = np.array([[1, 0, 0], [2, 1, 0], [0, 0, 1]])\nprint((E_claimed @ A).tolist())\nprint(bool(np.array_equal(E_claimed @ A, claimed_after_step1)), bool(np.array_equal(E21 @ A, claimed_after_step1)))",
};

const OUT = {
  setup: "[2, 4, 2] [1, 3, 4] [1, 4, 8] [5, 15, 22]",
  eliminate: "row 2 -= 2 * row 1: ['0', '1', '2', '5']\nrow 3 -= 1 * row 1: ['0', '3', '7', '17']\nrow 3 -= 3 * row 2: ['0', '0', '1', '2']",
  backsub: "['1', '1', '2']\n[5, 15, 22]",
  check2: "row 2 -= 2 * row 1: ['0', '3', '9']\n['4/3', '3']",
  steps: "[[2, 1, 1], [0, 1, 2], [2, 4, 8]]\n[[2, 1, 1], [0, 1, 2], [0, 3, 7]]\n[[2, 1, 1], [0, 1, 2], [0, 0, 1]]",
  combine: "[[1, 0, 0], [-2, 1, 0], [5, -3, 1]]\n[[2, 1, 1], [0, 1, 2], [0, 0, 1]] [5, 5, 2]",
  order: "[[0, 1, 1], [-2, 3, 4], [-6, 4, 8]]\nFalse",
  exchange: "[[1, 2, 1], [0, 0, 3], [0, 1, -1]]\n[[1, 2, 1], [0, 1, -1], [0, 0, 3]]",
  singular: "[[1, 2, 1], [0, 0, 3], [0, 0, 1]]\n[2, 4, 6] [2, 4, 6]\n3 2",
  firstzero: "[[1, 1, 1], [0, 1, 2], [2, 0, 3]] 3",
  solve: "[1.0, 1.0, 2.0]",
  claimed: "[[2, 1, 1], [8, 5, 6], [2, 4, 8]]\nFalse True",
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

// ---------- Demo: elimination, one step per click ----------
// Forward elimination on an augmented matrix [A | b]; a row exchange only when a pivot position holds 0.

function eliminationSteps(M0, aug) {
  const M = toQ(M0), n = M.length, cols = M[0].length - (aug ? 1 : 0);
  const snap = (msg, o = {}) => steps.push({ M: M.map((r) => r.slice()), msg, ...o });
  const steps = [];
  const pivots = [];
  snap("Start: each row is one equation.");
  let r = 0;
  for (let c = 0; c < cols && r < n; c++) {
    if (M[r][c].zero) {
      const k = M.findIndex((row, i) => i > r && !row[c].zero);
      if (k < 0) { snap(`Column ${c + 1}: zero in the pivot position and no row below can help. <b class="NO">No pivot: the matrix is singular.</b>`, { zCells: [[r, c]] }); continue; }
      [M[r], M[k]] = [M[k], M[r]];
      snap(`Zero in the pivot position: exchange rows ${r + 1} and ${k + 1}.`, { hlRows: [r, k] });
    }
    pivots.push(M[r][c]);
    snap(`Pivot ${M[r][c]} (row ${r + 1}, column ${c + 1}).`, { hlCells: [[r, c]] });
    for (let i = r + 1; i < n; i++) {
      if (M[i][c].zero) continue;
      const l = M[i][c].div(M[r][c]);
      M[i] = M[i].map((v, j) => v.sub(l.mul(M[r][j])));
      snap(`Multiplier ℓ = ${sgn(M[i][c].add(l.mul(M[r][c])))} / ${sgn(M[r][c])} = <b>${sgn(l)}</b>: row ${i + 1} ${minusTimes(l)} × row ${r + 1}.`, { hlRows: [i], zCells: [[i, c]] });
    }
    r++;
  }
  if (aug && pivots.length === n && cols === n) {
    const x = Array(n).fill(q(0));
    for (let i = n - 1; i >= 0; i--) {
      let s = M[i][n];
      for (let k = i + 1; k < n; k++) s = s.sub(M[i][k].mul(x[k]));
      x[i] = s.div(M[i][i]);
    }
    snap(`Upper triangular, pivots ${pivots.join(", ")}. Back substitution: <b>(${x.join(", ")})</b>.`);
  } else if (pivots.length < Math.min(n, cols)) {
    snap(`Done: only ${pivots.length} pivot${pivots.length === 1 ? "" : "s"}. Ax = b has no solution or infinitely many.`);
  }
  return steps;
}

function demoStepper(el, opts = {}) {
  const preset = opts.preset || "2 1 1 5; 4 3 4 15; 2 4 8 22";
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>[A | b] = <input class="la-in" style="width:19em" value="${preset}"></label></div>
    <div class="la-btns"><button class="cbtn next">Next step</button><button class="cbtn reset">Start again</button>
    <button class="cbtn p1">Paint</button><button class="cbtn p2">Needs an exchange</button><button class="cbtn p3">Singular</button></div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  let steps = [], k = 0;
  const show = () => {
    const s = steps[k];
    el.querySelector(".la-show").innerHTML = matHTML(s.M, { ...s, aug: true });
    el.querySelector(".la-log").innerHTML = `<b>Step ${k} of ${steps.length - 1}.</b> ${s.msg}`;
  };
  const load = (text) => {
    const M = parseMat(text);
    if (!okMat(M) || M[0].length !== M.length + 1) {
      el.querySelector(".la-show").innerHTML = "";
      el.querySelector(".la-log").innerHTML = "Type n rows of n + 1 whole numbers (the last one is the right-hand side), rows separated by ';'.";
      steps = []; return;
    }
    steps = eliminationSteps(M, true); k = 0; show();
  };
  if (opts.mini) {
    load(preset);
    setInterval(() => { k = (k + 1) % steps.length; show(); }, 1600);
    return;
  }
  const inp = el.querySelector("input");
  el.querySelector(".next").onclick = () => { if (steps.length && k < steps.length - 1) { k++; show(); } };
  el.querySelector(".reset").onclick = () => load(inp.value);
  [["p1", "2 1 1 5; 4 3 4 15; 2 4 8 22"], ["p2", "1 2 1 4; 2 4 5 11; 3 7 2 12"], ["p3", "1 2 1 4; 2 4 5 11; 3 6 4 13"]]
    .forEach(([c, v]) => { el.querySelector(`.${c}`).onclick = () => { inp.value = v; load(v); }; });
  inp.addEventListener("input", () => load(inp.value));
  load(preset);
}

// ---------- Demo: an elimination matrix acting on A ----------

function demoEmatrix(el) {
  const A = [[2, 1, 1], [4, 3, 4], [2, 4, 8]];
  el.innerHTML = `<div class="la-ctrl">${slider("row i", 2, 3, 1, 2)}${slider("column j", 1, 2, 1, 1)}${slider("multiplier ℓ", -4, 4, 1, 2)}</div>
    <div class="la-eq la-show"></div><p class="la-read"></p>`;
  wireSliders(el, ([i, j, l]) => {
    const E = eye(3);
    if (j < i) E[i - 1][j - 1] = q(-l);
    const EA = mmul(E, A);
    el.querySelector(".la-show").innerHTML = `E = ${matHTML(E, { hlCells: j < i ? [[i - 1, j - 1]] : [] })} E·A = ${matHTML(EA, { hlRows: [i - 1], zCells: EA[i - 1][j - 1].zero ? [[i - 1, j - 1]] : [] })}`;
    el.querySelector(".la-read").innerHTML = j >= i
      ? "Elimination removes entries <b>below</b> the pivot: choose a column j smaller than the row i."
      : `E is the identity with −ℓ = ${String(-l).replace("-", "−")} in row ${i}, column ${j}: <b>row ${i} − ${l} × row ${j}</b>. Only row ${i} changes. ` +
        (EA[i - 1][j - 1].zero ? `Entry (${i}, ${j}) is now <b>0</b>: this ℓ is entry ÷ pivot.` : `Entry (${i}, ${j}) is ${EA[i - 1][j - 1]}, not 0: try ℓ = entry ÷ pivot.`);
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "The pivot is 4 and the entry to remove is −6. What is the multiplier?",
    opts: ["−3/2", "3/2", "−2/3", "−10"], a: 0,
    why: "Multiplier = entry ÷ pivot = −6/4 = −3/2. Subtracting −3/2 times the pivot row adds 3/2 times it." },
  { q: "Elimination on a 3-by-3 matrix gives pivots 2, 0 and 5, and no row below the zero can be exchanged in. Can Ax = b have exactly one solution?",
    opts: ["Yes, if b is chosen well", "No: the matrix is singular, so there is no solution or infinitely many"], a: 1,
    why: "A missing pivot means a singular matrix." },
  { q: "Which matrix subtracts 4 times row 1 from row 3 of a 3-by-3 matrix?",
    opts: ["The identity with −4 in row 3, column 1", "The identity with 4 in row 3, column 1", "The identity with −4 in row 1, column 3"], a: 0,
    why: "Start from I and put −ℓ in row i, column j: here i = 3, j = 1, ℓ = 4." },
  { q: "Back substitution solves for which unknown first?",
    opts: ["The first one, x", "The last one: the bottom equation has a single unknown"], a: 1,
    why: "The staircase is solved from the bottom up." },
  { q: "To apply an elimination step to A, you compute…",
    opts: ["E @ A (E on the left)", "A @ E (E on the right)"], a: 0,
    why: "A matrix on the left combines rows. On the right it combines columns, which is not an elimination step." },
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
  stepper: (el) => demoStepper(el),
  stepperMini: (el) => demoStepper(el, { mini: true }),
  stepperB: (el) => demoStepper(el, { preset: "1 2 1 4; 2 4 5 11; 3 7 2 12" }),
  ematrix: (el) => demoEmatrix(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
