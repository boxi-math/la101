// Interactive demos for LA101 Lecture 14: least squares.
// Every code panel is copied from notes/L14-least-squares.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  cafe: "import numpy as np\nfrom fractions import Fraction\n\nt = np.array([0, 1, 2, 3])\nb = np.array([2, 3, 5, 6])\nA = np.column_stack([np.ones(4, dtype=int), t])\nprint(A.tolist())\nprint(int(np.linalg.matrix_rank(A)), int(np.linalg.matrix_rank(np.column_stack([A, b]))))",
  normal: "AtA, Atb = A.T @ A, A.T @ b\nx_hat = np.linalg.solve(AtA, Atb)\np = A @ x_hat\ne = b - p\nfr = lambda vec: [str(Fraction(float(c)).limit_denominator(1000)) for c in vec]\nprint(AtA.tolist(), Atb.tolist())\nprint(fr(x_hat), [round(float(c), 4) for c in p], [round(float(c), 4) for c in e])\nprint(round(float(e @ e), 4), [round(float(c), 10) + 0.0 for c in A.T @ e])",
  forecast: "print(round(float(x_hat[0] + 4 * x_hat[1]), 4))",
  calculus: "def E(C, D):\n    return sum((C + D * ti - yi) ** 2 for ti, yi in zip(t.tolist(), b.tolist()))\n\n\ndef grad(C, D):\n    r = [C + D * ti - yi for ti, yi in zip(t.tolist(), b.tolist())]\n    return 2 * sum(r), 2 * sum(ri * ti for ri, ti in zip(r, t.tolist()))\n\n\nC0, D0 = Fraction(19, 10), Fraction(7, 5)\nprint([str(g) for g in grad(C0, D0)], str(E(C0, D0)))\nprint([str(E(C0 + dc, D0 + dd)) for dc, dd in [(Fraction(1, 10), 0), (0, Fraction(1, 10)), (Fraction(1, 10),\n                                                                                          Fraction(-1, 10))]])",
  centre: "s = t - 1.5\nAs = np.column_stack([np.ones(4), s])\nprint((As.T @ As).tolist(), fr(np.linalg.solve(As.T @ As, As.T @ b)))\nprint(round(float(b.mean()), 4), str(Fraction(float(s @ b) / float(s @ s)).limit_denominator(100)))",
  columns: "A2 = np.column_stack([np.ones(4), t, t ** 2])\nx2 = np.linalg.solve(A2.T @ A2, A2.T @ b)\ne2 = b - A2 @ x2\nA3 = np.column_stack([np.ones(4), t, t ** 2, t ** 3])\nx3 = np.linalg.solve(A3, b)\nprint(fr(x2), round(float(e2 @ e2), 4))\nprint(fr(x3), round(float(x3 @ np.array([1, 4, 16, 64])), 4), round(float(x_hat @ np.array([1, 4])), 4))",
  festival: "b_fest = np.array([2, 3, 5, 12])\nx_fest = np.linalg.solve(AtA, A.T @ b_fest)\ne_fest = b_fest - A @ x_fest\nprint(fr(x_fest), [round(float(c), 4) for c in e_fest])",
  survey: "Ainc = np.array([[-1, 1, 0, 0, 0], [0, -1, 1, 0, 0], [-1, 0, 1, 0, 0],\n                 [0, 0, -1, 1, 0], [0, 0, 0, -1, 1], [0, 0, -1, 0, 1]])\nAg = Ainc[:, 1:]\nclimbs = np.array([4, -1, 3, 7, -2, 6])\nh = np.linalg.solve(Ag.T @ Ag, Ag.T @ climbs)\nfit = Ag @ h\nprint(fr(h))\nprint(fr(fit), fr(climbs - fit))",
  lstsq: "w, res, rank, sv = np.linalg.lstsq(A.astype(float), b.astype(float), rcond=None)\nprint(fr(w), [round(float(r), 4) for r in res], int(rank))",
  gd: "wg = np.zeros(2)\nfor step in range(2000):\n    wg -= 0.05 * (2 / 4) * A.T @ (A @ wg - b)\nprint([round(float(c), 4) for c in wg])",
  claim: "centred = np.column_stack([t - t.mean(), b - b.mean()])\nnormal = np.linalg.svd(centred)[2][-1]\nslope = -normal[0] / normal[1]\nclaimed = np.round([b.mean() - slope * t.mean(), slope], 2)\nprint(claimed.tolist())\nr_claimed = b - A @ claimed\nprint([round(float(c), 4) + 0.0 for c in A.T @ r_claimed], round(float(r_claimed @ r_claimed), 4),\n      round(float(e @ e), 4))",
};

