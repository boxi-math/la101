// Interactive demos for LA101 Lecture 25: linear transformations and change of basis.
// Every code panel is copied from notes/L25-linear-transformations-change-of-basis.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  coords: "import numpy as np\nfrom fractions import Fraction as Fr\n\n\ndef poly_eval(coef, t):\n    \"\"\"Value of coef[0] + coef[1] t + coef[2] t^2 + ... at t.\"\"\"\n    return sum(a * t**k for k, a in enumerate(coef))\n\n\nB = np.array([[1, -1, 1], [0, 1, -2], [0, 0, 1]])\nc_old = np.array([3, -2, 1])\nc_new = np.linalg.solve(B, c_old)\nprint((np.round(c_new, 10) + 0.0).tolist(), (B @ [2, 0, 1]).tolist())\nfor t in [0, 1, 2.5]:\n    print(t, poly_eval(c_old, t), 2 + 0 * (t - 1) + (t - 1) ** 2)",
  deriv: "D = np.array([[0, 1, 0], [0, 0, 2], [0, 0, 0]])\nprint((D @ c_old).tolist(), (D @ D).tolist(), (D @ D @ D).tolist())\np = [Fr(3), Fr(-2), Fr(1)]\nh = Fr(1, 1000)\nslope = (poly_eval(p, Fr(1, 2) + h) - poly_eval(p, Fr(1, 2) - h)) / (2 * h)\nprint(str(slope), str(poly_eval([Fr(-2), Fr(2)], Fr(1, 2))))",
  trig: "Dtrig = np.array([[0, 1], [-1, 0]])\ncoef = np.array([2.0, 5.0])\ntt = 0.7\nlhs = (Dtrig @ coef) @ [np.cos(tt), np.sin(tt)]\nrhs = -2 * np.sin(tt) + 5 * np.cos(tt)\nprint(round(float(lhs), 10), round(float(rhs), 10), np.linalg.eigvals(Dtrig).tolist())",
  shift: "Tsh = np.array([[1, 1, 1], [0, 1, 2], [0, 0, 1]])\nprint((Tsh @ c_old).tolist(), [int(poly_eval(c_old, t + 1)) for t in [0, 1, 2]], [int(poly_eval(Tsh @ c_old, t)) for t in [0, 1, 2]])",
  proj: "A = np.array([[0.5, 0.5], [0.5, 0.5]])\nBp = np.array([[1, 1], [1, -1]])\nprint((np.round(np.linalg.inv(Bp) @ A @ Bp, 10) + 0.0).tolist())\nx = np.array([3.0, 1.0])\ncx = np.linalg.solve(Bp, x)\nprint(cx.tolist(), (A @ x).tolist(), (Bp @ (np.diag([1, 0]) @ cx)).tolist())",
  similar: "A18 = np.array([[4, 1], [2, 3]])\nMs = np.array([[1, 1], [0, 1]])\nCs = np.linalg.inv(Ms) @ A18 @ Ms\nprint((np.round(Cs, 10) + 0.0).tolist())\nfor name, Mat in [(\"A\", A18), (\"C\", Cs)]:\n    print(name, sorted(np.round(np.linalg.eigvals(Mat).real, 10).tolist()), round(float(np.trace(Mat)), 10),\n          round(float(np.linalg.det(Mat)), 10), int(np.linalg.matrix_rank(Mat)))\nx5 = np.array([1, 1])\nprint((A18 @ x5).tolist(), (Cs @ np.linalg.solve(Ms, x5)).tolist(), np.linalg.solve(Ms, x5).tolist())",
  jordan: "Bj = np.diag([1.0, 1.0, 0.5])\nJ = np.linalg.inv(Bj) @ D @ Bj\nprint((np.round(J, 10) + 0.0).tolist())\nprint(int(3 - np.linalg.matrix_rank(D)), (np.round(np.linalg.eigvals(D.astype(float)).real, 10) + 0.0).tolist())",
  reparam: "w = np.array([3.0, 20.0])\nhouse = np.array([80.0, 3.0])\nfor name, Mf in [(\"area/10\", np.diag([0.1, 1.0])), (\"rooms - area/30\", np.array([[1.0, 0.0], [-1 / 30, 1.0]]))]:\n    w_new = np.linalg.inv(Mf).T @ w\n    print(name, np.round(w_new, 4).tolist(), round(float(w @ house), 10), round(float(w_new @ (Mf @ house)), 10))",
  hessian: "Xh = np.array([[50, 2], [80, 3], [100, 4], [65, 3]], dtype=float)\nfor name, Mf in [(\"m2\", np.eye(2)), (\"tens of m2\", np.diag([0.1, 1.0]))]:\n    Hm = Mf @ Xh.T @ Xh @ Mf.T\n    print(name, np.round(Hm, 2).tolist(), round(float(np.linalg.cond(Hm))))",
  claim: "claimed = [6, -4, 1]\nrebuilt = B @ claimed\nprint(rebuilt.tolist(), [int(poly_eval(claimed, t - 1)) for t in [0, 1, 2]], [int(poly_eval(c_old, t)) for t in [0, 1, 2]])",
};

