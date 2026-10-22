// Interactive demos for LA101 Lecture 6: column space, nullspace.
// Every code panel is copied from notes/L06-column-space-nullspace.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  robot: "import numpy as np\n\nM = np.array([[1, 2],\n              [3, 6]])\nfor recipe in [(7, 0), (5, 1), (2, -1), (-4, 2)]:\n    print(recipe, (M @ np.array(recipe)).tolist())",
  incol: "def in_column_space(A, b):\n    \"\"\"True when b is a combination of the columns of A (adding b does not raise the rank).\"\"\"\n    return int(np.linalg.matrix_rank(np.column_stack([A, b]))) == int(np.linalg.matrix_rank(A))\n\n\nfor target in [(7, 21), (7, 5), (-2, -6), (0, 0)]:\n    print(target, in_column_space(M, np.array(target)))",
  null: "n = np.array([2, -1])\nfor t in [1, 3, -2]:\n    print(t, (M @ (t * n)).tolist())\nprint((M @ np.array([1, 1])).tolist())",
  paint: "A_paint = np.array([[2, 1, 1], [4, 3, 4], [2, 4, 8]])\nprint(int(np.linalg.matrix_rank(A_paint)), bool(np.allclose(np.linalg.solve(A_paint, np.zeros(3)), 0)))",
  drone: "D = np.array([[1, 1, 3],\n              [2, 3, 7],\n              [1, 2, 4]])\nu, v, w = D[:, 0], D[:, 1], D[:, 2]\nprint((2 * u + v).tolist(), w.tolist(), int(np.linalg.matrix_rank(D)))\nfor target in [(2, 5, 3), (1, 1, 1), (0, 4, 4)]:\n    b = np.array(target)\n    print(target, int(b[0] - b[1] + b[2]), in_column_space(D, b))",
  dnull: "z = np.array([2, 1, -1])\nprint((D @ z).tolist(), (D @ (5 * z)).tolist())",
  sols: "b = np.array([2, 5, 3])\nxp = np.array([1, 1, 0])\nfor t in [0, 1, -2]:\n    x = xp + t * z\n    print(x.tolist(), (D @ x).tolist())",
  notsub: "x1, x2 = xp, xp + z\nprint((x1 + x2).tolist(), (D @ (x1 + x2)).tolist())",
  layer: "W_up = np.array([[1, 2],\n                 [0, 1],\n                 [1, 3]])\nprint(int(np.linalg.matrix_rank(W_up)), in_column_space(W_up, np.array([1, 1, 2])),\n      in_column_space(W_up, np.array([1, 1, 1])))\n\nW = np.array([[1, 1, 0],\n              [0, 1, 1]])\nblind = np.array([1, -1, 1])\nx = np.array([2, 0, 1])\nprint((W @ blind).tolist(), (W @ x).tolist(), (W @ (x + blind)).tolist())",
  claim: "claimed = np.array([2, -1, 0])\nprint((D @ claimed).tolist(), in_column_space(D, np.array([1, 1, 1])))",
};

