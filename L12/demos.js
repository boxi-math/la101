// Interactive demos for LA101 Lecture 12: dot products, angles, orthogonal subspaces, complements and cosine similarity.
// Every code panel is copied from notes/L12-orthogonality.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  dot: "import numpy as np\nfrom fractions import Fraction\n\nu = np.array([1, 2, 1])\nv = np.array([1, 3, 2])\nprint(int(u @ v), int(u @ u), int(v @ v))\nprint(round(float(np.linalg.norm(u)), 4), round(float(np.linalg.norm(v)), 4))\nunit_u = u / np.linalg.norm(u)\nprint([round(float(c), 4) for c in unit_u], round(float(np.linalg.norm(unit_u)), 4))",
  gram: "D2 = np.column_stack([u, v])\nprint((D2.T @ D2).tolist())",
  cosine: "def cosine(a, b):\n    return float(a @ b) / (float(np.linalg.norm(a)) * float(np.linalg.norm(b)))\n\n\nc_uv = cosine(u, v)\nprint(round(c_uv, 4), round(float(np.degrees(np.arccos(c_uv))), 1))\nprint(round(float(np.linalg.norm(u) * np.linalg.norm(v)), 4))",
  perp: "row = np.array([1, 2])\nnull = np.array([2, -1])\nprint(int(row @ null))\ns = row + null\nprint(s.tolist(), int(s @ s), int(row @ row) + int(null @ null))",
  subs: "A = np.array([[1, 1, 3, 0],\n              [2, 3, 7, 1],\n              [1, 2, 4, 1]])\nrow_basis = np.array([[1, 0, 2, -1], [0, 1, 1, 1]])     # nonzero rows of R (Lecture 10)\nnull_basis = np.array([[-2, -1, 1, 0], [1, -1, 0, 1]])  # special solutions (Lecture 7)\ny = np.array([1, -1, 1])                                # left nullspace (Lecture 10)\nprint((row_basis @ null_basis.T).tolist())\nprint((A @ null_basis.T).tolist())\nprint((y @ A).tolist())",
  basis4: "basis4 = np.column_stack([row_basis.T, null_basis.T])\nprint(int(np.linalg.matrix_rank(basis4)), int(np.linalg.matrix_rank(row_basis)) + int(np.linalg.matrix_rank(null_basis)))",
  planes: "n1, n2 = np.array([1, -1, 1]), np.array([1, 1, 0])\nshared = np.cross(n1, n2)\nprint(int(n1 @ n2), shared.tolist(), int(n1 @ shared), int(n2 @ shared), int(shared @ shared))",
  split: "x = np.array([1, 1, 0, 0])\namounts = np.linalg.solve(basis4, x)\nx_r = row_basis.T @ amounts[:2]\nx_n = null_basis.T @ amounts[2:]\nas_frac = lambda vec: [str(Fraction(float(c)).limit_denominator(100)) for c in vec]\nprint(as_frac(x_r), as_frac(x_n))\nprint(abs(round(float(x_r @ x_n), 10)), (A @ x).tolist(), [round(float(c), 10) for c in A @ x_r])\nprint([round(float(c), 4) for c in x_r])",
  splitlen: "print(round(float(np.linalg.norm(x_r)), 4), round(float(np.linalg.norm(x)), 4),\n      round(float(x_r @ x_r + x_n @ x_n), 4), int(x @ x))",
  splitsame: "x2 = np.array([0, 2, 0, -1])\namounts2 = np.linalg.solve(basis4, x2)\nprint(as_frac(row_basis.T @ amounts2[:2]))",
  cafe: "X = np.array([[2, 0, 4, 2, 4],\n              [2, 4, 2, 0, 0],\n              [2, 2, 3, 1, 2],\n              [3, 4, 4, 1, 2]])\ndrinks = [\"latte\", \"espresso\", \"mocha\", \"tea\", \"cocoa\"]\ncols = {d: X[:, j] for j, d in enumerate(drinks)}\nfor a, b in [(\"tea\", \"cocoa\"), (\"latte\", \"mocha\"), (\"espresso\", \"tea\"), (\"espresso\", \"cocoa\")]:\n    print(a, b, round(cosine(cols[a], cols[b]), 3))\nprint(cols[\"tea\"].tolist(), cols[\"cocoa\"].tolist())",
  unit: "unit = {d: c / np.linalg.norm(c) for d, c in cols.items()}\nprint(round(float(unit[\"espresso\"] @ unit[\"tea\"]), 3), round(cosine(cols[\"espresso\"], cols[\"tea\"]), 3))\nprint(round(float(np.linalg.norm(cols[\"tea\"])), 3), round(float(np.linalg.norm(cols[\"cocoa\"])), 3))",
  claim: "print(A.shape, row_basis.shape[1], A[:, 0].shape[0])",
};