const OUT = {
  coords: "[2.0, 0.0, 1.0] [3, -2, 1]\n0 3 3\n1 2 2\n2.5 4.25 4.25",
  deriv: "[-2, 2, 0] [[0, 0, 2], [0, 0, 0], [0, 0, 0]] [[0, 0, 0], [0, 0, 0], [0, 0, 0]]\n-1 -1",
  trig: "2.5357755619 2.5357755619 [1j, -1j]",
  shift: "[2, 0, 1] [2, 3, 6] [2, 3, 6]",
  proj: "[[1.0, 0.0], [0.0, 0.0]]\n[2.0, 1.0] [2.0, 2.0] [2.0, 2.0]",
  similar: "[[2.0, 0.0], [2.0, 5.0]]\nA [2.0, 5.0] 7.0 10.0 2\nC [2.0, 5.0] 7.0 10.0 2\n[5, 5] [0.0, 5.0] [0.0, 1.0]",
  jordan: "[[0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [0.0, 0.0, 0.0]]\n1 [0.0, 0.0, 0.0]",
  reparam: "area/10 [30.0, 20.0] 300.0 300.0\nrooms - area/30 [3.6667, 20.0] 300.0 300.0",
  hessian: "m2 [[23125.0, 935.0], [935.0, 38.0]] 118567\ntens of m2 [[231.25, 93.5], [93.5, 38.0]] 1600",
  claim: "[11, -6, 1] [11, 6, 3] [3, 2, 3]",
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

// ---------- Demo: one map, a basis of your choice, the matrix B⁻¹AB ----------

const r3 = (v) => { const x = Math.round(v * 1000) / 1000; return Object.is(x, -0) ? 0 : x; };
const num = (v) => String(r3(v)).replace("-", "−");
const mat2 = (M) => matHTML(M.map((r) => r.map(r3)));
const mul2 = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
const eig2 = (M) => {
  const t = M[0][0] + M[1][1], d = M[0][0] * M[1][1] - M[0][1] * M[1][0], disc = t * t / 4 - d;
  return disc >= -1e-12 ? [t / 2 + Math.sqrt(Math.max(disc, 0)), t / 2 - Math.sqrt(Math.max(disc, 0))].map(num).join(", ")
    : `${num(t / 2)} ± ${num(Math.sqrt(-disc))}i`;
};

const MAPS = {
  "projection onto y = x": [[0.5, 0.5], [0.5, 0.5]],
  "Lecture 18's A": [[4, 1], [2, 3]],
  "shear N": [[1, 1], [0, 1]],
  "rotation by 90°": [[0, -1], [1, 0]],
};

function demoBasis(el, opts = {}) {
  const names = Object.keys(MAPS);
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>map <select class="la-in m">${names.map((n, i) => `<option value="${i}"${i === 1 ? " selected" : ""}>${n}</option>`).join("")}</select></label></div>
    <div class="la-ctrl">${slider("v₁ x", -3, 3, 1, 1)}${slider("v₁ y", -3, 3, 1, 1)}${slider("v₂ x", -3, 3, 1, 1)}${slider("v₂ y", -3, 3, 1, -2)}</div>`) +
    `<div class="la-eq la-show"></div><p class="la-read"></p>`;
  let mapIdx = 1;
  const draw = ([a, b, c, d]) => {
    const A = MAPS[names[mapIdx]], B = [[a, c], [b, d]], det = a * d - b * c;
    const show = el.querySelector(".la-show"), read = el.querySelector(".la-read");
    if (Math.abs(det) < 1e-12) { show.innerHTML = ""; read.innerHTML = `<b class="NO">v₁ and v₂ are on one line</b>: not a basis, B has no inverse.`; return; }
    const Bi = [[d / det, -c / det], [-b / det, a / det]], Cn = mul2(Bi, mul2(A, B));
    show.innerHTML = `A = ${mat2(A)} B = ${mat2(B)} B⁻¹AB = ${mat2(Cn)}`;
    const diag = Math.abs(Cn[0][1]) < 1e-9 && Math.abs(Cn[1][0]) < 1e-9;
    read.innerHTML = `${names[mapIdx]} in the basis v₁ = (${a}, ${b}), v₂ = (${c}, ${d}). Shared by A and B⁻¹AB: trace <b class="A">${num(A[0][0] + A[1][1])}</b> = ${num(Cn[0][0] + Cn[1][1])}, ` +
      `determinant <b class="A">${num(A[0][0] * A[1][1] - A[0][1] * A[1][0])}</b> = ${num(Cn[0][0] * Cn[1][1] - Cn[0][1] * Cn[1][0])}, eigenvalues ${eig2(A)}. ` +
      (diag ? `<b class="C">Diagonal</b>: v₁ and v₂ are eigenvectors.` : `Not diagonal: ${names[mapIdx] === "shear N" ? "the shear has only one line of eigenvectors, so no basis can make it diagonal (a Jordan block)." : names[mapIdx] === "rotation by 90°" ? "a real rotation has no real eigenvectors." : "try the eigenvectors as v₁, v₂."}`);
  };
  if (opts.mini) {
    const sets = [[1, 0, 0, 1], [1, 0, 1, 1], [1, 1, 1, -2]];
    let i = 0;
    const tick = () => { draw(sets[i % sets.length]); i++; };
    tick(); setInterval(tick, 2600); return;
  }
  el.querySelector(".m").addEventListener("change", (e) => { mapIdx = +e.target.value; el.querySelector(".la-slider input").dispatchEvent(new Event("input")); });
  wireSliders(el, draw);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Coordinates of t² in the basis 1, (t − 1), (t − 1)²?", opts: ["(0, 0, 1)", "(1, 2, 1)", "(1, −2, 1)"], a: 1,
    why: "t² = 1 + 2(t − 1) + (t − 1)²." },
  { q: "Is T(x, y) = (x + y, xy) linear?", opts: ["Yes", "No"], a: 1, why: "Doubling (x, y) multiplies xy by 4." },
  { q: "A has eigenvalues 3 and 7. The trace and determinant of M⁻¹AM are", opts: ["10 and 21", "depend on M"], a: 0,
    why: "Similar matrices share eigenvalues, so trace 10 and determinant 21." },
  { q: "[[2, 1], [0, 2]] and 2I have the same eigenvalues. Are they similar?", opts: ["Yes", "No"], a: 1,
    why: "M⁻¹(2I)M = 2I for every M; the first is a Jordan block with one line of eigenvectors." },
  { q: "B has the new basis vectors (in old coordinates) as columns. Old coordinates from new ones:", opts: ["c_old = B c_new", "c_old = B⁻¹ c_new"], a: 0,
    why: "B goes from new to old; old to new needs B⁻¹." },
];

const DEMOS = {
  basis: (el) => demoBasis(el),
  basisMini: (el) => demoBasis(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