const OUT = {
  robot: "(7, 0) [7, 21]\n(5, 1) [7, 21]\n(2, -1) [0, 0]\n(-4, 2) [0, 0]",
  incol: "(7, 21) True\n(7, 5) False\n(-2, -6) True\n(0, 0) True",
  null: "1 [0, 0]\n3 [0, 0]\n-2 [0, 0]\n[3, 9]",
  paint: "3 True",
  drone: "[3, 7, 4] [3, 7, 4] 2\n(2, 5, 3) 0 True\n(1, 1, 1) 1 False\n(0, 4, 4) 0 True",
  dnull: "[0, 0, 0] [0, 0, 0]",
  sols: "[1, 1, 0] [2, 5, 3]\n[3, 2, -1] [2, 5, 3]\n[-3, -1, 2] [2, 5, 3]",
  notsub: "[4, 3, -1] [4, 10, 6]",
  layer: "2 True False\n[0, 0] [2, 1] [2, 1]",
  claim: "[1, 1, 0] False",
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

// ---------- Demo: column space and nullspace of a 2-by-2 matrix, drawn in two planes ----------

function planeSVG({ lines = [], points = [], fill = false, title = "" }) {
  const W = 220, R = 8, s = W / (2 * R), X = (x) => W / 2 + x * s, Y = (y) => W / 2 - y * s;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${title}">`;
  if (fill) g += `<rect x="0" y="0" width="${W}" height="${W}" fill="var(--teal-soft)"/>`;
  for (let k = -R; k <= R; k += 2) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${W}"/><line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${W}"/>`;
  lines.forEach(({ d, cls }) => {
    const t = 3 * R / Math.hypot(d[0], d[1]);
    g += `<line class="ln ${cls}" x1="${X(-t * d[0])}" y1="${Y(-t * d[1])}" x2="${X(t * d[0])}" y2="${Y(t * d[1])}"/>`;
  });
  points.forEach(({ p, cls, label }) => {
    if (Math.abs(p[0]) > R || Math.abs(p[1]) > R) return;
    g += `<circle class="${cls}" cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5"/><text class="plbl ${cls}" x="${X(p[0]) + 7}" y="${Y(p[1]) - 7}">${label}</text>`;
  });
  return g + "</svg>";
}

// Column space and nullspace of [[a, b], [c, d]], and whether the target (s, t) is reachable.
function spaces2(a, b, c, d, s, t) {
  const det = a * d - b * c;
  const cols = [[a, c], [b, d]].filter((v) => v[0] !== 0 || v[1] !== 0);
  if (det !== 0) {
    const x = [(d * s - b * t) / det, (a * t - c * s) / det];
    return { rank: 2, C: "all", N: "zero", reach: true, x };
  }
  if (cols.length === 0) return { rank: 0, C: "zero", N: "all", reach: s === 0 && t === 0, x: [0, 0] };
  const dir = cols[0];
  const reach = dir[0] * t - dir[1] * s === 0;
  // nullspace direction: (b, -a) if the first row is nonzero, else (d, -c)
  const n = a !== 0 || b !== 0 ? [b, -a] : [d, -c];
  let x = null;
  if (reach) {
    if (a !== 0 || c !== 0) { const k = a !== 0 ? s / a : t / c; x = [k, 0]; } else { const k = b !== 0 ? s / b : t / d; x = [0, k]; }
  }
  return { rank: 1, C: dir, N: n, reach, x };
}

