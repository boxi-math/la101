// Interactive demos for LA101 Lecture 9: independence, span, basis, dimension.
// Every code panel is copied from notes/L09-independence-basis-dimension.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  pairs: "import numpy as np\nfrom itertools import combinations\n\nA = np.array([[1, 1, 3, 0],\n              [2, 3, 7, 1],\n              [1, 2, 4, 1]])\nnames = \"uvws\"\nrank_all = int(np.linalg.matrix_rank(A))\nfor pair in combinations(range(4), 2):\n    sub = A[:, list(pair)]\n    print(\"\".join(names[j] for j in pair), int(np.linalg.matrix_rank(sub)) == rank_all)",
  indep: "def independent(*vectors):\n    \"\"\"True when the vectors are linearly independent (rank = number of vectors).\"\"\"\n    M = np.column_stack(vectors)\n    return int(np.linalg.matrix_rank(M)) == M.shape[1]\n\n\nu, v, w, s = (A[:, j] for j in range(4))\nprint(independent(u, v), independent(u, v, w), independent(u, v, s))\nprint(independent(np.array([1, 0, 1]), np.array([0, 1, 1]), np.array([1, 1, 0])))\nprint((-2 * u - v + w).tolist(), (u - v + s).tolist())",
  span: "def spans_R(m, *vectors):\n    \"\"\"True when the vectors span all of R^m (rank m).\"\"\"\n    return int(np.linalg.matrix_rank(np.column_stack(vectors))) == m\n\n\nprint(spans_R(3, u, v), spans_R(3, u, v, w, s), spans_R(3, u, v, np.array([1, 1, 1])))",
  coords: "from fractions import Fraction\n\ntarget = np.array([2, 5, 3])\nfor label, basis in [(\"u, v\", (u, v)), (\"u, s\", (u, s)), (\"w, s\", (w, s))]:\n    B = np.column_stack(basis)\n    coords = [Fraction(c).limit_denominator(100) for c in np.linalg.lstsq(B, target, rcond=None)[0]]\n    back = [str(sum(c * int(x) for c, x in zip(coords, row))) for row in B]\n    print(label, [str(c) for c in coords], back)",
  basischeck: "print(independent(u, v, w), int(1 - 1 + 1) == 0)",
  rpivot: "R_pivot_cols = [np.array([1, 0, 0]), np.array([0, 1, 0])]\nfor col in R_pivot_cols:\n    print(col.tolist(), \"in C(A):\", int(col[0] - col[1] + col[2]) == 0)\nprint(\"u, v in C(A):\", [int(x[0] - x[1] + x[2]) == 0 for x in (u, v)])",
  onehot: "weather = [\"sunny\", \"rainy\", \"cloudy\", \"sunny\", \"cloudy\", \"rainy\"]\ncats = [\"sunny\", \"cloudy\", \"rainy\"]\nX = np.array([[1] + [int(day == c) for c in cats] for day in weather])\nprint(X.tolist())\nprint(X.shape[1], int(np.linalg.matrix_rank(X)))\nprint((X @ np.array([1, -1, -1, -1])).tolist())",
  drop: "X_drop = X[:, [0, 2, 3]]  # intercept, cloudy, rainy (sunny is the baseline)\nprint(int(np.linalg.matrix_rank(X_drop)), X_drop.shape[1])",
  almost: "almost = np.column_stack([X[:, 1], X[:, 1] + 1e-13 * np.arange(6)])\nprint(int(np.linalg.matrix_rank(almost)), int(np.linalg.matrix_rank(almost, tol=1e-6)))",
  claim: "claimed_basis = [np.array([1, 0, 0]), np.array([0, 1, 0])]\nprint(len(claimed_basis) == int(np.linalg.matrix_rank(A)), independent(*claimed_basis))\nprint([int(x[0] - x[1] + x[2]) == 0 for x in claimed_basis])",
};