const OUT = {
  dot: "9 6 14\n2.4495 3.7417\n[0.4082, 0.8165, 0.4082] 1.0",
  gram: "[[6, 9], [9, 14]]",
  cosine: "0.982 10.9\n9.1652",
  perp: "0\n[3, 1] 10 10",
  subs: "[[0, 0], [0, 0]]\n[[0, 0], [0, 0], [0, 0]]\n[0, 0, 0, 0]",
  basis4: "4 4",
  planes: "0 [-1, 1, 2] 0 0 6",
  split: "['2/17', '5/17', '9/17', '3/17'] ['15/17', '12/17', '-9/17', '-3/17']\n0.0 [2, 5, 3] [2.0, 5.0, 3.0]\n[0.1176, 0.2941, 0.5294, 0.1765]",
  splitlen: "0.6417 1.4142 2.0 2",
  splitsame: "['2/17', '5/17', '9/17', '3/17']",
  cafe: "tea cocoa 1.0\nlatte mocha 0.976\nespresso tea 0.408\nespresso cocoa 0.408\n[2, 0, 1, 1] [4, 0, 2, 2]",
  unit: "0.408 0.408\n2.449 4.899",
  claim: "(3, 4) 4 3",
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

// ---------- A small SVG coordinate plane: vectors (arrows), lines through 0, points, dashed segments ----------

function planeSVG({ R = 8, vecs = [], lines = [], points = [], segs = [], marks = [], title = "" }) {
  const W = 260, s = W / (2 * R), X = (x) => W / 2 + x * s, Y = (y) => W / 2 - y * s;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${title}">`;
  for (let k = -R; k <= R; k += 1) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${W}"/><line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${W}"/>`;
  lines.forEach(({ d, cls }) => {
    const n = Math.hypot(d[0], d[1]);
    if (!n) return;
    const t = 3 * R / n;
    g += `<line class="ln ${cls} DIM" x1="${X(-t * d[0])}" y1="${Y(-t * d[1])}" x2="${X(t * d[0])}" y2="${Y(t * d[1])}"/>`;
  });
  segs.forEach(({ a, b, cls }) => { g += `<line class="ln ${cls}" stroke-dasharray="5 4" x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}"/>`; });
  marks.forEach(({ at, u, v }) => {   // right-angle mark at "at" between unit directions u and v
    const k = 0.45, p1 = [at[0] + k * u[0], at[1] + k * u[1]], p2 = [p1[0] + k * v[0], p1[1] + k * v[1]], p3 = [at[0] + k * v[0], at[1] + k * v[1]];
    g += `<polyline fill="none" stroke="var(--ink-2)" stroke-width="1.2" points="${X(p1[0])},${Y(p1[1])} ${X(p2[0])},${Y(p2[1])} ${X(p3[0])},${Y(p3[1])}"/>`;
  });
  vecs.forEach(({ v, at = [0, 0], cls, label }) => {
    const x1 = X(at[0]), y1 = Y(at[1]), x2 = X(at[0] + v[0]), y2 = Y(at[1] + v[1]);
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 9;
    g += `<line class="vec ${cls}" x1="${x1}" y1="${y1}" x2="${x2 - ux * h * 0.6}" y2="${y2 - uy * h * 0.6}"/>`;
    g += `<polygon class="${cls}" points="${x2},${y2} ${x2 - ux * h - uy * h * 0.5},${y2 - uy * h + ux * h * 0.5} ${x2 - ux * h + uy * h * 0.5},${y2 - uy * h - ux * h * 0.5}"/>`;
    if (label) g += `<text class="vlbl ${cls}" x="${(x1 + x2) / 2 - uy * 12 - 4}" y="${(y1 + y2) / 2 + ux * 12 + 4}">${label}</text>`;
  });
  points.forEach(({ p, cls, label }) => {
    if (Math.abs(p[0]) > R || Math.abs(p[1]) > R) return;
    g += `<circle class="${cls}" cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5"/>`;
    if (label) g += `<text class="plbl ${cls}" x="${X(p[0]) + 7}" y="${Y(p[1]) - 7}">${label}</text>`;
  });
  return g + "</svg>";
}

// ---------- Demo: two vectors in the plane: dot product, lengths, cosine, angle ----------

