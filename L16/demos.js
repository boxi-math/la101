// Interactive demos for LA101 Lecture 16: properties of the determinant.
// Every code panel is copied from notes/L16-determinant-properties.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  rules: "import numpy as np\nfrom fractions import Fraction\n\n\ndef d2(m):\n    return m[0][0] * m[1][1] - m[0][1] * m[1][0]\n\n\nF = [[3, 1], [2, 1]]\nM1 = [[1, 2], [3, -1]]\nprint(d2([[1, 0], [0, 1]]), d2(F), d2(M1), d2([M1[1], M1[0]]))\nprint(d2([[5 * x for x in M1[0]], M1[1]]), 5 * d2(M1))\nr, r2 = [1, 2], [4, 0]\nprint(d2([[a + b for a, b in zip(r, r2)], M1[1]]), d2([r, M1[1]]) + d2([r2, M1[1]]))",
  conseq: "A = np.array([[2, 1, 1], [4, 3, 4], [2, 4, 8]])          # the paint matrix of Lecture 2\ndet = lambda m: round(float(np.linalg.det(np.array(m, dtype=float))), 10) + 0.0\ntwin = A.copy()\ntwin[2] = twin[0]\nstep = A.copy()\nstep[1] = step[1] - 2 * step[0]\nzero = A.copy()\nzero[2] = 0\nU = np.array([[2, 1, 1], [0, 1, 2], [0, 0, 1]])\nprint(det(A), det(twin), det(step), det(zero))\nprint(det(U), int(np.prod(np.diag(U))), det([[3, 7, -2], [0, 0, 5], [0, 0, 4]]))",
  predict: "print(det(A[[2, 1, 0]]), det(A * np.array([[1], [-3], [1]])))",
  pivots: "def det_by_elimination(M):\n    \"\"\"Elimination with exact fractions; returns (determinant, pivots, number of row exchanges).\"\"\"\n    R = [[Fraction(x) for x in row] for row in M]\n    n, sign, pivots = len(R), 1, []\n    for k in range(n):\n        p = next((i for i in range(k, n) if R[i][k] != 0), None)\n        if p is None:\n            return Fraction(0), pivots, (1 - sign) // 2\n        if p != k:\n            R[k], R[p], sign = R[p], R[k], -sign\n        pivots.append(R[k][k])\n        for i in range(k + 1, n):\n            ell = R[i][k] / R[k][k]\n            R[i] = [a - ell * b for a, b in zip(R[i], R[k])]\n    prod = Fraction(sign)\n    for p_ in pivots:\n        prod *= p_\n    return prod, pivots, (1 - sign) // 2\n\n\nBx = [[1, 2, 1], [2, 4, 5], [3, 7, 2]]\nCs = [[1, 2, 1], [2, 4, 5], [3, 6, 4]]\nfor name, M in [(\"A\", A.tolist()), (\"B\", Bx), (\"C\", Cs)]:\n    d_, piv, swaps = det_by_elimination(M)\n    print(name, str(d_), [str(p_) for p_ in piv], swaps, det(M))",
  product: "Bm = np.array(Bx, dtype=float)\nAf = A.astype(float)\nprint(det(Af @ Bm), det(Af) * det(Bm), det(Bm @ Af))\nprint(det(Af.T), det(np.linalg.inv(Af)), round(1 / det(Af), 10))\nQ3 = np.array([[2, 3, 6], [3, -6, 2], [6, 2, -3]]) / 7\nprint(det(Q3), det(Af[:, [1, 0, 2]]))",
  notadd: "print(det(np.eye(2) + np.eye(2)), det(np.eye(2)) + det(np.eye(2)))\nprint(round(float(np.log10(np.linalg.det(0.1 * np.eye(50))))), round(float(np.linalg.cond(0.1 * np.eye(50))), 6))\nN = np.array([[1.0, 1000.0], [0.0, 1.0]])\nprint(det(N), round(float(np.log10(np.linalg.cond(N)))))",
  claim: "claimed = 1 * 1 * 3\nprint(claimed, str(det_by_elimination(Bx)[0]), det_by_elimination(Bx)[2])",
};

