// Interactive demos for LA101 Lecture 13: projection onto a line and a plane, P = A(AᵀA)⁻¹Aᵀ, closest points, removing a direction.
// Every code panel is copied from notes/L13-projections.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  robot: "import numpy as np\nfrom fractions import Fraction\n\na = np.array([1, 3])\nb = np.array([7, 5])\nx_hat = Fraction(int(a @ b), int(a @ a))\np = [x_hat * int(c) for c in a]\ne = [int(bi) - pi for bi, pi in zip(b, p)]\nprint(str(x_hat), [str(c) for c in p], [str(c) for c in e])\nprint(str(sum(ai * ei for ai, ei in zip(a.tolist(), e))))\nprint(round(float(np.linalg.norm([float(c) for c in e])), 4))",
  stops: "for amount in [1, Fraction(11, 5), 3]:\n    stop = [amount * int(c) for c in a]\n    gap = [int(bi) - si for bi, si in zip(b, stop)]\n    print(str(amount), str(sum(g * g for g in gap)), round(float(np.linalg.norm([float(g) for g in gap])), 2))",
  targets: "for target in [(14, 10), (3, 9)]:\n    t = np.array(target)\n    xh = Fraction(int(a @ t), int(a @ a))\n    print(target, str(xh), [str(xh * int(c)) for c in a])",
  pline: "P = np.outer(a, a) / (a @ a)\nprint((10 * P).astype(int).tolist(), int(np.linalg.matrix_rank(P)))\nprint([round(float(c), 4) + 0.0 for c in P @ b], [round(float(c), 4) + 0.0 for c in P @ np.array([3, -1])])\nprint(np.allclose(P @ P, P), np.allclose(P.T, P))",
  qline: "Q = np.eye(2) - P\nprint([round(float(c), 4) for c in Q @ b], np.allclose(Q @ Q, Q), np.allclose(P @ Q, 0))",
  sameline: "a2 = np.array([2, 6])\nP2 = np.outer(a2, a2) / (a2 @ a2)\nprint(np.allclose(P2, P), str(Fraction(int(a2 @ b), int(a2 @ a2))))",
  ata: "A = np.array([[1, 1], [2, 3], [1, 2]])\nb3 = np.array([1, 1, 1])\nAtA, Atb = A.T @ A, A.T @ b3\nprint(AtA.tolist(), Atb.tolist(), int(round(np.linalg.det(AtA))))\nx3 = np.linalg.solve(AtA, Atb)\np3 = A @ x3\ne3 = b3 - p3\nfrac = lambda vec: [str(Fraction(float(c)).limit_denominator(100)) for c in vec]\nprint(frac(x3), frac(p3), frac(e3))\nprint([round(float(c), 10) for c in A.T @ e3], round(float(p3[0] - p3[1] + p3[2]), 10))",
  normal: "nrm = np.array([1, -1, 1])\np_alt = b3 - (nrm @ b3) / (nrm @ nrm) * nrm\nprint(frac(p_alt), np.allclose(p_alt, p3))",
  b4: "b4 = np.array([3, 6, 4])\nprint(frac(b4 - A @ np.linalg.solve(AtA, A.T @ b4)))",
  p3: "P3 = A @ np.linalg.inv(AtA) @ A.T\nprint([frac(row) for row in P3])\nprint(int(np.linalg.matrix_rank(P3)), np.allclose(P3 @ P3, P3), np.allclose(P3.T, P3))\nprint(np.allclose(np.eye(3) - P3, np.outer(nrm, nrm) / 3))",
  ws: "A_ws = np.array([[3, 0], [7, 1], [4, 1]])\nP_ws = A_ws @ np.linalg.inv(A_ws.T @ A_ws) @ A_ws.T\nprint(np.allclose(P_ws, P3), frac(np.linalg.solve(A_ws.T @ A_ws, A_ws.T @ b3)))",
  all: "A_all = np.array([[1, 1, 3, 0], [2, 3, 7, 1], [1, 2, 4, 1]])\nprint((A_all.T @ A_all).shape, int(np.linalg.matrix_rank(A_all.T @ A_all)))",
  closest: "for amounts in [(1, 0), (0, 1), (2 / 3, 0), (1, -1 / 3)]:\n    q = A @ np.array(amounts)\n    lhs = float((b3 - q) @ (b3 - q))\n    rhs = float(e3 @ e3) + float((p3 - q) @ (p3 - q))\n    print([round(float(c), 4) for c in q], round(lhs, 4), round(rhs, 4))",
  price: "g = np.array([1, 1, 0])\nP_g = np.outer(g, g) / (g @ g)\nmenu = {\"house coffee\": np.array([1, 0, 2]), \"gold latte\": np.array([4, 3, 1]),\n        \"truffle mocha\": np.array([3, 4, 0]), \"iced tea\": np.array([0, 1, 2])}\nflavour = {k: (np.eye(3) - P_g) @ vec for k, vec in menu.items()}\n\n\ndef cos(a_, b_):\n    return float(a_ @ b_) / (float(np.linalg.norm(a_)) * float(np.linalg.norm(b_)))\n\n\nfor x1, x2 in [(\"gold latte\", \"truffle mocha\"), (\"house coffee\", \"iced tea\"), (\"gold latte\", \"house coffee\")]:\n    print(x1, \"|\", x2, round(cos(menu[x1], menu[x2]), 3), round(cos(flavour[x1], flavour[x2]), 3))\nprint([round(float(flavour[k] @ g), 10) for k in menu])",
  twice: "twice = (np.eye(3) - P_g) @ flavour[\"gold latte\"]\nprint(np.allclose(twice, flavour[\"gold latte\"]), [round(float(c), 4) for c in flavour[\"gold latte\"]])",
  claim: "u_, v_ = A[:, 0], A[:, 1]\nshortcut = (u_ @ b3) / (u_ @ u_) * u_ + (v_ @ b3) / (v_ @ v_) * v_\nprint(frac(shortcut), [round(float(c), 4) for c in A.T @ (b3 - shortcut)], int(u_ @ v_))",
};