function demoSpaces(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("a", -6, 6, 1, 1)}${slider("b", -6, 6, 1, 2)}${slider("c", -6, 6, 1, 3)}${slider("d", -6, 6, 1, 6)}</div>
    <div class="la-ctrl">${slider("target east", -8, 8, 1, 2)}${slider("target north", -8, 8, 1, 6)}</div>`) +
    `<div class="la-svgrow"><figure class="fc"></figure><figure class="fn"></figure></div><p class="la-read"></p>`;
  const draw = ([a, b, c, d, s, t]) => {
    const r = spaces2(a, b, c, d, s, t);
    const C = r.C === "all" ? { fill: true } : r.C === "zero" ? {} : { lines: [{ d: r.C, cls: "A" }] };
    const N = r.N === "all" ? { fill: true } : r.N === "zero" ? {} : { lines: [{ d: r.N, cls: "C" }] };
    el.querySelector(".fc").innerHTML = planeSVG({ ...C, points: [{ p: [s, t], cls: r.reach ? "A" : "HL", label: `(${s}, ${t})` }], title: "column space" }) +
      `<figcaption>positions: <b class="A">C(A)</b> ${r.C === "all" ? "= the whole plane" : r.C === "zero" ? "= {0}" : `= line through ${vecStr(r.C)}`}</figcaption>`;
    el.querySelector(".fn").innerHTML = planeSVG({ ...N, points: r.x ? [{ p: r.x, cls: "A", label: vecStr(r.x.map(fmt)) }] : [], title: "nullspace" }) +
      `<figcaption>recipes: <b class="C">N(A)</b> ${r.N === "all" ? "= the whole plane" : r.N === "zero" ? "= {0}" : `= line through ${vecStr(r.N)}`}</figcaption>`;
    el.querySelector(".la-read").innerHTML = `A = [[${a}, ${b}], [${c}, ${d}]], rank ${r.rank}. ` + (r.reach
      ? `<b class="A">(${s}, ${t}) is in C(A)</b>: the recipe ${vecStr(r.x.map(fmt))} reaches it${r.rank < 2 ? ", and so does that recipe plus anything on the nullspace line" : ", and it is the only one"}.`
      : `<b class="NO">(${s}, ${t}) is not in C(A)</b>: no recipe reaches it.`);
  };
  if (opts.mini) {
    let k = 0;
    const tick = () => { const [s, t] = [[2, 6], [2, 1], [-2, -6], [1, 3]][k % 4]; draw([1, 2, 3, 6, s, t]); k++; };
    tick(); setInterval(tick, 2200); return;
  }
  wireSliders(el, draw);
}

// ---------- Demo: which targets can the three-button drone reach? ----------

function demoDrone(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("east b₁", -6, 6, 1, 2)}${slider("north b₂", -6, 6, 1, 5)}${slider("up b₃", -6, 6, 1, 3)}</div>
    <p class="la-read"></p>`;
  wireSliders(el, ([b1, b2, b3]) => {
    const test = b1 - b2 + b3;
    const read = el.querySelector(".la-read");
    if (test !== 0) {
      read.innerHTML = `b₁ − b₂ + b₃ = ${b1} − ${b2 < 0 ? `(${b2})` : b2} + ${b3 < 0 ? `(${b3})` : b3} = <b class="NO">${test} ≠ 0</b>: (${b1}, ${b2}, ${b3}) is off the plane C(D). No button sequence reaches it.`;
      return;
    }
    const x = [3 * b1 - b2, b2 - 2 * b1, 0];
    read.innerHTML = `b₁ − b₂ + b₃ = <b class="A">0</b>: (${b1}, ${b2}, ${b3}) is in C(D). One recipe: ${vecStr(x)} (${x[0]} × u + ${x[1]} × v). ` +
      `Every recipe: ${vecStr(x)} + t (2, 1, −1); for t = 1 that is ${vecStr([x[0] + 2, x[1] + 1, -1])}.`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Is the set of vectors (x, y) with y = 2x a subspace of R²? And with y = 2x − 4?", opts: ["Both are", "Only y = 2x", "Only y = 2x − 4", "Neither"], a: 1,
    why: "y = 2x is a line through the origin. y = 2x − 4 misses (0, 0), so it is not a subspace." },
  { q: "A 5-by-3 matrix. Where do its column space and nullspace live?", opts: ["C(A) in R⁵, N(A) in R³", "C(A) in R³, N(A) in R⁵", "Both in R⁵"], a: 0,
    why: "Columns have 5 entries (one per equation); recipes have 3 entries (one per unknown)." },
  { q: "If b is a column of A, then Ax = b has a solution.", opts: ["True", "False"], a: 0,
    why: "If b is column j, take xⱼ = 1 and all other amounts 0." },
  { q: "\"N(A) is empty when Ax = 0 has no solution.\" What is wrong?", opts: ["Nothing", "Ax = 0 always has the solution x = 0, so N(A) is never empty", "N(A) is empty only for square A"], a: 1,
    why: "A0 = 0 for every matrix: the zero vector is always in the nullspace." },
  { q: "For a reachable b, the solutions of Ax = b form a subspace.", opts: ["True", "False, unless b = 0"], a: 1,
    why: "For b ≠ 0 the zero recipe is not a solution, and the sum of two solutions reaches 2b. Only b = 0 gives a subspace: the nullspace." },
];

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  spaces: (el) => demoSpaces(el),
  spacesMini: (el) => demoSpaces(el, { mini: true }),
  drone: (el) => demoDrone(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