function demoAngle(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid">${slider("a₁", -6, 6, 1, 1)}${slider("a₂", -6, 6, 1, 2)}${slider("b₁", -6, 6, 1, 2)}${slider("b₂", -6, 6, 1, -1)}</div>`) +
    `<div class="la-show"></div><p class="la-read"></p>`;
  const draw = ([a1, a2, b1, b2]) => {
    const d = a1 * b1 + a2 * b2, na = Math.hypot(a1, a2), nb = Math.hypot(b1, b2);
    const marks = d === 0 && na && nb ? [{ at: [0, 0], u: [a1 / na, a2 / na], v: [b1 / nb, b2 / nb] }] : [];
    el.querySelector(".la-show").innerHTML = planeSVG({ R: 7, title: "two vectors",
      vecs: [{ v: [a1, a2], cls: "A", label: "a" }, { v: [b1, b2], cls: "C", label: "b" }], marks });
    const read = el.querySelector(".la-read");
    if (!na || !nb) { read.innerHTML = "The zero vector has no direction: its dot product with everything is 0."; return; }
    const c = d / (na * nb), deg = (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
    const par = (v) => (v < 0 ? `(${v})` : `${v}`);
    read.innerHTML = `a·b = ${a1}·${par(b1)} + ${a2}·${par(b2)} = <b class="HL">${d}</b>; ‖a‖ = ${na.toFixed(3)}, ‖b‖ = ${nb.toFixed(3)}; ` +
      `cos θ = ${c.toFixed(3)}, θ = ${deg.toFixed(1)}°. ` +
      (d === 0 ? `<b class="C">Perpendicular</b>: ‖a + b‖² = ${(a1 + b1) ** 2 + (a2 + b2) ** 2} = ‖a‖² + ‖b‖².` : d > 0 ? "Less than 90°." : "More than 90°.");
  };
  if (opts.mini) {
    const pairs = [[1, 2, 2, -1], [1, 2, 3, 1], [3, 1, -1, 3], [2, 2, -3, 1], [1, 2, 2, 4]];
    let k = 0; const tick = () => { draw(pairs[k % pairs.length]); k++; }; tick(); setInterval(tick, 1800); return;
  }
  wireSliders(el, draw);
}

// ---------- Demo: cosine similarity of the cafe drinks (columns of the ratings table) ----------

const CAFE = [[2, 0, 4, 2, 4], [2, 4, 2, 0, 0], [2, 2, 3, 1, 2], [3, 4, 4, 1, 2]];
const DRINKS = ["latte", "espresso", "mocha", "tea", "cocoa"];

function demoCafe(el) {
  const col = (j) => CAFE.map((r) => r[j]);
  const cos = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0) / (Math.hypot(...a) * Math.hypot(...b));
  let h = `<table><tr><th></th>${DRINKS.map((d) => `<th>${d}</th>`).join("")}</tr>`;
  DRINKS.forEach((d, i) => {
    h += `<tr><th>${d}</th>` + DRINKS.map((_, j) => {
      const c = cos(col(i), col(j));
      return `<td style="background:rgba(80,120,220,${(Math.max(0, c) ** 3 * 0.45).toFixed(2)})">${c.toFixed(3)}</td>`;
    }).join("") + "</tr>";
  });
  el.innerHTML = h + `</table><p class="la-read">Tea and cocoa score <b class="HL">1.000</b>: every customer rates cocoa twice tea, the same direction but not the same vector. Espresso is least like tea and cocoa (0.408).</p>`;
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "The lengths of (2, −1, 2) and (1, 1, 1, 1)?", opts: ["3 and 2", "3 and 4", "√5 and 2"], a: 0,
    why: "√(4 + 1 + 4) = 3 and √4 = 2." },
  { q: "If a·b = 0 and b·c = 0, then a·c = 0.", opts: ["True", "False"], a: 1,
    why: "a = c = (1, 0) and b = (0, 1): a·c = 1." },
  { q: "A 5 × 8 matrix has rank 3. The orthogonal complement of its row space has dimension…", opts: ["2", "3", "5"], a: 2,
    why: "The complement is the nullspace: n − r = 8 − 3 = 5." },
  { q: "\"The cosine similarity of (1, 2) and (3, 6) is a·b = 15.\" What is wrong?", opts: ["Nothing", "It must be divided by both lengths: 15/(√5·√45) = 1"], a: 1,
    why: "A cosine is always between −1 and 1." },
];

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  angle: (el) => demoAngle(el),
  angleMini: (el) => demoAngle(el, { mini: true }),
  cafe: (el) => demoCafe(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