const OUT = {
  robot: "11/5 ['11/5', '33/5'] ['24/5', '-8/5']\n0\n5.0596",
  stops: "1 40 6.32\n11/5 128/5 5.06\n3 32 5.66",
  targets: "(14, 10) 22/5 ['22/5', '66/5']\n(3, 9) 3 ['3', '9']",
  pline: "[[1, 3], [3, 9]] 1\n[2.2, 6.6] [0.0, 0.0]\nTrue True",
  qline: "[4.8, -1.6] True True",
  sameline: "True 11/10",
  ata: "[[6, 9], [9, 14]] [4, 6] 3\n['2/3', '0'] ['2/3', '4/3', '2/3'] ['1/3', '-1/3', '1/3']\n[0.0, 0.0] 0.0",
  normal: "['2/3', '4/3', '2/3'] True",
  b4: "['1/3', '-1/3', '1/3']",
  p3: "[['2/3', '1/3', '-1/3'], ['1/3', '2/3', '1/3'], ['-1/3', '1/3', '2/3']]\n2 True True\nTrue",
  ws: "True ['2/9', '-2/9']",
  all: "(4, 4) 2",
  closest: "[1.0, 2.0, 1.0] 1.0 1.0\n[1.0, 3.0, 2.0] 5.0 5.0\n[0.6667, 1.3333, 0.6667] 0.3333 0.3333\n[0.6667, 1.0, 0.3333] 0.5556 0.5556",
  price: "gold latte | truffle mocha 0.941 -0.577\nhouse coffee | iced tea 0.8 0.778\ngold latte | house coffee 0.526 0.962\n[0.0, 0.0, 0.0, 0.0]",
  twice: "True [0.5, -0.5, 1.0]",
  claim: "['23/21', '55/21', '32/21'] [-3.8571, -6.0] 9",
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

// ---------- Demo: project b onto the line through a; try other stops t·a ----------

function demoProject(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid">${slider("b₁", -2, 8, 1, 7)}${slider("b₂", -2, 8, 1, 5)}${slider("a₁", -3, 3, 1, 1)}${slider("a₂", -3, 3, 1, 3)}${slider("stop t", -1, 3, 0.1, 1)}</div>`) +
    `<div class="la-show"></div><p class="la-read"></p>`;
  const draw = ([b1, b2, a1, a2, t]) => {
    const show = el.querySelector(".la-show"), read = el.querySelector(".la-read");
    const aa = a1 * a1 + a2 * a2;
    if (!aa) { show.innerHTML = planeSVG({ R: 9 }); read.innerHTML = "a = 0 spans no line."; return; }
    const ab = a1 * b1 + a2 * b2, xh = new Q(ab, aa), x = ab / aa, p = [x * a1, x * a2], e = [b1 - p[0], b2 - p[1]];
    const s = [t * a1, t * a2], na = Math.sqrt(aa), ne = Math.hypot(...e);
    const marks = ne > 1e-9 ? [{ at: p, u: [-a1 / na, -a2 / na], v: [e[0] / ne, e[1] / ne] }] : [];
    show.innerHTML = planeSVG({ R: 9, title: "projection onto a line", lines: [{ d: [a1, a2], cls: "A" }],
      vecs: [{ v: [a1, a2], cls: "A", label: "a" }, { v: [b1, b2], cls: "C", label: "b" }, { v: e, at: p, cls: "HL", label: "e" }],
      segs: Math.abs(t - x) > 0.05 ? [{ a: s, b: [b1, b2], cls: "N" }] : [],
      points: [{ p, cls: "HL", label: "p" }, ...(Math.abs(t - x) > 0.05 ? [{ p: s, cls: "N", label: "t·a" }] : [])], marks });
    const ds = Math.hypot(b1 - s[0], b2 - s[1]);
    read.innerHTML = `x̂ = aᵀb / aᵀa = ${ab}/${aa} = <b class="HL">${xh}</b>; p = ${vecStr(p.map(fmt))}, e = ${vecStr(e.map(fmt))}, aᵀe = ${fmt(a1 * e[0] + a2 * e[1])}. ` +
      `Distance at the best stop ${ne.toFixed(2)}; at t = ${(+t).toFixed(1)}: <b class="N">${ds.toFixed(2)}</b>${ds >= ne - 1e-9 ? " ≥ " + ne.toFixed(2) : ""}.`;
  };
  if (opts.mini) { const ts = [1, 1.6, 2.2, 3, 2.2]; let k = 0; const tick = () => { draw([7, 5, 1, 3, ts[k % ts.length]]); k++; }; tick(); setInterval(tick, 1400); return; }
  wireSliders(el, draw);
}

// ---------- Demo: the normal equations AᵀA x̂ = Aᵀb for a 3 × 2 matrix, in exact fractions ----------

function demoNormal(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in A" style="width:12em" value="1 1; 2 3; 1 2"></label>
    <label>b = <input class="la-in b" style="width:7em" value="1 1 1"></label></div>
    <p class="hint">Three rows, two independent columns; rows separated by ";".</p><div class="la-eq la-show"></div><p class="la-read"></p>`;
  const [iA, ib] = [el.querySelector(".A"), el.querySelector(".b")];
  const go = () => {
    const A = parseMat(iA.value), b = parseVec(ib.value), show = el.querySelector(".la-show"), read = el.querySelector(".la-read");
    if (!okMat(A) || A.length !== 3 || A[0].length !== 2 || b.length !== 3 || !b.every(Number.isInteger)) {
      show.innerHTML = ""; read.innerHTML = "Enter a 3 × 2 integer matrix and three integers for b."; return;
    }
    const At = [0, 1].map((j) => A.map((r) => r[j]));
    const G = At.map((r) => [0, 1].map((j) => r.reduce((s, v, i) => s + v * A[i][j], 0))), Atb = At.map((r) => r.reduce((s, v, i) => s + v * b[i], 0));
    const det = G[0][0] * G[1][1] - G[0][1] * G[1][0];
    if (!det) { show.innerHTML = `AᵀA = ${matHTML(G)}`; read.innerHTML = "The columns are dependent: AᵀA is singular. Use one column (a line)."; return; }
    const xh = [new Q(G[1][1] * Atb[0] - G[0][1] * Atb[1], det), new Q(G[0][0] * Atb[1] - G[1][0] * Atb[0], det)];
    const p = mulVec(A, xh), e = b.map((v, i) => q(v).sub(p[i])), Ate = At.map((r) => r.reduce((s, v, i) => s.add(q(v).mul(e[i])), q(0)));
    show.innerHTML = `AᵀA = ${matHTML(G)} Aᵀb = ${vecStr(Atb)}`;
    read.innerHTML = `x̂ = <b class="HL">${vecStr(xh)}</b>; p = Ax̂ = <b class="A">${vecStr(p)}</b>; e = b − p = <b class="C">${vecStr(e)}</b>; ` +
      `Aᵀe = ${vecStr(Ate)} (perpendicular to both columns).`;
  };
  iA.addEventListener("input", go); ib.addEventListener("input", go);
  go();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Project (4, 2) onto the line through (1, 0), then onto the line through (0, 1).", opts: ["(4, 0) and (0, 2)", "(4, 2) and (4, 2)", "(2, 0) and (0, 4)"], a: 0,
    why: "Projecting onto an axis keeps that coordinate." },
  { q: "If P is a projection matrix, so is P².", opts: ["True", "False"], a: 0,
    why: "P² = P: projecting twice changes nothing." },
  { q: "With p = Pb and e = b − p, what are Pp and Pe?", opts: ["p and 0", "p and e", "0 and e"], a: 0,
    why: "p is already in the subspace; e is perpendicular to it." },
  { q: "\"P = A(AᵀA)⁻¹Aᵀ = AA⁻¹(Aᵀ)⁻¹Aᵀ = I.\" What is wrong?", opts: ["Nothing", "A is 3 × 2: A⁻¹ does not exist and the inverse cannot be split; P has rank 2"], a: 1,
    why: "(AᵀA)⁻¹ = A⁻¹(Aᵀ)⁻¹ needs square invertible A." },
];

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  project: (el) => demoProject(el),
  projectMini: (el) => demoProject(el, { mini: true }),
  normal: (el) => demoNormal(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
