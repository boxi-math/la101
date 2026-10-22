// Interactive demos for LA101 Elective E4: minimum principles and finite elements.
// Every code panel is copied from notes/E4-minimum-principles-finite-elements.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  min: "import numpy as np\n\nK = np.array([[3.0, -1.0], [-1.0, 3.0]])\nf = np.array([4.0, 0.0])\nxs = np.linalg.solve(K, f)\n\n\ndef P(x, K=K, f=f):\n    x = np.asarray(x, dtype=float)\n    return float(0.5 * x @ K @ x - x @ f)\n\n\nprint(xs.tolist(), P(xs), -0.5 * float(f @ xs))\nfor x in [(1, 0), (2, 1), (1.4, 0.6)]:\n    e = np.array(x) - xs\n    print(x, round(P(x), 4), round(float(0.5 * e @ K @ e), 4))",
  saddle: "M = np.array([[1.0, 3.0], [3.0, 1.0]])\ng = np.array([4.0, 4.0])\nxm = np.linalg.solve(M, g)\nprint(np.round(xm, 10).tolist(), round(P(xm, M, g), 6), [round(P(xm + t * np.array([1, -1]), M, g), 6) for t in (1, 2, 3)])",
  springs: "A = np.array([[1.0, 0.0], [-1.0, 1.0], [0.0, -1.0]])\nCs = np.diag([2.0, 1.0, 2.0])\ne = A @ xs\nw = Cs @ e\nprint((A.T @ Cs @ A).tolist(), e.tolist(), w.tolist(), (A.T @ w).tolist())\nprint(0.5 * float(e @ Cs @ e), float(xs @ f))",
  ritz: "for v in [np.array([1.0, 1.0]), np.array([1.0, 0.0]), np.array([3.0, 1.0])]:\n    y = float(v @ f) / float(v @ K @ v)\n    xr = y * v\n    print(v.tolist(), round(y, 4), np.round(xr, 4).tolist(), round(P(xr), 4), round(float(v @ K @ (xr - xs)), 10) + 0.0)",
  barenergy: "xg = np.linspace(0, 1, 200_001)\n\n\ndef energy(u, du, f=lambda x: 1.0 + 0 * x):\n    return float(np.trapezoid(0.5 * du(xg) ** 2 - f(xg) * u(xg), xg))\n\n\na_s = 4 / np.pi**3\nprint(round(energy(lambda x: x * (1 - x) / 2, lambda x: 0.5 - x), 6), round(-1 / 24, 6))\nprint(round(energy(lambda x: a_s * np.sin(np.pi * x), lambda x: a_s * np.pi * np.cos(np.pi * x)), 6), round(-4 / np.pi**4, 6))\nprint(round(energy(lambda x: x * (1 - x) ** 2, lambda x: (1 - x) ** 2 - 2 * x * (1 - x)), 6))",
  fem3: "def fem(n, c=lambda x: 1.0, f=lambda x: 1.0):\n    \"\"\"Linear finite elements for -(c u')' = f, u(0) = u(1) = 0; c and f evaluated at element midpoints.\"\"\"\n    h = 1 / (n + 1)\n    nodes = np.linspace(0, 1, n + 2)\n    Kf = np.zeros((n + 2, n + 2))\n    Ff = np.zeros(n + 2)\n    for el in range(n + 1):\n        mid = (nodes[el] + nodes[el + 1]) / 2  # one-point (midpoint) rule for c and f on each element\n        Kf[el:el + 2, el:el + 2] += c(mid) / h * np.array([[1, -1], [-1, 1]])\n        Ff[el:el + 2] += f(mid) * h / 2\n    Kin, Fin = Kf[1:-1, 1:-1], Ff[1:-1]\n    return nodes, np.r_[0, np.linalg.solve(Kin, Fin), 0], Kin, Fin\n\n\nnodes, U, K3, F3 = fem(3)\nprint(K3.tolist(), F3.tolist())\nprint((U * 32).round(10).tolist(), (nodes * (1 - nodes) / 2 * 32).round(10).tolist())",
  err: "xx = np.linspace(0, 1, 2001)\nfor n in [1, 3, 7, 15, 31]:\n    nd, Un, _, _ = fem(n)\n    err = float(np.max(np.abs(np.interp(xx, nd, Un) - xx * (1 - xx) / 2)))\n    print(n, f\"{err:.4e}\", f\"{(1 / (n + 1)) ** 2 / 8:.4e}\")",
  sparse: "_, _, K99, _ = fem(99)\nprint(np.count_nonzero(K99), 99 * 99, np.count_nonzero(np.abs(np.linalg.inv(K99)) > 1e-12))\nprint(np.round(np.linalg.eigvalsh(K3), 4).tolist(), np.round(4 * (2 - np.sqrt(2)), 4), np.round(4 * (2 + np.sqrt(2)), 4))",
  twomat: "nd, U2, K2m, _ = fem(3, c=lambda x: 1.0 if x < 0.5 else 4.0)\nprint(K2m.tolist(), np.round(U2, 7).tolist())\n\n\ndef u_exact(x, a=0.35):\n    \"\"\"-(c u')' = 1 with c = 1 on [0, 1/2], 4 on [1/2, 1]: tension c u' = a - x, a fixed by u(1) = 0.\"\"\"\n    if x <= 0.5:\n        return float(a * x - x * x / 2)\n    return float((a * 0.5 - 0.125) + ((a * x - x * x / 2) - (a * 0.5 - 0.125)) / 4)\n\n\nprint([round(u_exact(t), 7) + 0.0 for t in nd], abs(u_exact(1.0)) < 1e-12)",
  claim: "for name, S in [(\"K\", K), (\"M\", M)]:\n    try:\n        np.linalg.cholesky(S)\n        print(name, \"positive definite\")\n    except np.linalg.LinAlgError:\n        print(name, \"not positive definite\")",
};

