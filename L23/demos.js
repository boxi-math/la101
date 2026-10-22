// Interactive demos for LA101 Lecture 23: minima and quadratic forms.
// Every code panel is copied from notes/L23-positive-definite-minima.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  crit: "import numpy as np\nfrom fractions import Fraction as Fr\n\n\ndef f(x, y):\n    return Fr(1, 3) * x**3 + x**2 + 2 * x * y + y**2 - 4 * x\n\n\ndef grad(x, y):\n    return (x**2 + 2 * x + 2 * y - 4, 2 * x + 2 * y)\n\n\ndef hess(x, y):\n    return np.array([[2 * x + 2, 2], [2, 2]])\n\n\nfor p in [(2, -2), (-2, 2)]:\n    H = hess(*p)\n    print(p, grad(*p), str(f(*p)), H.tolist(), round(float(np.linalg.det(H)), 10),\n          np.round(np.linalg.eigvalsh(H), 4).tolist())",
  taylor: "h = (Fr(1, 10), Fr(1, 20))\nrise = f(2 + h[0], -2 + h[1]) - f(2, -2)\nquad = Fr(1, 2) * (6 * h[0] ** 2 + 2 * 2 * h[0] * h[1] + 2 * h[1] ** 2)\nprint(float(rise), float(quad))\nw, V = np.linalg.eigh(hess(-2, 2).astype(float))\nd = 0.1 * V[:, 0]\nprint(round(float(w[0]), 4), float(f(-2 + d[0], 2 + d[1]) - f(-2, 2)) < 0)",
  saddle: "g = lambda x, y: x**2 + 4 * x * y + y**2\nprint(g(1, -1), np.linalg.eigvalsh(np.array([[2, 4], [4, 2]])).tolist())",
  rayleigh: "C = np.array([[5.0, 2.0], [2.0, 2.0]])\n\n\ndef rayleigh(S, x):\n    x = np.asarray(x, dtype=float)\n    return float(x @ S @ x / (x @ x))\n\n\nprint([rayleigh(C, x) for x in [(1, 0), (2, 1), (1, -2), (3, -1)]])\ntheta = np.linspace(0, np.pi, 1801)\nR = [rayleigh(C, (np.cos(t), np.sin(t))) for t in theta]\nbest = theta[int(np.argmax(R))]\nprint(round(max(R), 4), round(min(R), 4), round(float(np.tan(best)), 2))",
  power: "x = np.array([1.0, 0.0])\nfor k in range(1, 6):\n    x = C @ x\n    x = x / np.linalg.norm(x)\n    print(k, round(rayleigh(C, x), 6), round(float(np.degrees(np.arccos(abs(x @ [2, 1]) / np.sqrt(5)))), 3))",
  gd: "b = C @ np.array([1.0, 1.0])\nfor eta in [0.1, 2 / 7, 0.34]:\n    w = np.zeros(2)\n    for k in range(50):\n        w = w - eta * (C @ w - b)\n    print(round(eta, 4), [round(1 - 6 * eta, 4), round(1 - eta, 4)], f\"{np.linalg.norm(w - 1):.2e}\")",
  axes: "q = lambda x, y: 5 * x**2 + 4 * x * y + 2 * y**2\nq1, q2 = np.array([2, 1]) / np.sqrt(5), np.array([1, -2]) / np.sqrt(5)\nQ = np.column_stack([q1, q2])\nprint((np.round(Q.T @ C @ Q, 10) + 0.0).tolist())\nfor name, pt in [(\"1*q1\", 1 * q1), (\"sqrt6*q2\", np.sqrt(6) * q2)]:\n    print(name, np.round(pt, 4).tolist(), round(q(*pt), 10))\ny1, y2 = 0.3, -1.7\nx_ = Q @ [y1, y2]\nprint(round(q(*x_), 10), round(6 * y1**2 + y2**2, 10))",
  conics: "def signs(S):\n    w = np.linalg.eigvalsh(np.asarray(S, dtype=float))\n    return \"\".join(\"+\" if v > 1e-12 else \"-\" if v < -1e-12 else \"0\" for v in w[::-1])\n\n\nnames = {\"++\": \"ellipse\", \"+-\": \"hyperbola\", \"+0\": \"parallel lines\", \"--\": \"no points\", \"-0\": \"no points\",\n         \"+++\": \"ellipsoid\", \"++-\": \"one sheet\", \"+--\": \"two sheets\", \"---\": \"no points\"}\nfor S in [C, [[1, 3], [3, 1]], [[2, 4], [4, 8]], [[2, 1, 1], [1, 2, 1], [1, 1, 2]],\n          [[0, 1, 0], [1, 0, 0], [0, 0, 1]], [[0, -1, 0], [-1, 0, 0], [0, 0, -1]]]:\n    print(signs(S), names[signs(S)])",
  inertia: "M = np.array([[1.0, 3.0], [3.0, 1.0]])\nL = np.array([[1.0, 0.0], [3.0, 1.0]])\nD = np.linalg.inv(L) @ M @ np.linalg.inv(L).T\nprint((np.round(D, 10) + 0.0).tolist(), np.linalg.eigvalsh(M).tolist())\nfor B in [np.array([[2.0, 1.0], [1.0, 3.0]]), np.array([[1.0, 5.0], [0.0, 1.0]]), np.array([[0.1, 0.0], [4.0, 7.0]])]:\n    print(B.tolist(), np.round(np.linalg.eigvalsh(B.T @ M @ B), 4).tolist(), signs(B.T @ M @ B))",
  claim: "typo = np.array([[6.0, 4.0], [2.0, 2.0]])\nprint(np.round(np.linalg.eigvalsh(typo), 4).tolist(), np.round(np.linalg.eigvalsh(hess(2, -2).astype(float)), 4).tolist())\nprint(sorted(np.round(np.linalg.eigvals(typo).real, 4).tolist()), np.allclose(typo, typo.T))",
};