const OUT = {
  rules: "1 1 -7 7\n-35 -35\n-11 -11",
  conseq: "2.0 0.0 2.0 0.0\n2.0 2 0.0",
  predict: "-2.0 -6.0",
  pivots: "A 2 ['2', '1', '1'] 0 2.0\nB -3 ['1', '1', '3'] 1 -3.0\nC 0 ['1'] 0 0.0",
  product: "-6.0 -6.0 -6.0\n2.0 0.5 0.5\n1.0 -2.0",
  notadd: "4.0 2.0\n-50 1.0\n1.0 6",
  claim: "3 -3 1",
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

// ---------- Demo: the determinant from elimination (exact fractions), step by step ----------

// Elimination without reduction; records every step, the pivots and the number of row exchanges.
function detSteps(M0) {
  const R = M0.map((r) => r.map(q)), n = R.length, steps = [], pivots = [];
  let sign = 1;
  const snap = (msg, o = {}) => steps.push({ M: R.map((r) => r.slice()), msg, ...o });
  snap("Start.");
  for (let k = 0; k < n; k++) {
    const p = R.findIndex((row, i) => i >= k && !row[k].zero);
    if (p < 0) { snap(`Column ${k + 1} has no pivot: the matrix is <b class="NO">singular</b>, det = 0.`, { zCols: [k] }); return { steps, pivots, swaps: (1 - sign) / 2, det: q(0) }; }
    if (p !== k) { [R[k], R[p]] = [R[p], R[k]]; sign = -sign; snap(`Exchange rows ${k + 1} and ${p + 1}: the sign flips.`, { hlRows: [k, p] }); }
    pivots.push(R[k][k]);
    for (let i = k + 1; i < n; i++) {
      if (R[i][k].zero) continue;
      const l = R[i][k].div(R[k][k]);
      R[i] = R[i].map((v, c) => v.sub(l.mul(R[k][c])));
      snap(`Row ${i + 1} ${minusTimes(l)} × row ${k + 1}: no change to det.`, { hlRows: [i], hlCells: [[k, k]] });
    }
  }
  const det = pivots.reduce((a, b) => a.mul(b), q(sign));
  return { steps, pivots, swaps: (1 - sign) / 2, det };
}

function demoDet(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>A = <input class="la-in m" style="width:16em" value="1 2 1; 2 4 5; 3 7 2"></label></div>
    <p class="hint">Rows separated by ';'. Square, whole numbers.</p><div class="la-btns"><button class="cbtn prev">◀ step</button><button class="cbtn next">step ▶</button></div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  let res = null, k = 0;
  const show = () => {
    const s = res.steps[k], last = k === res.steps.length - 1;
    el.querySelector(".la-show").innerHTML = matHTML(s.M, s);
    el.querySelector(".la-log").innerHTML = `Step ${k}/${res.steps.length - 1}. ${s.msg}` + (last && !res.det.zero
      ? ` Pivots ${res.pivots.join(", ")}, ${res.swaps ? "one exchange (odd): minus" : "no exchange: plus"} — <b class="A">det = ${res.swaps ? "−" : ""}(${res.pivots.join(" · ")}) = ${res.det}</b>.` : "");
  };
  const load = (M) => {
    if (!okMat(M) || M.length !== M[0].length) { el.querySelector(".la-show").innerHTML = ""; el.querySelector(".la-log").innerHTML = "Type a square matrix of whole numbers."; res = null; return false; }
    res = detSteps(M); k = res.steps.length - 1; show(); return true;
  };
  if (opts.mini) {
    const mats = [[[2, 1, 1], [4, 3, 4], [2, 4, 8]], [[1, 2, 1], [2, 4, 5], [3, 7, 2]], [[1, 2, 1], [2, 4, 5], [3, 6, 4]]];
    let j = 0;
    const tick = () => { load(mats[j % 3]); j++; };
    tick(); setInterval(tick, 2800); return;
  }
  const im = el.querySelector(".m");
  im.addEventListener("input", () => load(parseMat(im.value)));
  el.querySelector(".prev").onclick = () => { if (res && k > 0) { k--; show(); } };
  el.querySelector(".next").onclick = () => { if (res && k < res.steps.length - 1) { k++; show(); } };
  load(parseMat(im.value));
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "det A = 5 for a 3 × 3 matrix. What is det(2A)?", opts: ["10", "40", "25"], a: 1,
    why: "Each of the three rows is doubled: 2³ · 5 = 40." },
  { q: "Why does a permutation matrix have determinant ±1?", opts: ["It is triangular", "It is I with rows exchanged; each exchange flips the sign"], a: 1,
    why: "Rule 1 gives det I = 1, rule 2 a factor −1 per exchange." },
  { q: "Can elimination without row exchanges change a determinant?", opts: ["Yes", "No"], a: 1,
    why: "Subtracting a multiple of a row never changes it (consequence 5)." },
  { q: "\"det [[2, 4], [6, 8]] = 2 det [[1, 2], [3, 4]] = −4.\" The error?", opts: ["None", "Both rows were divided by 2: the factor is 4, det = −8"], a: 1,
    why: "Rule 3 is one row at a time." },
  { q: "det(0.1 · I₅₀) = 10⁻⁵⁰. Is the matrix nearly singular?", opts: ["Yes", "No: its condition number is 1"], a: 1,
    why: "The size of a determinant is not a test of near-singularity." },
];

const DEMOS = {
  det: (el) => demoDet(el),
  detMini: (el) => demoDet(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