const OUT = {
  min: "[1.5, 0.5] -3.0 -3.0\n(1, 0) -2.5 0.5\n(2, 1) -2.5 0.5\n(1.4, 0.6) -2.96 0.04",
  saddle: "[1.0, 1.0] -4.0 [-6.0, -12.0, -22.0]",
  springs: "[[3.0, -1.0], [-1.0, 3.0]] [1.5, -1.0, -0.5] [3.0, -1.0, -1.0] [4.0, 0.0]\n3.0 6.0",
  ritz: "[1.0, 1.0] 1.0 [1.0, 1.0] -2.0 0.0\n[1.0, 0.0] 1.3333 [1.3333, 0.0] -2.6667 0.0\n[3.0, 1.0] 0.5 [1.5, 0.5] -3.0 0.0",
  barenergy: "-0.041667 -0.041667\n-0.041064 -0.041064\n-0.016667",
  fem3: "[[8.0, -4.0, 0.0], [-4.0, 8.0, -4.0], [0.0, -4.0, 8.0]] [0.25, 0.25, 0.25]\n[0.0, 3.0, 4.0, 3.0, 0.0] [0.0, 3.0, 4.0, 3.0, 0.0]",
  err: "1 3.1250e-02 3.1250e-02\n3 7.8125e-03 7.8125e-03\n7 1.9531e-03 1.9531e-03\n15 4.8825e-04 4.8828e-04\n31 1.2206e-04 1.2207e-04",
  sparse: "295 9801 9801\n[2.3431, 8.0, 13.6569] 2.3431 13.6569",
  twomat: "[[8.0, -4.0, 0.0], [-4.0, 20.0, -16.0], [0.0, -16.0, 32.0]] [0.0, 0.05625, 0.05, 0.0328125, 0.0]\n[0.0, 0.05625, 0.05, 0.0328125, 0.0] True",
  claim: "K positive definite\nM not positive definite",
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

// ---------- Demo: a chain of three springs, K = AᵀCA ----------

function solve2(K, f) {
  const d = K[0][0] * K[1][1] - K[0][1] * K[1][0];
  return [(K[1][1] * f[0] - K[0][1] * f[1]) / d, (K[0][0] * f[1] - K[1][0] * f[0]) / d];
}
const Pen = (K, f, x) => 0.5 * (x[0] * (K[0][0] * x[0] + K[0][1] * x[1]) + x[1] * (K[1][0] * x[0] + K[1][1] * x[1])) - (x[0] * f[0] + x[1] * f[1]);

function demoSprings(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("c₁", 0.5, 4, 0.5, 2)}${slider("c₂", 0.5, 4, 0.5, 1)}${slider("c₃", 0.5, 4, 0.5, 2)}${slider("f₁", -6, 6, 1, 4)}</div><p class="la-read"></p>`;
  wireSliders(el, ([c1, c2, c3, f1]) => {
    const K = [[c1 + c2, -c2], [-c2, c2 + c3]], f = [f1, 0];
    const x = solve2(K, f), e = [x[0], x[1] - x[0], -x[1]], w = [c1 * e[0], c2 * e[1], c3 * e[2]];
    const stored = 0.5 * (c1 * e[0] ** 2 + c2 * e[1] ** 2 + c3 * e[2] ** 2), work = x[0] * f[0];
    el.querySelector(".la-read").innerHTML = `K = AᵀCA = [[${num(K[0][0])}, ${num(K[0][1])}], [${num(K[1][0])}, ${num(K[1][1])}]]. ` +
      `Displacements x = (<b class="A">${num(x[0])}</b>, <b class="A">${num(x[1])}</b>); stretches (${e.map(num).join(", ")}); ` +
      `tensions (${w.map((v) => `<b class="${v >= 0 ? "A" : "C"}">${num(v)}</b>`).join(", ")}) (negative = compressed). ` +
      `Stored energy ${num(stored)}, work ${num(work)}, so P = <b class="HL">${num(stored - work)}</b> = −½ fᵀx.`;
  });
}

// ---------- Demo: the Ritz approximation along one trial vector ----------

function demoRitz(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("angle of v (degrees)", 0, 175, 5, 45)}</div><div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  const K = [[3, -1], [-1, 3]], f = [4, 0], xs = [1.5, 0.5];
  wireSliders(el, ([deg]) => {
    const t = (deg * Math.PI) / 180, v = [Math.cos(t), Math.sin(t)];
    const Kv = [K[0][0] * v[0] + K[0][1] * v[1], K[1][0] * v[0] + K[1][1] * v[1]];
    const y = (v[0] * f[0] + v[1] * f[1]) / (v[0] * Kv[0] + v[1] * Kv[1]), xr = [y * v[0], y * v[1]];
    const P = plane(3);
    let g = P.open + P.line(v, "C") + P.vec(xs, "A", "x*") + P.vec(xr, "HL", "x_R") + P.close;
    el.querySelector(".fc").innerHTML = g + `<figcaption>trial line (dashed) and the Ritz point</figcaption>`;
    const e = [xr[0] - xs[0], xr[1] - xs[1]];
    el.querySelector(".la-read").innerHTML = `Along v = (${num(v[0])}, ${num(v[1])}): y = vᵀf / vᵀKv = ${num(y)}, x_R = (${num(xr[0])}, ${num(xr[1])}). ` +
      `Ritz energy <b class="HL">${num(Pen(K, f, xr))}</b> ≥ true minimum <b class="A">−3</b>; the gap is the error energy ${num(Pen(K, f, xr) + 3)}. ` +
      `Galerkin check vᵀK(x_R − x*) = ${num(v[0] * (K[0][0] * e[0] + K[0][1] * e[1]) + v[1] * (K[1][0] * e[0] + K[1][1] * e[1]))}.`;
  });
}

// ---------- Demo: linear finite elements for −(c u′)′ = 1 on [0, 1] ----------

function femSolve(n, cr) {
  const h = 1 / (n + 1), c = (m) => (m < 0.5 ? 1 : cr);
  const a = Array(n).fill(0), b = Array(n).fill(0), cc = Array(n).fill(0), F = Array(n).fill(h);
  for (let e = 0; e <= n; e++) {
    const k = c((e + 0.5) * h) / h, i = e - 1, j = e;
    if (i >= 0) b[i] += k;
    if (j < n) b[j] += k;
    if (i >= 0 && j < n) { cc[i] = -k; a[j] = -k; }
  }
  // Thomas algorithm (tridiagonal elimination)
  const cp = [], dp = [];
  for (let i = 0; i < n; i++) {
    const m = b[i] - (i ? a[i] * cp[i - 1] : 0);
    cp.push(cc[i] / m);
    dp.push((F[i] - (i ? a[i] * dp[i - 1] : 0)) / m);
  }
  const U = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) U[i] = dp[i] - (i < n - 1 ? cp[i] * U[i + 1] : 0);
  return { h, U: [0, ...U, 0], nnz: 3 * n - 2 };
}
function uExact(x, cr) {
  // −(c u′)′ = 1, c = 1 on [0, ½], cr on [½, 1]: tension c u′ = a − x with u(1) = 0
  const a = (0.125 + (0.5 - 0.125) / cr) / (0.5 + 0.5 / cr);
  return x <= 0.5 ? a * x - x * x / 2 : a * 0.5 - 0.125 + (a * x - x * x / 2 - (a * 0.5 - 0.125)) / cr;
}

function femSvg(n, cr) {
  const W = 300, H = 170, sx = (x) => 20 + x * (W - 40), top = 0.15;
  const sy = (u) => H - 20 - (u / top) * (H - 40);
  const { h, U, nnz } = femSolve(n, cr);
  let ex = "", err = 0;
  for (let t = 0; t <= 200; t++) {
    const x = t / 200, ue = uExact(x, cr), k = Math.min(n, Math.floor(x / h)), xl = k * h;
    const uh = U[k] + ((U[k + 1] - U[k]) * (x - xl)) / h;
    err = Math.max(err, Math.abs(ue - uh));
    ex += `${sx(x).toFixed(1)},${sy(ue).toFixed(1)} `;
  }
  const fe = U.map((u, i) => `${sx(i * h).toFixed(1)},${sy(u).toFixed(1)}`).join(" ");
  const svg = `<svg class="la-plane" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <line class="axis" x1="${sx(0)}" y1="${sy(0)}" x2="${sx(1)}" y2="${sy(0)}"/>
    <polyline class="C" points="${ex}" style="fill:none" stroke-width="2"/>
    <polyline class="A" points="${fe}" style="fill:none" stroke-width="2"/>
    ${U.map((u, i) => `<circle class="A" cx="${sx(i * h).toFixed(1)}" cy="${sy(u).toFixed(1)}" r="3"/>`).join("")}
    ${cr !== 1 ? `<line class="grid" x1="${sx(0.5)}" y1="10" x2="${sx(0.5)}" y2="${H - 10}" stroke-dasharray="3 3"/>` : ""}</svg>`;
  return { svg, err, nnz, h };
}

function demoFEM(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("interior nodes n", 1, 31, 1, 3)}${slider("c on the right half", 1, 8, 1, 1)}</div>`) +
    `<div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  const draw = ([n, cr]) => {
    const { svg, err, nnz, h } = femSvg(n, cr);
    el.querySelector(".fc").innerHTML = svg + `<figcaption><b class="A">finite elements</b> and <b class="C">exact</b>, n = ${n}</figcaption>`;
    el.querySelector(".la-read").innerHTML = `h = ${num(h)}. Largest error between the nodes <b class="HL">${err.toExponential(2)}</b>` +
      (cr === 1 ? ` (h²/8 = ${(h * h / 8).toExponential(2)}).` : ` (two materials: the solution sags on the soft left side).`) +
      ` The nodal values are exact. K is tridiagonal: <b class="A">${nnz}</b> nonzeros out of ${n * n}.`;
  };
  if (opts.mini) {
    const sets = [[1, 1], [3, 1], [7, 1], [3, 4]];
    let i = 0;
    const tick = () => { draw(sets[i % sets.length]); i++; };
    tick(); setInterval(tick, 2600); return;
  }
  wireSliders(el, draw);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "K = diag(2, 8), f = (2, 4). The minimum value of P = ½xᵀKx − xᵀf is", opts: ["−2", "−4", "2"], a: 0,
    why: "x* = (1, ½), and P* = −½ fᵀx* = −½(2 + 2) = −2." },
  { q: "Two Ritz approximations give energies −1.9 and −2.1. The better one is", opts: ["−1.9", "−2.1", "cannot tell"], a: 1,
    why: "Every Ritz energy is above the true minimum, and the extra energy is the energy of the error: lower is closer." },
  { q: "The finite element K for n = 1000 interior nodes has how many nonzeros?", opts: ["1 000 000", "2998", "1000"], a: 1,
    why: "Tridiagonal: 3n − 2 = 2998." },
  { q: "For K = [[1, 3], [3, 1]], the solution of Kx = f is", opts: ["the minimum of P", "a saddle of P", "the maximum of P"], a: 1,
    why: "Eigenvalues 4 and −2: indefinite, so the flat point is a saddle." },
  { q: "One element of length h with stiffness c contributes", opts: ["(c/h)[[1, −1], [−1, 1]]", "c·h[[1, −1], [−1, 1]]", "(c/h)[[2, −1], [−1, 2]]"], a: 0,
    why: "Hat slopes are ±1/h, so ∫c φᵢ′φⱼ′ over the element is ±c/h: a spring of stiffness c/h." },
];

const DEMOS = {
  springs: (el) => demoSprings(el),
  ritz: (el) => demoRitz(el),
  fem: (el) => demoFEM(el),
  femMini: (el) => demoFEM(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