const OUT = {
  pairs: "uv True\nuw True\nus True\nvw True\nvs True\nws True",
  indep: "True False False\nTrue\n[0, 0, 0] [0, 0, 0]",
  span: "False False True",
  coords: "u, v ['1', '1'] ['2', '5', '3']\nu, s ['2', '1'] ['2', '5', '3']\nw, s ['2/3', '1/3'] ['2', '5', '3']",
  basischeck: "False False",
  rpivot: "[1, 0, 0] in C(A): False\n[0, 1, 0] in C(A): False\nu, v in C(A): [True, True]",
  onehot: "[[1, 1, 0, 0], [1, 0, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [1, 0, 1, 0], [1, 0, 0, 1]]\n4 3\n[0, 0, 0, 0, 0, 0]",
  drop: "3 3",
  almost: "2 1",
  claim: "True True\n[False, False]",
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

// ---------- Demo: independent? spanning? a basis, the dimension and coordinates ----------

function demoBasis(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>vectors = <input class="la-in v" style="width:19em" value="1 2 1; 1 3 2; 3 7 4; 0 1 1"></label>
    <label>target = <input class="la-in t" style="width:7em" value="2 5 3"></label></div>
    <p class="hint">One vector per group, separated by ';'. They become the columns of a matrix.</p>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  const draw = (V, t, label = "") => {
    const show = el.querySelector(".la-show"), log = el.querySelector(".la-log");
    if (!okMat(V) || (t.length && (t.length !== V[0].length || !t.every(Number.isInteger)))) { show.innerHTML = ""; log.innerHTML = "Type whole numbers; every vector (and the target) needs the same number of entries."; return; }
    const m = V[0].length, k = V.length;
    const A = Array.from({ length: m }, (_, i) => V.map((v) => v[i]));
    const { R, piv } = rref(A), r = piv.length, sp = specials(R, piv);
    show.innerHTML = `${label}A = ${matHTML(A, { pivCols: piv })} R = ${matHTML(R, { pivCols: piv })}`;
    let msg = `${k} vectors in R<sup>${m}</sup>, rank ${r}. ` +
      (r === k ? `<b class="A">Independent</b>. ` : `<b class="NO">Dependent</b>: ${sp.map((x) => `${x.map((c, j) => (c.zero ? "" : `${c}·v${j + 1}`)).filter(Boolean).join(" + ").replace(/\+ -/g, "− ")} = 0`).join("; ")}. `) +
      (r === m ? `They <b class="A">span R<sup>${m}</sup></b>. ` : `They span a ${r}-dimensional subspace, not all of R<sup>${m}</sup>. `) +
      `A basis of their span: the pivot vectors ${piv.map((j) => `v${j + 1}`).join(", ") || "(none)"}; dimension ${r}.`;
    if (t.length) {
      const aug = rref(A.map((row, i) => [...row.filter((_, j) => piv.includes(j)), t[i]]));
      if (aug.piv.includes(r)) msg += ` Target ${vecStr(t)}: <b class="NO">not in the span</b>.`;
      else msg += ` Target ${vecStr(t)} = ${piv.map((j, i) => `${aug.R[i][r]}·v${j + 1}`).join(" + ").replace(/\+ -/g, "− ")}: coordinates ${vecStr(piv.map((_, i) => aug.R[i][r]))} in that basis.`;
    }
    log.innerHTML = msg;
  };
  if (opts.mini) {
    const sets = [[[1, 2, 1], [1, 3, 2]], [[1, 2, 1], [1, 3, 2], [3, 7, 4]], [[1, 2, 1], [1, 3, 2], [1, 1, 1]], [[3, 7, 4], [0, 1, 1]]];
    let k = 0;
    const tick = () => { draw(sets[k % 4], [2, 5, 3]); k++; };
    tick(); setInterval(tick, 2800); return;
  }
  const [iv, it] = [el.querySelector(".v"), el.querySelector(".t")];
  const go = () => draw(parseMat(iv.value), parseVec(it.value));
  iv.addEventListener("input", go); it.addEventListener("input", go);
  go();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Can four vectors in R³ be independent? Can two vectors span R³?", opts: ["Yes, yes", "Yes, no", "No, yes", "No, no"], a: 3,
    why: "More than 3 vectors in R³ are dependent; two vectors span at most a plane." },
  { q: "What is the dimension of N(A) for a 3-by-7 matrix of rank 3?", opts: ["3", "4", "7"], a: 1, why: "n − r = 7 − 3 = 4." },
  { q: "If a, b, c are dependent, then c is a combination of a and b.", opts: ["True", "False"], a: 1,
    why: "a = (1, 0), b = (2, 0), c = (0, 1): the dependence is between a and b; c is not a combination of them." },
  { q: "\"The dimension of the drone matrix A is 3 × 4.\" What is wrong?", opts: ["Nothing", "3 × 4 is its shape; dimensions belong to spaces: dim C(A) = 2, dim N(A) = 2"], a: 1,
    why: "Shape is a property of the matrix; dimension is a property of a subspace." },
  { q: "Which vectors are a basis of the column space of A?", opts: ["The pivot columns of R", "The pivot columns of A", "All the columns of A"], a: 1,
    why: "Elimination changes the column space: R's pivot columns (1, 0, 0), (0, 1, 0) are not even in C(A)." },
];

const DEMOS = {
  basis: (el) => demoBasis(el),
  basisMini: (el) => demoBasis(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