const OUT = {
  cafe: "[[1, 0], [1, 1], [1, 2], [1, 3]]\n2 3",
  normal: "[[4, 6], [6, 14]] [16, 31]\n['19/10', '7/5'] [1.9, 3.3, 4.7, 6.1] [0.1, -0.3, 0.3, -0.1]\n0.2 [0.0, 0.0]",
  forecast: "7.5",
  calculus: "['0', '0'] 1/5\n['6/25', '17/50', '13/50']",
  centre: "[[4.0, 0.0], [0.0, 5.0]] ['4', '7/5']\n4.0 7/5",
  columns: "['19/10', '7/5', '0'] 0.2\n['2', '-1/6', '3/2', '-1/3'] 4.0 7.5",
  festival: "['7/10', '16/5'] [1.3, -0.9, -2.1, 1.7]",
  survey: "['4', '3', '31/3', '26/3']\n['4', '-1', '3', '22/3', '-5/3', '17/3'] ['0', '0', '0', '-1/3', '-1/3', '1/3']",
  lstsq: "['19/10', '7/5'] [0.2] 2",
  gd: "[1.9, 1.4]",
  claim: "[1.87, 1.42]\n[0.0, -0.1] 0.202 0.2",
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

// ---------- Demo: the best line through four points, with its vertical gaps ----------

function fitSVG(t, y, C, D, opts = {}) {
  const W = 300, H = 220, x0 = -0.5, x1 = 4.5, ymax = Math.max(8, ...y.map((v) => v + 1)), ymin = Math.min(0, ...y.map((v) => v - 1));
  const X = (x) => ((x - x0) / (x1 - x0)) * W, Y = (v) => H - ((v - ymin) / (ymax - ymin)) * H;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="least-squares line">`;
  for (let k = 0; k <= 4; k++) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${H}"/>`;
  for (let k = Math.ceil(ymin); k <= ymax; k += 2) g += `<line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${H}"/>`;
  g += `<line class="ln A" x1="${X(x0)}" y1="${Y(C + D * x0)}" x2="${X(x1)}" y2="${Y(C + D * x1)}"/>`;
  t.forEach((ti, i) => {
    g += `<line class="ln C" stroke-dasharray="4 3" x1="${X(ti)}" y1="${Y(y[i])}" x2="${X(ti)}" y2="${Y(C + D * ti)}"/>`;
    g += `<circle class="HL" cx="${X(ti)}" cy="${Y(y[i])}" r="4.5"/>`;
  });
  if (opts.forecast) g += `<circle class="A" cx="${X(4)}" cy="${Y(C + 4 * D)}" r="4.5"/><text class="plbl A" x="${X(4) - 30}" y="${Y(C + 4 * D) - 8}">${fmt(C + 4 * D)}</text>`;
  return g + "</svg>";
}

// Normal equations for a line through (t_i, y_i): [[n, Σt], [Σt, Σt²]] x = [Σy, Σty].
function lineFit(t, y) {
  const n = t.length, st = t.reduce((a, b) => a + b, 0), stt = t.reduce((a, b) => a + b * b, 0);
  const sy = y.reduce((a, b) => a + b, 0), sty = t.reduce((a, b, i) => a + b * y[i], 0);
  const det = n * stt - st * st, C = (stt * sy - st * sty) / det, D = (n * sty - st * sy) / det;
  const e = y.map((v, i) => v - (C + D * t[i]));
  return { st, stt, sy, sty, C, D, e, E: e.reduce((a, b) => a + b * b, 0) };
}

function demoFit(el, opts = {}) {
  const t = [0, 1, 2, 3];
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("week 0", 0, 12, 0.5, 2)}${slider("week 1", 0, 12, 0.5, 3)}${slider("week 2", 0, 12, 0.5, 5)}${slider("week 3", 0, 12, 0.5, 6)}</div>`) +
    `<div class="la-svgrow"><figure class="ff"></figure></div><p class="la-read"></p>`;
  const r2 = (v) => fmt(Math.round(v * 1000) / 1000);
  const draw = (y) => {
    const f = lineFit(t, y);
    el.querySelector(".ff").innerHTML = fitSVG(t, y, f.C, f.D, { forecast: true }) + `<figcaption>sales (hundreds of cups) in weeks 0–3, the best line, its vertical gaps and the week-4 forecast</figcaption>`;
    el.querySelector(".la-read").innerHTML = `Normal equations: [[4, ${f.st}], [${f.st}, ${f.stt}]] x̂ = (${r2(f.sy)}, ${r2(f.sty)}). ` +
      `<b class="A">y = ${r2(f.C)} + ${r2(f.D)}t</b>. Residuals e = ${vecStr(f.e.map(r2))}, they add to ${r2(f.e.reduce((a, b) => a + b, 0)) || 0}; ` +
      `‖e‖² = <b class="C">${r2(f.E)}</b>. Week 4: ${r2(f.C + 4 * f.D)}.`;
  };
  if (opts.mini) {
    const sets = [[2, 3, 5, 6], [2, 3, 5, 12], [2, 3, 4, 5]];
    let k = 0;
    const tick = () => { draw(sets[k % sets.length]); k++; };
    tick(); setInterval(tick, 2600); return;
  }
  wireSliders(el, draw);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "For the best line through the café's four points, what is the sum of the residuals?", opts: ["0", "0.2", "It depends on the data"], a: 0,
    why: "With an intercept, the column of ones gives 1ᵀe = 0." },
  { q: "The least-squares solution x̂ satisfies Ax̂ = b.", opts: ["True", "False, unless b is in C(A)"], a: 1,
    why: "Ax̂ = p, the projection of b; b − p = e is not zero." },
  { q: "The best constant y = C for the sales (2, 3, 5, 6) is", opts: ["2", "4", "6"], a: 1,
    why: "AᵀA = 4, Aᵀb = 16: the best constant is the mean." },
  { q: "A fit has e = 0. What does that say about b?", opts: ["Nothing", "b is in the column space: the system had an exact solution"], a: 1,
    why: "e = b − p = 0 means b = p ∈ C(A)." },
  { q: "Adding a t² column to the café line lowers the error.", opts: ["Always", "Never raises it; here it stays 0.2"], a: 1,
    why: "A bigger column space can only bring p closer. Here e is already perpendicular to t², so nothing changes." },
];

const DEMOS = {
  fit: (el) => demoFit(el),
  fitMini: (el) => demoFit(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