const OUT = {
  crit: "(2, -2) (0, 0) -16/3 [[6, 2], [2, 2]] 8.0 [1.1716, 6.8284]\n(-2, 2) (0, 0) 16/3 [[-2, 2], [2, 2]] -8.0 [-2.8284, 2.8284]",
  taylor: "0.042833333333333334 0.0425\n-2.8284 True",
  saddle: "-2 [-2.0, 6.0]",
  rayleigh: "[5.0, 6.0, 1.0, 3.5]\n6.0 1.0 0.5",
  power: "1 5.965517 4.764\n2 5.999036 0.796\n3 5.999973 0.133\n4 5.999999 0.022\n5 6.0 0.004",
  gd: "0.1 [0.4, 0.9] 2.30e-03\n0.2857 [-0.7143, 0.7143] 6.98e-08\n0.34 [-1.04, 0.66] 9.53e+00",
  axes: "[[6.0, 0.0], [0.0, 1.0]]\n1*q1 [0.8944, 0.4472] 6.0\nsqrt6*q2 [1.0954, -2.1909] 6.0\n3.43 3.43",
  conics: "++ ellipse\n+- hyperbola\n+0 parallel lines\n+++ ellipsoid\n++- one sheet\n+-- two sheets",
  inertia: "[[1.0, 0.0], [0.0, -8.0]] [-2.0, 4.0]\n[[2.0, 1.0], [1.0, 3.0]] [-4.0754, 49.0754] +-\n[[1.0, 5.0], [0.0, 1.0]] [-0.14, 57.14] +-\n[[0.1, 0.0], [4.0, 7.0]] [-0.0581, 67.4681] +-",
  claim: "[1.1716, 6.8284] [1.1716, 6.8284]\n[0.5359, 7.4641] False",
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

// ---------- 2 × 2 symmetric matrices: eigenvalues, eigenvectors, a plane to draw on ----------

const r3 = (v) => { const x = Math.round(v * 1000) / 1000; return Object.is(x, -0) ? 0 : x; };
const num = (v) => String(r3(v)).replace("-", "−");

// S = [[a, b], [b, c]]: eigenvalues l1 >= l2 and unit eigenvectors q1, q2 (perpendicular).
function eigSym(a, b, c) {
  const m = (a + c) / 2, d = Math.hypot((a - c) / 2, b);
  const l1 = m + d, l2 = m - d;
  let q1 = Math.abs(b) > 1e-12 ? [b, l1 - a] : a >= c ? [1, 0] : [0, 1];
  const n = Math.hypot(q1[0], q1[1]);
  q1 = [q1[0] / n, q1[1] / n];
  if (q1[0] < 0 || (q1[0] === 0 && q1[1] < 0)) q1 = [-q1[0], -q1[1]];
  return { l1, l2, q1, q2: [q1[1], -q1[0]] };
}

function plane(R, W = 260) {
  const s = W / (2 * R), X = (x) => W / 2 + x * s, Y = (y) => W / 2 - y * s;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img">`;
  for (let k = -R; k <= R; k++) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${W}"/><line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${W}"/>`;
  const path = (pts, cls, extra = "") => `<polyline points="${pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" class="${cls}" style="fill:none" stroke-width="2" ${extra}/>`;
  const vec = (v, cls, lbl) => `<line class="vec ${cls}" x1="${X(0)}" y1="${Y(0)}" x2="${X(v[0])}" y2="${Y(v[1])}"/>` +
    (lbl ? `<text class="vlbl ${cls}" x="${X(v[0]) + 5}" y="${Y(v[1]) - 5}">${lbl}</text>` : "");
  const line = (d, cls) => `<line class="${cls}" x1="${X(-R * 1.5 * d[0])}" y1="${Y(-R * 1.5 * d[1])}" x2="${X(R * 1.5 * d[0])}" y2="${Y(R * 1.5 * d[1])}" stroke-dasharray="4 4" stroke-width="1"/>`;
  return { open: g, close: "</svg>", path, vec, line, clip: (pts) => pts.filter(([x, y]) => Math.abs(x) <= R * 1.2 && Math.abs(y) <= R * 1.2) };
}

// ---------- Demo: the level curve xᵀSx = 1, its principal axes and its name ----------

function demoConic(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("a", -4, 6, 0.5, 5)}${slider("b", -4, 4, 0.5, 2)}${slider("c", -4, 6, 0.5, 2)}${slider("level k", 1, 8, 1, 6)}</div>`) +
    `<div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  const draw = ([a, b, c, k]) => {
    const { l1, l2, q1, q2 } = eigSym(a, b, c);
    const P = plane(4);
    const toX = (y1, y2) => [y1 * q1[0] + y2 * q2[0], y1 * q1[1] + y2 * q2[1]];
    let g = P.open + P.line(q1, "A") + P.line(q2, "C");
    const sgn = (v) => (v > 1e-9 ? "+" : v < -1e-9 ? "−" : "0");
    const s = sgn(l1) + sgn(l2);
    let name, axes = "";
    if (s === "++") {
      const pts = [];
      for (let t = 0; t <= 120; t++) { const u = (2 * Math.PI * t) / 120; pts.push(toX(Math.sqrt(k / l1) * Math.cos(u), Math.sqrt(k / l2) * Math.sin(u))); }
      g += P.path(P.clip(pts), "HL");
      name = `<b class="A">ellipse</b>`;
      axes = ` Half-axes √(k/λ): <b class="A">${num(Math.sqrt(k / l1))}</b> along q₁ and <b class="C">${num(Math.sqrt(k / l2))}</b> along q₂ — the larger eigenvalue gives the shorter axis.`;
    } else if (s === "+−") {
      for (const sg of [1, -1]) {
        const pts = [];
        for (let t = -60; t <= 60; t++) { const u = t / 20; pts.push(toX(sg * Math.sqrt(k / l1) * Math.cosh(u), Math.sqrt(k / -l2) * Math.sinh(u))); }
        g += P.path(P.clip(pts), "HL");
      }
      name = `<b class="C">hyperbola</b>`;
      axes = ` It crosses the q₁ line at distance ${num(Math.sqrt(k / l1))} and never meets the q₂ line.`;
    } else if (s === "−+" || s === "+0") {
      const lp = l1 > 1e-9 ? l1 : l2;
      for (const sg of [1, -1]) g += P.path([toX(sg * Math.sqrt(k / lp), -9), toX(sg * Math.sqrt(k / lp), 9)], "HL");
      name = `<b class="HL">two parallel lines</b> (a trough cut at height k)`;
    } else {
      name = `<b class="NO">no points</b>: xᵀSx is never positive`;
    }
    g += P.close;
    el.querySelector(".fc").innerHTML = g + `<figcaption>${num(a)}x² + ${num(2 * b)}xy + ${num(c)}y² = ${k}</figcaption>`;
    el.querySelector(".la-read").innerHTML = `Eigenvalues <b class="A">${num(l1)}</b>, <b class="C">${num(l2)}</b> (signs ${s}); in the rotated coordinates the curve is ${num(l1)}y₁² + ${num(l2)}y₂² = ${k}: ${name}.${axes}`;
  };
  if (opts.mini) {
    const sets = [[5, 2, 2, 6], [1, 3, 1, 4], [2, 4, 8, 4], [3, 0, 1, 3]];
    let i = 0;
    const tick = () => { draw(sets[i % sets.length]); i++; };
    tick(); setInterval(tick, 2600); return;
  }
  wireSliders(el, draw);
}

// ---------- Demo: gradient descent on L(w) = ½wᵀCw − bᵀw ----------

function demoGD(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("η", 0.02, 0.4, 0.01, 0.1)}</div><p class="la-read"></p>`;
  wireSliders(el, ([eta]) => {
    const C = [[5, 2], [2, 2]], b = [7, 4];
    let w = [0, 0];
    for (let k = 0; k < 50; k++) {
      const gr = [C[0][0] * w[0] + C[0][1] * w[1] - b[0], C[1][0] * w[0] + C[1][1] * w[1] - b[1]];
      w = [w[0] - eta * gr[0], w[1] - eta * gr[1]];
    }
    const err = Math.hypot(w[0] - 1, w[1] - 1), f1 = 1 - 6 * eta, f2 = 1 - eta, rate = Math.max(Math.abs(f1), Math.abs(f2));
    el.querySelector(".la-read").innerHTML = `Error factors per step: 1 − 6η = <b class="${Math.abs(f1) < 1 ? "A" : "HL"}">${num(f1)}</b> along (2, 1) and 1 − η = <b class="A">${num(f2)}</b> along (1, −2). ` +
      `Worst factor ${num(rate)}: ${rate < 1 ? `after 50 steps the error is <b class="A">${err.toExponential(2)}</b>` : `<b class="HL">the error grows</b> (to ${err.toExponential(2)} after 50 steps)`}. ` +
      `Convergence needs η < 2/6 = 0.333; the best η = 2/7 ≈ 0.286 gives rate 5/7 ≈ 0.714.`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "At a critical point the Hessian is [[4, 3], [3, 2]]. The point is", opts: ["a minimum", "a maximum", "a saddle"], a: 2,
    why: "det = 8 − 9 = −1 < 0: one positive and one negative eigenvalue." },
  { q: "S has eigenvalues 9 and 1. On unit vectors, xᵀSx ranges over", opts: ["[1, 9]", "[1, 3]", "[0, 9]"], a: 0,
    why: "The Rayleigh quotient lies between the smallest and largest eigenvalue." },
  { q: "A loss has Hessian eigenvalues 100 and 1. Gradient descent converges for", opts: ["η < 2", "η < 0.02", "every η"], a: 1,
    why: "Need |1 − 100η| < 1, so η < 2/100. The best rate, 99/101 ≈ 0.98 per step, is slow." },
  { q: "The ellipse 9x² + y² = 1 is longer in the", opts: ["x direction", "y direction"], a: 1,
    why: "Half-axes 1/√9 = 1/3 along x and 1 along y." },
  { q: "x = By with B invertible turns xᵀSx into yᵀ(BᵀSB)y. What is kept?", opts: ["the eigenvalues", "the numbers of positive and negative eigenvalues"], a: 1,
    why: "Sylvester's law of inertia; only an orthogonal B keeps the eigenvalues themselves." },
];

const DEMOS = {
  conic: (el) => demoConic(el),
  conicMini: (el) => demoConic(el, { mini: true }),
  gd: (el) => demoGD(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
